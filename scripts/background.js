// MV3: Track initialization state to prevent concurrent startup operations
let isInitializing = false;
let initializationComplete = false;

// MV3: Track wake-up state to prevent concurrent wake-up operations
let isWakingUp = false;

// MV3: Simple debounce tracking (not persistent across service worker restarts)
let lastWakeUpTaskCall = 0;
const WAKE_UP_TASK_DEBOUNCE_MS = 500; // 500ms minimum between calls

chrome.runtime.onMessage.addListener(async msg => {
	if (msg.logOptions) sendToLogs(msg.logOptions);
	if (msg.wakeUp) await wakeUpTask();
	// MV3: Remove setTimeout delay - execute immediately for service worker reliability
	if (msg.close) {
		if (msg.tabId) chrome.tabs.remove(msg.tabId);
		if (msg.windowId) chrome.windows.remove(msg.windowId);
		// MV3: Catch promise rejection when popup is not open
		chrome.runtime.sendMessage({closePopup: true}).catch((e) => {
			console.warn('[Snoozz] Could not send closePopup message (popup may not be open):', e.message);
		});
	}
});
chrome.storage.onChanged.addListener(async changes => {
	if (changes.snoozedOptions) {
		await setUpContextMenus(changes.snoozedOptions.newValue.contextMenu);
		var activeTab = await getTabsInWindow(true);
		var tabId = activeTab && activeTab.id ? activeTab.id : null;
		updateBadge(null, changes.snoozedOptions.newValue.badge, tabId);
		if (changes.snoozedOptions.oldValue && changes.snoozedOptions.newValue.history !== changes.snoozedOptions.oldValue.history) await wakeUpTask();
	}
	if (changes.snoozed) {
		var activeTab = await getTabsInWindow(true);
		var tabId = activeTab && activeTab.id ? activeTab.id : null;
		await updateBadge(changes.snoozed.newValue, null, tabId);

		// Skip wakeUpTask during initialization to prevent duplicate wake-ups
		// The init() function will handle wake-ups directly
		if (isInitializing) {
			bgLog(['Storage changed during initialization, skipping wakeUpTask'], [''], 'blue');
			return;
		}

		// Skip wakeUpTask during wake-up to prevent duplicate wake-ups
		// This prevents race conditions when cleanUpHistory() or wakeMeUp() save tabs
		if (isWakingUp) {
			bgLog(['Storage changed during wake-up, skipping wakeUpTask'], [''], 'orange');
			return;
		}

		await wakeUpTask(changes.snoozed.newValue);
	}
});

// Listen for tab activation to update badge color
if (chrome.tabs && chrome.tabs.onActivated) {
	chrome.tabs.onActivated.addListener(async activeInfo => {
		var highlightEnabled = await getOptions('highlightSnoozedTab');
		if (highlightEnabled === false) return;
		var tabs = await getSnoozedTabs();
		await updateBadge(tabs, null, activeInfo.tabId);
	});
}

// Listen for tab updates (URL changes) to update badge color
if (chrome.tabs && chrome.tabs.onUpdated) {
	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (!changeInfo.url) return;
		var highlightEnabled = await getOptions('highlightSnoozedTab');
		if (highlightEnabled === false) return;
		if (tab.active) {
			var tabs = await getSnoozedTabs();
			await updateBadge(tabs, null, tabId);
		}
	});
}

// Listen for window focus changes to update badge color
if (chrome.windows && chrome.windows.onFocusChanged) {
	chrome.windows.onFocusChanged.addListener(async windowId => {
		if (windowId === chrome.windows.WINDOW_ID_NONE) return;
		var highlightEnabled = await getOptions('highlightSnoozedTab');
		if (highlightEnabled === false) return;
		var activeTab = await getTabsInWindow(true);
		if (activeTab && activeTab.id) {
			var tabs = await getSnoozedTabs();
			await updateBadge(tabs, null, activeTab.id);
		}
	});
}

if (chrome.notifications) chrome.notifications.onClicked.addListener(async id => {
	await chrome.notifications.clear(id)
	if (id === '_wakeUpNow') return await wakeUpTask();
	var t = await getSnoozedTabs(id);
	if (t && t.id && id && id.length) {
		var found = t.tabs ? await findTabAnywhere(null, t.id) : await findTabAnywhere(t.url);
		if (found && found.id && found.windowId) {
			try {
				await chrome.windows.update(found.windowId, {focused: true});
				if (t.tabs) {
					var winTabs = await getTabsInWindow();
					await chrome.tabs.update(winTabs[0] && winTabs[0].id ? winTabs[0].id : found.id, {active: true});
				} else {
					await chrome.tabs.update(found.id, {active: true});
				}
				return;
			} catch (e) {}
		}
	}
	await openExtensionTab('html/nap-room.html');
});

async function wakeUpTask(cachedTabs) {
	var now = Date.now();
	var timeSinceLastCall = now - lastWakeUpTaskCall;

	bgLog(['>>> wakeUpTask() called', cachedTabs ? '(with cached tabs)' : '(reading from storage)'], ['', 'blue'], 'cyan');

	// Check if already waking up - block ALL calls including cached tabs
	// This prevents race condition when storage.onChanged fires during cleanUpHistory
	if (isWakingUp) {
		bgLog(['wakeUpTask: Already waking up, skipping duplicate call' + (cachedTabs ? ' (cached tabs ignored)' : '')], [''], 'orange');
		return;
	}

	// Debounce rapid-fire calls (but allow explicit cached tabs to bypass)
	if (!cachedTabs && timeSinceLastCall < WAKE_UP_TASK_DEBOUNCE_MS) {
		bgLog(['wakeUpTask debounced (called', timeSinceLastCall, 'ms ago)'], ['', 'blue', ''], 'blue');
		return;
	}

	// Set lock BEFORE any operations that might trigger storage changes
	if (!cachedTabs) {
		isWakingUp = true;
		bgLog(['wakeUpTask: Setting isWakingUp lock'], [''], 'magenta');
	}

	try {
		lastWakeUpTaskCall = now;

		var tabs = cachedTabs || await getSnoozedTabs();
		if (!tabs || !tabs.length || tabs.length === 0) return;
		await cleanUpHistory(tabs);
		if (sleeping(tabs).length === 0) {
			bgLog(['No tabs are asleep'],['pink'], 'pink');
			return chrome.alarms.clear('wakeUpTabs');
		}
		await setNextAlarm(tabs);
		bgLog(['<<< wakeUpTask() finished'], [''], 'cyan');
	} finally {
		if (!cachedTabs) {
			isWakingUp = false;
			bgLog(['wakeUpTask: Released isWakingUp lock'], [''], 'magenta');
		}
	}
}

// MV3: Removed debounce variable - not reliable in service workers that can terminate
async function setNextAlarm(tabs) {
	var next = sleeping(tabs).filter(t => t.wakeUpTime && !t.paused);
	next = next.length ? next.reduce((t1,t2) => t1.wakeUpTime < t2.wakeUpTime ? t1 : t2) : undefined;
	if (!next) return;
	if (next.wakeUpTime <= dayjs().valueOf()) {
		// MV3: Wake immediately if already past wake time (no debounce delay)
		// wakeMeUp processes all tabs that need waking, so no need to batch
		await wakeMeUp(tabs);
	} else {
		var oneHour = dayjs().add(1, 'h').valueOf();
		bgLog(['Next tab waking up:', next.id, 'at', dayjs(next.wakeUpTime).format('HH:mm:ss DD/MM/YY')],['','green','','yellow'])
		await createAlarm(next.wakeUpTime < oneHour ? next.wakeUpTime : oneHour, next.wakeUpTime < oneHour);
	}
}

async function wakeMeUp(tabs) {
	var now = dayjs().valueOf();
	var OPENING_WINDOW_MS = 15000; // Increased from 5s to 15s for windows that take longer to open

	bgLog(['=== wakeMeUp() CALLED ==='], [''], 'magenta');

	var wakingUp = t => {
		if (t.opened) return false;
		if (t.paused) return false;

		// Skip if another concurrent wake-up is already processing this tab
		if (t.openingAttempted && (now - t.openingAttempted) < OPENING_WINDOW_MS) {
			bgLog(['Skipping tab (opening in progress):', t.id, 'attempted', dayjs().to(dayjs(t.openingAttempted))], ['', 'orange', '', 'orange'], 'orange');
			return false;
		}

		if (!t.url && (!t.tabs || !t.tabs.length || t.tabs.length === 0)) return false;
		if (!t.wakeUpTime || t.wakeUpTime > now) return false;
		return true;
	};

	var tabsToWakeUp = tabs.filter(wakingUp);
	if (tabsToWakeUp.length === 0) {
		bgLog(['wakeMeUp: No tabs to wake up'], [''], 'grey');
		return;
	}

	bgLog(['Waking up tabs', tabsToWakeUp.map(t => t.id).join(', ')], ['', 'green'], 'yellow');

	// Log details about each tab being woken up
	for (var t of tabsToWakeUp) {
		var type = t.tabs ? (t.selection ? 'selection' : 'window') : 'tab';
		var tabCount = t.tabs ? t.tabs.length : 1;
		bgLog(['  → Opening', type, t.id, 'with', tabCount, 'tab(s)'], ['', 'yellow', 'green', '', 'yellow', ''], 'grey');
	}

	// Mark opening attempt to prevent concurrent duplicates
	tabsToWakeUp.forEach(t => t.openingAttempted = now);
	tabs.filter(t => tabsToWakeUp.includes(t) && !t.repeat).forEach(t => t.opened = now);

	for (var s of tabs.filter(t => tabsToWakeUp.includes(t) && t.repeat)) {
		var next = await calculateNextSnoozeTime(s.repeat);
		s.wakeUpTime = next.valueOf();
	}

	// Save with openingAttempted flag to prevent race condition
	await saveTabs(tabs);

	for (var s of tabsToWakeUp) s.tabs ? (s.selection ? await openSelection(s, true) : await openWindow(s, true)) : await openTab(s, null, true);

	bgLog(['=== wakeMeUp() FINISHED ==='], [''], 'magenta');

	// Don't delete openingAttempted immediately - let cleanUpHistory handle stale timestamps
	// This prevents race conditions where a second wakeUpTask reads tabs after we delete the flag but before saving
}

async function setUpContextMenus(cachedMenus) {
	var cm = cachedMenus || await getOptions('contextMenu');
	if (!cm || !cm.length || cm.length === 0) return;
	var choices = await getChoices();
	var contexts = getBrowser() === 'firefox' ? ['link', 'tab'] : ['link'];
	if (cm.length === 1) {
		await chrome.contextMenus.removeAll();
		await chrome.contextMenus.create({
			id: cm[0],
			contexts: contexts,
			title: `Snoozz ${choices[cm[0]].label.toLowerCase()}`,
			documentUrlPatterns: ['<all_urls>'],
			...(getBrowser() === 'firefox') ? {icons: {32: `../icons/${cm[0]}.png`}} : {}
		});
	} else {
		await chrome.contextMenus.removeAll();
		await chrome.contextMenus.create({id: 'snoozz', contexts: contexts, title: 'Snoozz', documentUrlPatterns: ['<all_urls>']})
		for (var o of cm) await chrome.contextMenus.create({
			parentId: 'snoozz',
			id: o,
			contexts: contexts,
			title: choices[o].menuLabel,
			...(getBrowser() === 'firefox') ? {icons: {32: `../icons/${o}.png`}} : {}
		});
	}
	// MV3: Event listeners moved to top level (see below) to prevent duplicate registration
}

// MV3: Context menu event listeners at top level to prevent duplicate registration
chrome.contextMenus.onClicked.addListener(snoozeInBackground);
if (getBrowser() === 'firefox') chrome.contextMenus.onShown.addListener(contextMenuUpdater);

if (chrome.commands) chrome.commands.onCommand.addListener(async (command, tab) => {
	if (command === 'nap-room') return openExtensionTab('/html/nap-room.html');
	tab = tab || await getTabsInWindow(true);
	await snoozeInBackground({menuItemId: command, pageUrl: tab.url}, tab)
})

async function snoozeInBackground(item, tab) {
	var c = await getChoices(item.menuItemId);
	
	var isHref = item.linkUrl && item.linkUrl.length;
	var url = isHref ? item.linkUrl : item.pageUrl;
	if(!isValid({url})) return createNotification(null, `Can't snoozz that :(`, 'icons/ext-icon-128.png', 'The link you are trying to snooze is invalid.', true);

	var snoozeTime = c && c.time;
	if (c && ['weekend', 'monday', 'week', 'month'].includes(item.menuItemId)) snoozeTime = await getTimeWithModifier(item.menuItemId);
	if (!snoozeTime || c.disabled || dayjs().isAfter(dayjs(snoozeTime))) {
		return createNotification(null, `Can't snoozz that :(`, 'icons/ext-icon-128.png', 'The time you have selected is invalid.', true);
	}
	// add attributes
	var startUp = item.menuItemId === 'startup' ? true : undefined;
	var title = !isHref ? tab.title : (item.linkText ? item.linkText : item.selectionText);
	var wakeUpTime = snoozeTime.valueOf();
	var pinned = !isHref && tab.pinned ? tab.pinned : undefined;
	var assembledTab = Object.assign(item, {url, title, pinned, startUp, wakeUpTime})

	var snoozed = await snoozeTab(item.menuItemId === 'startup' ? 'startup' : snoozeTime.valueOf(), assembledTab);
	
	var msg = `${!isHref ? tab.title : getHostname(url)} will wake up ${formatSnoozedUntil(assembledTab)}.`
	createNotification(snoozed.tabDBId, 'A new tab is now napping :)', 'icons/ext-icon-128.png', msg, true);

	if (!isHref) await chrome.tabs.remove(tab.id);
	// MV3: Catch promise rejection when dashboard is not open
	chrome.runtime.sendMessage({updateDash: true}).catch((e) => {
		console.warn('[Snoozz] Could not send updateDash message (dashboard may not be open):', e.message);
	});
}

async function contextMenuUpdater(menu) {
	var choices = await getChoices();
	for (c of menu.menuIds) {
		if (choices[c]) await chrome.contextMenus.update(c, {enabled: !choices[c].disabled});
	}
	await chrome.contextMenus.refresh();
}

async function cleanUpHistory(tabs) {
	var h = await getOptions('history') || 365;
	var now = dayjs().valueOf();

	// Remove orphaned opening timestamps (e.g. from service worker termination or completed wake-ups)
	var STALE_THRESHOLD_MS = 15000; // 15 seconds - enough time for windows to open completely
	var tabsWithStaleTimestamps = tabs.filter(t =>
		t.openingAttempted && (now - t.openingAttempted) > STALE_THRESHOLD_MS
	);
	if (tabsWithStaleTimestamps.length > 0) {
		bgLog(['Cleaning stale openingAttempted timestamps:', tabsWithStaleTimestamps.map(t => t.id).join(', ')], ['', 'blue'], 'blue');
		tabsWithStaleTimestamps.forEach(t => delete t.openingAttempted);
		await saveTabs(tabs);
	}

	var tabsToDelete = tabs.filter(t => h && t.opened && dayjs().isAfter(dayjs(t.opened).add(h, 'd')));
	if (tabsToDelete.length === 0) return;
	bgLog(['Deleting old tabs automatically:',tabsToDelete.map(t => t.id)],['','red'], 'red')
	await saveTabs(tabs.filter(t => !tabsToDelete.includes(t)));
}

async function setUpExtension() {
	var snoozed = await getSnoozedTabs();
	if (!snoozed || !snoozed.length || snoozed.length === 0) await saveTabs([]);

	// Clean up any stale opening timestamps on startup
	if (snoozed && snoozed.length > 0) {
		var needsCleanup = snoozed.some(t => t.openingAttempted);
		if (needsCleanup) {
			bgLog(['Migrating data: removing openingAttempted timestamps'], [''], 'blue');
			snoozed.forEach(t => delete t.openingAttempted);
			await saveTabs(snoozed);
		}
	}

	var options = await getOptions();
	options = Object.assign(DEFAULT_OPTIONS, options);
	options = upgradeSettings(options);
	await saveOptions(options);
	await init();
}
function sendToLogs([which, p1]) {
	try {
		if (['tab', 'window', 'group', 'selection'].includes(which)) bgLog(['Snoozing a new ' + which, p1.id, 'till', dayjs(p1.wakeUpTime).format('HH:mm:ss DD/MM/YY')],['', 'green', '', 'yellow'],'green')
		if (which === 'history') bgLog(['Sending tabs to history:', p1.join(', ')], ['', 'green'], 'blue');
		if (which === 'manually') bgLog(['Waking up tabs manually:', p1.join(', ')], ['', 'green'], 'blue');
		if (which === 'delete') bgLog(['Deleting tabs manually:', p1.join(', ')], ['', 'red'], 'red');
	} catch (e) {console.log('logError', e, which, p1)}
}

async function init() {
	bgLog(['### INIT() STARTED ###'], [''], 'yellow');

	// Prevent concurrent initialization
	if (isInitializing) {
		bgLog(['Init already in progress, skipping duplicate call'], [''], 'orange');
		return;
	}

	isInitializing = true;

	try {
		var allTabs = await getSnoozedTabs();
		bgLog(['init: Found', allTabs.length, 'total tabs in storage'], ['', 'blue', ''], 'grey');

		var contextMenuPromise = setUpContextMenus(); // Start in parallel

		// Check if any startup tabs need their wake time adjusted
		var startupTabs = allTabs && allTabs.length ?
			allTabs.filter(t => (t.startUp || (t.repeat && t.repeat.type === 'startup')) && !t.opened) : [];

		if (startupTabs.length > 0) {
			bgLog(['Found startup tabs to wake:', startupTabs.map(t => t.id).join(', ')], ['', 'green'], 'green');
			// Modify wake times in-place
			startupTabs.forEach(t => t.wakeUpTime = dayjs().subtract(10, 's').valueOf());
			// Save once, then call wakeUpTask directly with modified tabs
			await saveTabs(allTabs);
			// Call wakeUpTask immediately with the already-modified tabs (bypasses storage read)
			await wakeUpTask(allTabs);
		} else {
			bgLog(['No startup tabs found, checking for overdue tabs'], [''], 'grey');
			// No startup tabs, just ensure alarms are set correctly
			await wakeUpTask(allTabs);
		}

		await contextMenuPromise; // Wait for context menus
		initializationComplete = true;
		bgLog(['### INIT() COMPLETE ###'], [''], 'yellow');
	} finally {
		isInitializing = false;
	}
}

chrome.runtime.onInstalled.addListener(async details => {
	// MV3: Must await async initialization to ensure it completes before service worker terminates
	bgLog(['onInstalled fired:', details.reason], ['', 'yellow'], 'yellow');
	await setUpExtension();
	await init();

	if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL('https://snoozz.me/bye');
	if (details && details.reason && details.reason == 'install') await new Promise(r => chrome.tabs.create({url: 'https://rohan.xyz', active: true}, r));
	if (details && details.reason && details.reason == 'update' && details.previousVersion && details.previousVersion != chrome.runtime.getManifest().version) {
		if (chrome.runtime.getManifest().version.search(/^\d{1,3}(\.\d{1,3}){1,2}$/) !== 0) return;		// skip if minor version
		await new Promise(r => chrome.storage.local.set({'updated': true}, r));
		if (chrome.notifications) createNotification(null, 'Snoozz has been updated', 'icons/ext-icon-128.png', 'Click here to see what\'s new.', true);
	}
});

chrome.runtime.onStartup.addListener(async () => {
	bgLog(['********** onStartup FIRED **********'], [''], 'yellow');
	bgLog(['  Browser/Computer just started'], [''], 'grey');
	// Wait briefly if initialization is already in progress from onInstalled
	// This handles the race condition when both events fire simultaneously
	if (isInitializing) {
		bgLog(['Waiting for onInstalled initialization to complete...'], [''], 'blue');
		// Wait up to 5 seconds for initialization to complete
		for (let i = 0; i < 50; i++) {
			if (initializationComplete) {
				bgLog(['Initialization already complete, skipping duplicate init'], [''], 'green');
				return;
			}
			await new Promise(r => setTimeout(r, 100));
		}
		bgLog(['Timeout waiting for initialization, proceeding with init'], [''], 'orange');
	}
	await init();
	bgLog(['********** onStartup FINISHED **********'], [''], 'yellow');
});
chrome.alarms.onAlarm.addListener(async a => {
	if (a.name === 'wakeUpTabs') {
		bgLog(['########## ALARM FIRED ##########'], [''], 'yellow');
		bgLog(['  Scheduled alarm triggered'], [''], 'grey');
		await wakeUpTask();
		bgLog(['########## ALARM FINISHED ##########'], [''], 'yellow');
	}
});
if (chrome.idle) chrome.idle.onStateChanged.addListener(async s => {
	bgLog(['~~~~~~~~~~ IDLE STATE CHANGED:', s, '~~~~~~~~~~'], ['', 'yellow', ''], 'yellow');
	if (s === 'active' || getBrowser() === 'firefox') {
		bgLog(['  Computer woke up from idle/sleep'], [''], 'grey');
		if (navigator && navigator.onLine === false) {
			bgLog(['  Offline - waiting for network connection'], [''], 'orange');
			// MV3: Use self instead of window in service worker context
			self.addEventListener('online', async _ => {
				bgLog(['  Network back online, calling wakeUpTask'], [''], 'green');
				await wakeUpTask();
			}, {once: true});
		} else {
			await wakeUpTask();
		}
		bgLog(['~~~~~~~~~~ IDLE HANDLER FINISHED ~~~~~~~~~~'], [''], 'yellow');
	}
});