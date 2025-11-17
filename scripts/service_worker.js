// ====== dayjs.min.js ======
// DayJS Core
globalThis.dayjs=function(){"use strict";var t=1e3,n=6e4,e=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",h="month",f="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,M=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,n,e){var r=String(t);return!r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},g={s:m,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return(n<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(n,e){if(n.date()<e.date())return-t(e,n);var r=12*(e.year()-n.year())+(e.month()-n.month()),i=n.clone().add(r,h),s=e-i<0,u=n.clone().add(r+(s?-1:1),h);return+(-(r+(e-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:h,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=y;var S=function(t){return t instanceof _},p=function(t,n,e){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),n&&(v[t]=n,r=t);else{var i=t.name;v[i]=t,r=i}return!e&&r&&(D=r),r||!e&&D},w=function(t,n){if(S(t))return t.clone();var e="object"==typeof n?n:{};return e.date=t,e.args=arguments,new _(e)},O=g;O.l=p,O.i=S,O.w=function(t,n){return w(t,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var _=function(){function y(t){this.$L=p(t.locale,null,!0),this.parse(t)}var m=y.prototype;return m.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(O.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return e?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(n)}(t),this.$x=t.x||{},this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return O},m.isValid=function(){return!(this.$d.toString()===$)},m.isSame=function(t,n){var e=w(t);return this.startOf(n)<=e&&e<=this.endOf(n)},m.isAfter=function(t,n){return w(t)<this.startOf(n)},m.isBefore=function(t,n){return this.endOf(n)<w(t)},m.$g=function(t,n,e){return O.u(t)?this[n]:this.set(e,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,n){var e=this,r=!!O.u(n)||n,f=O.p(t),$=function(t,n){var i=O.w(e.$u?Date.UTC(e.$y,n,t):new Date(e.$y,n,t),e);return r?i:i.endOf(a)},l=function(t,n){return O.w(e.toDate()[t].apply(e.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(n)),e)},M=this.$W,y=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(f){case c:return r?$(1,0):$(31,11);case h:return r?$(1,y):$(0,y+1);case o:var D=this.$locale().weekStart||0,v=(M<D?M+7:M)-D;return $(r?m-v:m+(6-v),y);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,n){var e,o=O.p(t),f="set"+(this.$u?"UTC":""),$=(e={},e[a]=f+"Date",e[d]=f+"Date",e[h]=f+"Month",e[c]=f+"FullYear",e[u]=f+"Hours",e[s]=f+"Minutes",e[i]=f+"Seconds",e[r]=f+"Milliseconds",e)[o],l=o===a?this.$D+(n-this.$W):n;if(o===h||o===c){var M=this.clone().set(d,1);M.$d[$](l),M.init(),this.$d=M.set(d,Math.min(this.$D,M.daysInMonth())).$d}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,n){return this.clone().$set(t,n)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,f){var d,$=this;r=Number(r);var l=O.p(f),M=function(t){var n=w($);return O.w(n.date(n.date()+Math.round(t*r)),$)};if(l===h)return this.set(h,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return M(1);if(l===o)return M(7);var y=(d={},d[s]=n,d[u]=e,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*y;return O.w(m,this)},m.subtract=function(t,n){return this.add(-1*t,n)},m.format=function(t){var n=this;if(!this.isValid())return $;var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=O.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,h=i.months,f=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:f(i.monthsShort,a,h,3),MMMM:f(h,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:f(i.weekdaysMin,this.$W,o,2),ddd:f(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:r};return e.replace(M,(function(t,n){return n||l[t]||r.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,M=O.p(d),y=w(r),m=(y.utcOffset()-this.utcOffset())*n,g=this-y,D=O.m(this,y);return D=(l={},l[c]=D/12,l[h]=D,l[f]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/e,l[s]=g/n,l[i]=g/t,l)[M]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(h).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,n){if(!t)return this.$L;var e=this.clone(),r=p(t,n,!0);return r&&(e.$L=r),e},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},y}(),Y=_.prototype;return w.prototype=Y,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",h],["$y",c],["$D",d]].forEach((function(t){Y[t[1]]=function(n){return this.$g(n,t[0],t[1])}})),w.extend=function(t,n){return t.$i||(t(n,_,w),t.$i=!0),w},w.locale=p,w.isDayjs=S,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}();

// 	relativeTime plugin
globalThis.p_relativeTime=function(){"use strict";return function(r,t,n){r=r||{};var e=t.prototype,o={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function a(r,t,n,o){return e.fromToBase(r,t,n,o)}function i(r){return r.$u?n.utc():n()}n.en.relativeTime=o,e.fromToBase=function(t,e,a,i,u){for(var d,s,f=a.$locale().relativeTime||o,h=r.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],l=h.length,m=0;m<l;m+=1){var c=h[m];c.d&&(d=i?n(t).diff(a,c.d,!0):a.diff(t,c.d,!0));var y=(r.rounding||Math.round)(Math.abs(d)),p=0<d;if(y<=c.r||!c.r){var v=f[(c=y<=1&&0<m?h[m-1]:c).l];u&&(y=u(""+y)),s="string"==typeof v?v.replace("%d",y):v(y,e,c.l,p);break}}if(e)return s;var M=p?f.future:f.past;return"function"==typeof M?M(s):M.replace("%s",s)},e.to=function(r,t){return a(r,t,this,!0)},e.from=function(r,t){return a(r,t,this)},e.toNow=function(r){return this.to(i(this),r)},e.fromNow=function(r){return this.from(i(this),r)}}}();
dayjs.extend(globalThis.p_relativeTime)

//  weekday plugin
globalThis.p_weekday=function(){"use strict";return function(t,e){e.prototype.weekday=function(t){var e=this.$locale().weekStart||0,a=this.$W;return e=(a<e?a+7:a)-e,this.$utils().u(t)?e:this.subtract(e,"day").add(t,"day")}}}();
dayjs.extend(globalThis.p_weekday)

//  dayofyear plugin
globalThis.p_dayOfYear=function(){"use strict";return function(t,a){a.prototype.dayOfYear=function(t){var a=Math.round((this.startOf("day")-this.startOf("year"))/864e5)+1;return null==t?a:this.add(t-a,"day")}}}();
dayjs.extend(globalThis.p_dayOfYear)

//  weekofyear plugin
globalThis.p_weekOfYear=function(){"use strict";var t="week",e="year";return function(i,r,s){(r=r.prototype).week=function(i){if(null!==(i=void 0===i?null:i))return this.add(7*(i-this.week()),"day");var r=this.$locale().yearStart||1;if(11===this.month()&&25<this.date()){var a=s(this).startOf(e).add(1,e).date(r);if(i=s(this).endOf(t),a.isBefore(i))return 1}return r=s(this).startOf(e).date(r).startOf(t).subtract(1,"millisecond"),(r=this.diff(r,t,!0))<0?s(this).startOf("week").week():Math.ceil(r)},r.weeks=function(t){return this.week(t=void 0===t?null:t)}}}();
dayjs.extend(globalThis.p_weekOfYear)

// ====== common.js ======
// MV3: colours only needed in UI contexts (popup, nap-room, rise), not in service worker
var colours = (typeof window !== 'undefined' && window.gradientSteps) ? gradientSteps('#F3B845', '#DF4E76', 100) : [];
function getBrowser() {
	// MV3: Check if document/window exist for service worker compatibility
	if (!!navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) && typeof document !== 'undefined' && typeof document.body !== 'undefined' && typeof document.body.style.webkitFilter !== 'undefined') return 'safari';
	if (typeof window !== 'undefined' && !!window.sidebar) return 'firefox';
	// MV3: In service workers, detect Firefox via user agent
	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) return 'firefox';
	return 'chrome';
}
/*	ASYNCHRONOUS FUNCTIONS	*/
/*	GET 	*/
async function getSnoozedTabs(ids) {
	var p = await new Promise(r => chrome.storage.local.get('snoozed', r));
	if (!p.snoozed) return [];
	if (!ids || (ids.length && ids.length === 0)) return p.snoozed;
	var found = p.snoozed.filter(s => s.id && (ids.length ? ids.includes(s.id) : ids === s.id));
	return found.length === 1 ? found[0] : found;
}
async function getOptions(keys) {
	var p = await new Promise(r => chrome.storage.local.get('snoozedOptions', r));
	if (!p.snoozedOptions) return [];
	if (!keys) return p.snoozedOptions;
	if (typeof keys === 'string') return p.snoozedOptions[keys];
	return Object.keys(p.snoozedOptions).filter(k => keys.includes(k)).reduce((o, k) => {o[k] = p.snoozedOptions[k];return o},{});
	
}
async function getTabsInWindow(active) {
	if (getBrowser() === 'safari') active = true;
	var p = new Promise(r => chrome.tabs.query({active: active, currentWindow: true}, r));
	if (!active) return p;
	var tabs = await p;
	return tabs[0];
}
async function getAllWindows() {
	return new Promise(r => chrome.windows.getAll({windowTypes: ['normal']}, r));
}
async function getTabId(url) {
	var tabsInWindow = await getTabsInWindow();
	if (!tabsInWindow.length) tabsInWindow = [tabsInWindow];
	var foundTab  = tabsInWindow.find(t => t.url === url);
	return foundTab ? parseInt(foundTab.id) : false; 
}
async function findTabAnywhere(url, tabDBId) {
	var wins = await getAllWindows(), found = false;
	if (!wins || !wins.length) return found;
	for (var wid of wins.map(w => w.id)) {
		if (found) return;
		var tabs = await new Promise(r => chrome.tabs.query({windowId: wid}, r));
		if (url && tabs && tabs.some(t => t.url === url)) return found = tabs.find(t => t.url === url);
		if (!url && tabdDBId && tabs && tabs.some(t => t.url.indexOf(tabDBId) > -1)) return found = tabs.find(t => t.url.indexOf(tabDBId) > -1);
	}
	return found;
}
async function getKeyBindings() {
	if (!chrome.commands) return [];
	return new Promise(r => chrome.commands.getAll(r));
}
async function getStorageSize() {
	if (getBrowser() !== 'firefox') return new Promise(r => chrome.storage.local.getBytesInUse(r));
	var tabs = await getSnoozedTabs();
	var options = await getOptions();
	return calcObjectSize(tabs) + calcObjectSize(options);
}
async function isIncognitoAllowed() {
	return new Promise(r => chrome.extension.isAllowedIncognitoAccess(r));
}

/*	SAVE 	*/
async function saveOption(key, val) {
	if (!key || !val) return;
	var o = await getOptions();
	o[key] = val;
	await saveOptions(o);
}
async function saveOptions(o) {
	if (!o) return;
	return new Promise(r => chrome.storage.local.set({'snoozedOptions': o}, r));
}
async function saveTab(t) {
	if (!t || !t.id) return;
	var tabs = await getSnoozedTabs();
	if (tabs.some(tab => tab.id === t.id)) {
		tabs[tabs.findIndex(tab => tab.id === t.id)] = t;
	} else {
		tabs.push(t);
	}
	await saveTabs(tabs);
}
async function saveTabs(tabs) {
	if (!tabs) return;
	return new Promise(r => chrome.storage.local.set({'snoozed': tabs}, r));
}
/*	CREATE 	*/
async function createAlarm(when, willWakeUpATab) {
	bgLog(['Next Alarm at', dayjs(when).format('HH:mm:ss DD/MM/YY')], ['', willWakeUpATab ? 'yellow':'white'])
	await chrome.alarms.create('wakeUpTabs', {when});
}
async function createNotification(id, title, imgUrl, message, force) {
	var n = await getOptions('notifications');
	if (n === 'sound') try { new Audio(chrome.runtime.getURL('sounds/appointed.mp3')).play()} catch (e){}
	if (!chrome.notifications || (n && n === 'off' && !force)) return;
	// MV3: Wrap notification creation in try-catch to handle image download failures gracefully
	try {
		await chrome.notifications.create(id, {type: 'basic', iconUrl: chrome.runtime.getURL(imgUrl), title, message});
	} catch (e) {
		console.warn('[Snoozz] Could not create notification:', e.message, '(title:', title, ', imgUrl:', imgUrl, ')');
	}
}
async function createWindow(tabId, incognito) {
	if (tabId) return new Promise(r => chrome.windows.create({url: `/html/rise-and-shine.html#${tabId}`}, r));
	return new Promise(r => chrome.windows.create({incognito}, r));
}

/*	CONFIGURE	*/

async function setTheme() {
	// MV3: Only run in UI contexts (popup, settings, etc.), not in service worker
	if (typeof document === 'undefined') return;
	var t = await getOptions('theme');
	if (t === 'system') t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	document.body.classList.toggle('dark', t === 'dark');
}
// MV3: Only call setTheme() in UI contexts (where document exists)
if (typeof document !== 'undefined') {
	setTheme();
}

var HOUR_FORMAT = 12;
async function fetchHourFormat() {
	var t = await getOptions('hourFormat');
	HOUR_FORMAT = t && [24, 12].includes(t) ? t : 12;
}

async function updateBadge(cachedTabs, cachedBadge) {
	var num = 0;
	var badge = cachedBadge || await getOptions('badge');
	var tabs = cachedTabs || await getSnoozedTabs();
	tabs = sleeping(tabs);
	if (tabs.length > 0 && badge && ['all','today'].includes(badge)) num = badge === 'today' ? today(tabs).length : tabs.length;
	// MV3: chrome.browserAction → chrome.action (fallback to browserAction for MV2 compatibility)
	const actionAPI = chrome.action || chrome.browserAction;
	// MV3: Safety check - APIs might not be ready during service worker initialization
	if (!actionAPI) return;
	actionAPI.setBadgeText({text: num > 0 ? num.toString() : ''});
	actionAPI.setBadgeBackgroundColor({color: '#0072BC'});
}

/*	OPEN 	*/

// open tab for an extension page
async function openExtensionTab(url) {
	if (getBrowser() === 'safari') url = chrome.runtime.getURL(url);
	var tabs = await getTabsInWindow();
	if (getBrowser() === 'safari' && !tabs.length) tabs = [tabs];
	var extTabs = tabs.filter(t => isDefault(t));
	if (extTabs.length === 1){chrome.tabs.update(extTabs[0].id, {url, active: true})}
	else if (extTabs.length > 1) {
		var activeTab = extTabs.some(et => et.active) ? extTabs.find(et => et.active) : extTabs.reduce((t1, t2) => t1.index > t2.index ? t1 : t2);
		chrome.tabs.update(activeTab.id, {url, active: true});
		chrome.tabs.remove(extTabs.filter(et => et !== activeTab).map(t => t.id))		
	} else {
		var activeTab = tabs.find(t => t.active);
		if (activeTab && ['New Tab', 'Start Page'].includes(activeTab.title)) {chrome.tabs.update(activeTab.id, {url})}
		else {chrome.tabs.create({url})}
	}
}

async function openTab(tab, windowId, automatic = false) {
	var windows = await getAllWindows();
	if (tab.incognito) {
		var w = windows.find(i => i.incognito) || await createWindow(undefined, t.incognito);
		await new Promise(r => chrome.tabs.create({url: tab.url, active: false, pinned: tab.pinned, windowId: w.id}, r));
	} else if (!windows || !windows.filter(w => !w.incognito).length) {
		await new Promise(r => chrome.windows.create({url: tab.url}, r));
	} else {
		await new Promise(r => chrome.tabs.create({url: tab.url, active: false, pinned: tab.pinned, windowId}, r));	
	}
	if (!automatic) return;
	var msg = `${tab.title} -- snoozed ${dayjs(tab.timeCreated).fromNow()}`;
	createNotification(tab.id, 'A tab woke up!', 'icons/logo.svg', msg);
}

async function openSelection(t, automatic = false) {
	var targetWindowID = null, windows = await getAllWindows();
	if (!windows || !windows.length || t.newWindow) {
		var window = await createWindow(undefined, t.incognito);
		targetWindowID = window.id;
	}
	for (var s of t.tabs) await openTab(s, targetWindowID);
	if (!automatic) return;
	var msg = `These tabs were put to sleep ${dayjs(t.timeCreated).fromNow()}`;
	createNotification(t.id, `${t.title.split(' ')[0]} tabs woke up!`, 'icons/logo.svg', msg);
}

async function openWindow(t, automatic = false) {
	var targetWindowID, currentWindow = await getTabsInWindow();
	if (currentWindow.length && (currentWindow.filter(isDefault).length === currentWindow.length || (typeof t.newWindow === 'boolean' && t.newWindow === false))) {
		await openExtensionTab(`/html/rise-and-shine.html#${t.id}`);
		targetWindowID = currentWindow[0].windowId;
	} else {
		var window = await createWindow(t.id);
		targetWindowID = window.id;
	}

	// send message to map browser tabs to tab-list in rise-and-shine.html
	var loadingCount = 0;
	chrome.tabs.onUpdated.addListener(async function cleanTabsAfterLoad(id, state, title) {
		if (loadingCount > t.tabs.length) {
			chrome.runtime.sendMessage({startMapping: true});
			chrome.tabs.onUpdated.removeListener(cleanTabsAfterLoad)
		}
		if (state.status === 'loading' && state.url) loadingCount ++;
	});

	for (var s of t.tabs) await openTab(s, targetWindowID);
	chrome.windows.update(targetWindowID, {focused: true});
	
	if (!automatic) return;
	var msg = `This window was put to sleep ${dayjs(t.timeCreated).fromNow()}`;
	createNotification(t.id, 'A window woke up!', 'icons/logo.svg', msg);
	return;
}

async function editSnoozed(tabId, snoozeTime, duplicating) {
	var t = await getSnoozedTabs(tabId);
	['startUp', 'opened', 'deleted', 'repeat', 'paused'].forEach(prop => delete t[prop]);
	t.wakeUpTime = snoozeTime === 'startup' ? dayjs().add(20, 'y').valueOf() : dayjs(snoozeTime).valueOf(),
	t.timeCreated = dayjs().valueOf();
	t.id = duplicating ? getRandomId() : t.id;
	if (snoozeTime === 'startup') t.startUp = true;
	await saveTab(t);
	return duplicating ? {duped: true} : {edited: true}
}

async function editRecurringSnoozed(tabId, data, duplicating) {
	var t = await getSnoozedTabs(tabId);
	['startUp', 'opened', 'deleted', 'paused'].forEach(prop => delete t[prop]);
	t.wakeUpTime = await calculateNextSnoozeTime(data);
	t.timeCreated = dayjs().valueOf();
	if (data.repeat === 'startup') t.startUp = true;
	t.repeat = data;
	t.id = duplicating ? getRandomId() : t.id;
	await saveTab(t);
	return duplicating ? {duped: true} : {edited: true}
}

async function editSnoozeRecurring(tabId, data, ) {
	var t = await getSnoozedTabs(tabId);
	['startUp', 'opened', 'deleted', 'repeat', 'paused'].forEach(prop => delete t[prop]);
	if (data.repeat === 'startup') t.startUp = true;
	t.wakeUpTime = await calculateNextSnoozeTime(data);
	t.modifiedTime = dayjs().valueOf();
	t.repeat = data;
	t.paused = false;
	await saveTab(t);
	return {edited: true}
}

/*		SNOOZING 	*/
async function snoozeTab(snoozeTime, overrideTab) {
	var activeTab = overrideTab || await getTabsInWindow(true);
	if (!activeTab || !activeTab.url) return {};
	var sleepyTab = {
		id: getRandomId(),
		title: activeTab.title || getBetterUrl(activeTab.url),
		url: activeTab.url,
		...activeTab.pinned ? {pinned: true} : {},
		...activeTab.incognito ? {incognito: true} : {},
		wakeUpTime: snoozeTime === 'startup' ? dayjs().add(20, 'y').valueOf() : dayjs(snoozeTime).valueOf(),
		timeCreated: dayjs().valueOf(),
	}
	if (snoozeTime === 'startup') sleepyTab.startUp = true;
	await saveTab(sleepyTab);
	chrome.runtime.sendMessage({logOptions: ['tab', sleepyTab, snoozeTime]});
	var tabId = activeTab.id || await getTabId(activeTab.url);
	return {tabId, tabDBId: sleepyTab.id}
}

async function snoozeWindow(snoozeTime, isASelection) {
	var tabsInWindow = await getTabsInWindow();
	var validTabs = tabsInWindow.filter(t => !isDefault(t) && isValid(t));
	if (isASelection) validTabs = validTabs.filter(t => t.highlighted);
	if (validTabs.length === 0) return {};
	if (validTabs.length === 1) {
		await snoozeTab(snoozeTime, validTabs[0])
		return {windowId: tabsInWindow.find(w => w.active).windowId};
	}
	var sleepyGroup = {
		id: getRandomId(),
		wakeUpTime: snoozeTime === 'startup' ? dayjs().add(20, 'y').valueOf() : dayjs(snoozeTime).valueOf(),
		timeCreated: dayjs().valueOf(),
		title: `${getTabCountLabel(validTabs)} from ${getSiteCountLabel(validTabs)}`,
		...(validTabs.some(v => v.incognito)) ? {incognito: true} : {},
	}
	if (isASelection) {
		sleepyGroup.title = sleepyGroup.title.replace(' tab', ' selected tab');
		sleepyGroup.selection = true;
	}
	if (snoozeTime === 'startup') sleepyGroup.startUp = true;

	sleepyGroup = Object.assign(sleepyGroup, {
		tabs: validTabs.map(t => ({
			title: t.title,
			url: t.url,
			...t.pinned ? {pinned: true} : {}
		}))
	});
	await saveTab(sleepyGroup);
	chrome.runtime.sendMessage({logOptions: [isASelection ? 'selection' : 'window', sleepyGroup, snoozeTime]});	
	return isASelection ? {tabId: tabsInWindow.filter(t => t.highlighted).map(t => t.id)} : {windowId: tabsInWindow.find(w => w.active).windowId};
}

async function snoozeRecurring(target, data) {
	var sleepyObj = {
		id: getRandomId(),
		timeCreated: dayjs().valueOf(),
		repeat: data,
		paused: false,
	}

	var validTabs, activeTab, tabsInWindow = await getTabsInWindow();
	validTabs = tabsInWindow.filter(t => !isDefault(t) && isValid(t));
	if (target === 'tab') validTabs = validTabs.filter(t => t.active);
	if (target === 'selection') {
		validTabs = validTabs.filter(t => t.highlighted);
		sleepyObj.selection = true;
	}

	if (data.repeat === 'startup') sleepyObj.startUp = true;

	sleepyObj.wakeUpTime = await calculateNextSnoozeTime(data);
	// console.log(dayjs(sleepyObj.wakeUpTime).format('DD/MM/YY HH:mm'));

	if (validTabs.length === 0) return {};
	if (validTabs.length === 1 || target === 'tab') {
		var activeTab = validTabs && validTabs.length ? validTabs[0] : await getTabsInWindow(true);
		if (!activeTab || !activeTab.url) return {};
		Object.assign(sleepyObj, {
			title: activeTab.title || getBetterUrl(activeTab.url),
			url: activeTab.url,
			...activeTab.pinned ? {pinned: true} : {},
		});
	} else {
		Object.assign(sleepyObj, {
			title: `${getTabCountLabel(validTabs).replace(' tab', target === 'selection' ? ' selected tab' : ' tab')} from ${getSiteCountLabel(validTabs)}`,
			tabs: validTabs.map(t => ({
				title: t.title,
				url: t.url,
				...t.pinned ? {pinned: true} : {}
			}))
		})
	}
	console.log(sleepyObj);
	await saveTab(sleepyObj);
	chrome.runtime.sendMessage({logOptions: [target, sleepyObj, sleepyObj.wakeUpTime]});
	if (target === 'tab') return {tabId: activeTab.id};
	if (target === 'window') return {windowId: validTabs.find(w => w.active).windowId};
	if (target === 'selection') return {tabId: validTabs.map(t => t.id)};

}

async function getTimeWithModifier(choice) {
	var c = await getChoices([choice])
	var options = await getOptions(['morning', 'evening', 'popup']);
	var modifier = options.popup ? options.popup[choice] : '';
	options = upgradeSettings(options);
	var m = options[modifier] || [dayjs().hour(), dayjs().minute()];
	return dayjs(c.time).add(m[0], 'h').add(m[1], 'm');
}

async function getChoices(which) {
	var NOW = dayjs();
	var config = await getOptions(['morning', 'evening']);
	if (typeof config.morning === 'number' || typeof config.evening === 'number') config = upgradeSettings(config);
	var all = {
		'startup': {
			label: 'On Next Startup',
			repeatLabel: 'Every Browser Startup',
			startUp: true,
			time: NOW.add(20, 'y'),
			timeString: '',
			repeatTime: NOW.add(20, 'y'),
			repeatTimeString: '',
			repeat_id: 'startup',
			menuLabel: 'till next startup'
		},
		'in-an-hour': {
			label: 'In One Hour',
			repeatLabel: 'Every hour',
			time: NOW.add(1, 'h'),
			timeString: NOW.add(1, 'h').dayOfYear() == NOW.dayOfYear() ? 'Today' : 'Tomorrow',
			repeatTime: NOW.add(1, 'h').format(getHourFormat(true)),
			repeatTimeString: `Starts at`,
			repeat_id: 'hourly',
			menuLabel: 'for an hour'
		},
		'today-morning': {
			label: 'This Morning',
			repeatLabel: '',
			time: NOW.startOf('d').add(config.morning[0], 'h').add(config.morning[1], 'm'),
			timeString: 'Today',
			repeatTime: '',
			repeatTimeString: '',
			menuLabel: 'till this morning',
			disabled: NOW.startOf('d').add(config.morning[0], 'h').add(config.morning[1], 'm').valueOf() < dayjs(),
			repeatDisabled: true,
		},
		'today-evening': {
			label: getEveningLabel(config.evening[0]),
			repeatLabel: `Everyday, Now`,
			time: NOW.startOf('d').add(config.evening[0], 'h').add(config.evening[1], 'm'),
			timeString: 'Today',
			repeatTime: NOW.format(getHourFormat(true)),
			repeatTimeString: 'Starts Tom at',
			repeat_id: 'daily',
			menuLabel: 'till this evening',
			disabled: NOW.startOf('d').add(config.evening[0], 'h').add(config.evening[1], 'm').valueOf() < dayjs(),
		},
		'tom-morning': {
			label: 'Tomorrow Morning',
			repeatLabel: 'Every Morning',
			time: NOW.startOf('d').add(1,'d').add(config.morning[0], 'h').add(config.morning[1], 'm'),
			timeString: NOW.add(1,'d').format('ddd, D MMM'),
			repeatTime: NOW.startOf('d').add(config.morning[0], 'h').add(config.morning[1], 'm').format(getHourFormat(true)),
			repeatTimeString: `Starts ${NOW < NOW.startOf('d').add(config.morning[0], 'h').add(config.morning[1], 'm') ? 'Today' : 'Tom'} at`,
			repeat_id: 'daily_morning',
			menuLabel: 'till tomorrow morning'
		},
		'tom-evening': {
			label: getEveningLabel(config.evening[0], 'tomorrow'),
			repeatLabel: getEveningLabel(config.evening[0], 'everyday'),
			time: NOW.startOf('d').add(1,'d').add(config.evening[0], 'h').add(config.evening[1], 'm'),
			timeString: NOW.add(1,'d').format('ddd, D MMM'),
			repeatTime: NOW.startOf('d').add(config.evening[0], 'h').add(config.evening[1], 'm').format(getHourFormat(true)),
			repeatTimeString: `Starts ${NOW < NOW.startOf('d').add(config.evening[0], 'h').add(config.evening[1], 'm') ? 'Today' : 'Tom'} at`,
			repeat_id: 'daily_evening',
			menuLabel: 'till tomorrow evening'
		},
		'weekend': {
			label: 'Saturday',
			repeatLabel: 'Every Saturday',
			time: NOW.startOf('d').weekday(6),
			timeString: NOW.weekday(6).format('ddd, D MMM'),
			repeatTime: NOW.startOf('d').format(getHourFormat(true)),
			repeatTimeString: `${NOW.weekday(6).format('dddd')}s at`,
			repeat_id: 'weekends',
			menuLabel: 'till the weekend',
			// disabled: NOW.day() === 6,
		},
		'monday': {
			label: 'Next Monday',
			repeatLabel: 'Every Monday',
			time: NOW.startOf('d').weekday(NOW.startOf('d') < dayjs().startOf('d').weekday(1) ? 1 : 8),
			timeString: NOW.weekday(NOW.startOf('d') < dayjs().startOf('d').weekday(1) ? 1 : 8).format('ddd, D MMM'),
			repeatTime: NOW.startOf('d').format(getHourFormat(true)),
			repeatTimeString: `${NOW.weekday(1).format('dddd')}s at`,
			repeat_id: 'mondays',
			menuLabel: 'till next Monday'
		},
		'week': {
			label: 'Next Week',
			repeatLabel: 'Every ' + NOW.format('dddd'),
			time: NOW.startOf('d').add(1, 'week'),
			timeString: NOW.startOf('d').add(1, 'week').format('ddd, D MMM'),
			repeatTime: NOW.format(getHourFormat(true)),
			repeatTimeString: `${NOW.format('dddd')}s at`,
			repeat_id: 'weekly',
			menuLabel: 'for a week',
			// disabled: NOW.day() === 1,
			// repeatDisabled: NOW.day() === 1 || NOW.day() === 6,
		},
		'month': {
			label: 'Next Month',
			repeatLabel: 'Every Month',
			time: NOW.startOf('d').add(1, 'M'),
			timeString: NOW.startOf('d').add(1, 'M').format('ddd, D MMM'),
			repeatTime: NOW.format(getHourFormat(true)),
			repeatTimeString: `${getOrdinal(NOW.format('D'))} of Month`,
			repeat_id: 'monthly',
			menuLabel: 'for a month'
		},
	}
	return which && all[which] ? all[which] : all;
}

async function calculateNextSnoozeTime(data) {
	var NOW = dayjs(), TYPE = data.type, [HOUR, MINUTE] = data.time;
	if (TYPE === 'startup') {
		return NOW.add(20, 'y');
	} else if (TYPE === 'hourly') {
		var isNextHour = NOW.minute() >= MINUTE ? 1 : 0;
		return NOW.startOf('h').add(isNextHour, 'h').minute(MINUTE).valueOf();
	} else if (TYPE === 'daily') {
		var isNextDay = NOW.hour() > HOUR || (NOW.hour() === HOUR && NOW.minute() >= MINUTE) ? 1 : 0;
		return NOW.startOf('d').add(isNextDay, 'd').hour(HOUR).minute(MINUTE).valueOf();
	} else if (TYPE === 'daily_morning') {
		var [m_hour, m_minute] = await getOptions('morning');
		var isNextDay = NOW.hour() > m_hour || (NOW.hour() === m_hour && NOW.minute() >= m_minute) ? 1 : 0;
		return NOW.startOf('d').add(isNextDay, 'd').hour(m_hour).minute(m_minute).valueOf();
	} else if (TYPE === 'daily_evening') {
		var [e_hour, e_minute] = await getOptions('evening');
		var isNextDay = NOW.hour() > e_hour || (NOW.hour() === e_hour && NOW.minute() >= e_minute) ? 1 : 0;
		return NOW.startOf('d').add(isNextDay, 'd').hour(e_hour).minute(e_minute).valueOf();
	} else if (['weekends', 'mondays', 'weekly', 'monthly', 'custom'].includes(TYPE)) {
		var days = [];
		if (data.weekly) {
			var thisWeek = data.weekly, nextWeek = data.weekly.map(day => day + 7);
			days = nextWeek.concat(thisWeek).map(day => dayjs().startOf('w').add(day, 'd').hour(HOUR).minute(MINUTE));
		} else if (data.monthly) {
			var thisMonth = data.monthly.filter(d => d <= dayjs().daysInMonth()).map(d => dayjs().startOf('M').date(d).hour(HOUR).minute(MINUTE));
			var nextMonth = data.monthly.filter(d => d <= dayjs().add(1, 'M').daysInMonth()).map(d => dayjs().startOf('M').add(1, 'M').date(d).hour(HOUR).minute(MINUTE));
			days = nextMonth.concat(thisMonth);
		}
		return days.filter(d => d > NOW).pop().valueOf();
	}
	return false;
}

/* END ASYNC FUNCTIONS */
var getFaviconUrl = url => {
	if (url.indexOf('file://') === 0) return '../icons/file.svg'
	// return `https://icons.duckduckgo.com/ip3/${getHostname(url)}.ico`
	// return `https://www.google.com/s2/favicons?sz=64&domain_url=${getHostname(url)}`;
	return `https://besticon.herokuapp.com/icon?url=${getHostname(url)}&size=32..48..64&fallback_icon_color=${getColorForUrl(getHostname(url)).replace('#', '')}`;
}
var getColorForUrl = (url = 'snoozz.me') => colours[url.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b) % 100];

// MV3: Use URL API instead of document.createElement for service worker compatibility
var getHostname = url => {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname || undefined;
	} catch (e) {
		return undefined;
	}
}

// MV3: Use URL API instead of document.createElement for service worker compatibility
var getBetterUrl = url => {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname + urlObj.pathname;
	} catch (e) {
		return url; // fallback if URL parsing fails
	}
}

var getTabCountLabel = tabs => `${tabs.length} tab${tabs.length === 1 ? '' : 's'}`

var getSiteCountLabel = tabs => {
	var count = tabs.map(t => getHostname(t.url)).filter((v,i,s) => s.indexOf(v) === i).length;
	return count > 1 ? `${count} different websites` : `${count} website`;
}

var getTabType = t => {
	if (t.tabs && t.selection) return 'selection';
	if (t.tabs) return 'window';
	return 'tab';
}

var verifyTab = tab => {
	if (!tab) return false;
	if (!tab.title) return false;
	if (!tab.id) return false;
	if (!tab.url && (!tab.tabs || !tab.tabs.length)) return false;
	if (!tab.wakeUpTime) return false;
	if (!tab.timeCreated) return false;
	return true;
}

var sleeping = tabs => tabs.filter(t => !t.opened);

var today = tabs => tabs.filter(t => t.wakeUpTime && dayjs(t.wakeUpTime).dayOfYear() === dayjs().dayOfYear() && dayjs(t.wakeUpTime).year() === dayjs().year())

var isDefault = tabs => tabs.title && ['nap room | snoozz', 'settings | snoozz', 'rise and shine | snoozz', 'New Tab', 'Start Page'].includes(tabs.title);

var isValid = tabs => {
	var validProtocols = ['http', 'https', 'ftp', 'chrome-extension', 'web-extension', 'moz-extension', 'extension'];
	if (getBrowser() == 'chrome') validProtocols.push('file');
	return tabs.url && validProtocols.includes(tabs.url.substring(0, tabs.url.indexOf(':')));
}

var isSameYear = (a, b) => dayjs(a).year() === dayjs(b).year();

var capitalize = s => s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

var wrapInDiv = (attr, ...nodes) => {
	var div = Object.assign(document.createElement('div'), typeof attr === 'string' ? {className: attr} : attr);
	div.append(...nodes)
	return div;
}

var getRandomId = _ => [...Array(16)].map(_ => Math.random().toString(36)[2][Math.random() < .5 ? 'toLowerCase' : 'toUpperCase']()).join('');

var asc = (a, b) => a - b;
var desc = (a, b) => b - a;

var SIZES = {
	undefined: _ => 0,
	boolean: _ => 4,
	number: _ => 8,
	string: s => (new TextEncoder().encode(s)).length,
	object: o => !o ? 0 : Object.keys(o).reduce((total, key) => calcObjectSize(key) + calcObjectSize(o[key]) + total, 0)
}

const DEFAULT_OPTIONS = {
	morning: [9, 0],
	evening: [18, 0],
	hourFormat: 12,
	icons: 'human',
	theme: 'light',
	notifications: 'on',
	history: 30,
	badge: 'today',
	closeDelay: 1000,
	napCollapsed: [],
	weekStart: 0,
	popup: {weekend: 'morning', monday: 'morning', week: 'morning', month: 'morning'},
	contextMenu: ['startup', 'in-an-hour', 'today-evening', 'tom-morning', 'weekend']
}

var calcObjectSize = obj => SIZES[typeof obj](obj);

var clipboard = text => {
	var el = Object.assign(document.createElement('textarea'), {innerText: text});
	document.body.append(el); el.select();
	document.execCommand('copy'); el.remove();
}

var formatSnoozedUntil = t => {
	if (t.startUp || (t.repeat && t.repeat.type === 'startup')) return `Next ${capitalize(getBrowser())} Launch`;
	var ts = t.wakeUpTime;
	var date = dayjs(ts);
	if (date.dayOfYear() === dayjs().dayOfYear()) return (date.hour() > 17 ? 'Tonight' : 'Today') + date.format(` [@] ${getHourFormat(date.minute() !== 0)}`);
	if (date.dayOfYear() === dayjs().add(1,'d').dayOfYear()) return 'Tomorrow' + date.format(` [@] ${getHourFormat(date.minute() !== 0)}`);
	if (date.week() === dayjs().week()) return date.format(`dddd [@] ${getHourFormat(date.minute() !== 0)}`);
	if (date.year() !== dayjs().year()) return date.format(`ddd, MMM D, YYYY`);
	return date.format(`ddd, MMM D [@] ${getHourFormat(date.minute() !== 0)}`);
}

var getHourFormat = showZeros => (HOUR_FORMAT && HOUR_FORMAT === 24) ? 'HH:mm' : `h${showZeros ? ':mm' : ''} A`;

var getEveningLabel = (hour, type) => {
	var t = 'evening', prefix = 'this ';
	if (type && type === 'tomorrow') prefix = 'tomorrow ';
	if (type && type === 'every') prefix = 'every ';
	if (hour && hour <= 16) t = 'afternoon';
	if (hour && hour >= 20) t = 'night';
	if (hour && hour >= 20 && !type) prefix = 'to';
	return capitalize(prefix + t)
}
var getOrdinal = num => {
	num = parseInt(num);
	if (num % 100 >= 11 && num % 100 <= 13) return `${num}th`;
	if (num % 10 === 1) return `${num}st`;
	if (num % 10 === 2) return `${num}nd`;
	if (num % 10 === 3) return `${num}rd`;
	return `${num}th`;
}

var resizeDropdowns = _ => {
	document.querySelectorAll('select').forEach(s => {
		s.addEventListener('change', e => {
			var d = Object.assign(document.createElement('select'), {style: {visibility: 'hidden', position: 'fixed'}});
			var o = Object.assign(document.createElement('option'), {innerText: e.target.options[e.target.selectedIndex].text});
			d.append(o);
			e.target.after(d);
			e.target.style.width = `${d.getBoundingClientRect().width}px`;
			d.remove();
		});
		s.dispatchEvent(new Event('change'));
	});
}

var getUrlParam = p => {
	var url = new URLSearchParams(window.location.search);
	return url.get(p); 
}

var upgradeSettings = settings => {
	if (!settings) return;
	if (settings.morning && typeof settings.morning === 'number') settings.morning = [settings.morning, 0];
	if (settings.evening && typeof settings.evening === 'number') settings.evening = [settings.evening, 0];
	if (settings.popup && settings.timeOfDay) delete settings.timeOfDay;
	return settings;
}

var bgLog = (logs, colors, timestampColor = 'grey') => {
	var timestamp = dayjs().format('[%c]DD/MM/YY HH:mm:ss[%c] | ')
	logs = logs.map(l => '%c'+l+'%c').join(' ')
	colors.unshift(timestampColor);
	colors = colors.flatMap((v,i,a)=>i !== a.length ? [v, ''] : v).map(c => {
		var colors = {green:'limegreen', red:'crimson', blue:'dodgerblue', yellow:'gold', pink:'violet', grey:'slategrey', white: 'navajowhite'}
		return 'color:' + (colors[c] || 'unset')
	})
	console.log(timestamp + logs, ...colors)
}

var showIconOnScroll = _ => {
	var header = document.querySelector('body > div.flex.center')
	var logo = document.querySelector('body > div.scroll-logo');
	if (!header || !logo) return;

	logo.addEventListener('click', _ => window.scrollTo({top: 0,behavior: 'smooth'}));
	document.addEventListener('scroll', _ => {
		if (logo.classList.contains('hidden') && window.pageYOffset > (header.offsetHeight + header.offsetTop)) logo.classList.remove('hidden')
		if (!logo.classList.contains('hidden') && window.pageYOffset <= (header.offsetHeight + header.offsetTop)) logo.classList.add('hidden')
	})
}

// ====== background.js ======
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
		updateBadge(null, changes.snoozedOptions.newValue.badge);
		if (changes.snoozedOptions.oldValue && changes.snoozedOptions.newValue.history !== changes.snoozedOptions.oldValue.history) await wakeUpTask();
	}
	if (changes.snoozed) {
		await updateBadge(changes.snoozed.newValue);
		await wakeUpTask(changes.snoozed.newValue);
	}
});

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
	var tabs = cachedTabs || await getSnoozedTabs();
	if (!tabs || !tabs.length || tabs.length === 0) return;
	await cleanUpHistory(tabs);
	if (sleeping(tabs).length === 0) {
		bgLog(['No tabs are asleep'],['pink'], 'pink');
		return chrome.alarms.clear('wakeUpTabs');
	}
	await setNextAlarm(tabs);
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
	var wakingUp = t => !t.paused && !t.opened && (t.url || (t.tabs && t.tabs.length && t.tabs.length > 0)) && t.wakeUpTime && t.wakeUpTime <= now;
	var tabsToWakeUp = tabs.filter(wakingUp);
	if (tabsToWakeUp.length === 0) return;
	bgLog(['Waking up tabs', tabsToWakeUp.map(t => t.id).join(', ')], ['', 'green'], 'yellow');
	tabs.filter(wakingUp).filter(t => !t.repeat).forEach(t => t.opened = now);
	for (var s of tabs.filter(wakingUp).filter(t => t.repeat)) {
		var next = await calculateNextSnoozeTime(s.repeat);
		s.wakeUpTime = next.valueOf();
	}
	await saveTabs(tabs);

	for (var s of tabsToWakeUp) s.tabs ? (s.selection ? await openSelection(s, true) : await openWindow(s, true)) : await openTab(s, null, true);
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
	if(!isValid({url})) return createNotification(null, `Can't snoozz that :(`, 'icons/logo.svg', 'The link you are trying to snooze is invalid.', true);

	var snoozeTime = c && c.time;
	if (c && ['weekend', 'monday', 'week', 'month'].includes(item.menuItemId)) snoozeTime = await getTimeWithModifier(item.menuItemId);
	if (!snoozeTime || c.disabled || dayjs().isAfter(dayjs(snoozeTime))) {
		return createNotification(null, `Can't snoozz that :(`, 'icons/logo.svg', 'The time you have selected is invalid.', true);
	}
	// add attributes
	var startUp = item.menuItemId === 'startup' ? true : undefined;
	var title = !isHref ? tab.title : (item.linkText ? item.linkText : item.selectionText);
	var wakeUpTime = snoozeTime.valueOf();
	var pinned = !isHref && tab.pinned ? tab.pinned : undefined;
	var assembledTab = Object.assign(item, {url, title, pinned, startUp, wakeUpTime})

	var snoozed = await snoozeTab(item.menuItemId === 'startup' ? 'startup' : snoozeTime.valueOf(), assembledTab);
	
	var msg = `${!isHref ? tab.title : getHostname(url)} will wake up ${formatSnoozedUntil(assembledTab)}.`
	createNotification(snoozed.tabDBId, 'A new tab is now napping :)', 'icons/logo.svg', msg, true);

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
	var tabsToDelete = tabs.filter(t => h && t.opened && dayjs().isAfter(dayjs(t.opened).add(h, 'd')));
	if (tabsToDelete.length === 0) return;
	bgLog(['Deleting old tabs automatically:',tabsToDelete.map(t => t.id)],['','red'], 'red')
	await saveTabs(tabs.filter(t => !tabsToDelete.includes(t)));
}

async function setUpExtension() {
	var snoozed = await getSnoozedTabs();
	if (!snoozed || !snoozed.length || snoozed.length === 0) await saveTabs([]);
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
	var allTabs = await getSnoozedTabs();
	if (allTabs && allTabs.length && allTabs.some(t => (t.startUp || (t.repeat && t.repeat.type === 'startup')) && !t.opened)) {
		allTabs.filter(t => (t.startUp || (t.repeat && t.repeat.type === 'startup')) && !t.opened).forEach(t => t.wakeUpTime = dayjs().subtract(10, 's').valueOf());
		await saveTabs(allTabs);
	}
	await wakeUpTask();
	await setUpContextMenus();
}

chrome.runtime.onInstalled.addListener(async details => {
	// MV3: Must await async initialization to ensure it completes before service worker terminates
	await setUpExtension();
	if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL('https://snoozz.me/bye');
	if (details && details.reason && details.reason == 'install') await new Promise(r => chrome.tabs.create({url: 'https://rohan.xyz', active: true}, r));
	if (details && details.reason && details.reason == 'update' && details.previousVersion && details.previousVersion != chrome.runtime.getManifest().version) {
		if (chrome.runtime.getManifest().version.search(/^\d{1,3}(\.\d{1,3}){1,2}$/) !== 0) return;		// skip if minor version
		await new Promise(r => chrome.storage.local.set({'updated': true}, r));
		if (chrome.notifications) createNotification(null, 'Snoozz has been updated', 'icons/logo.svg', 'Click here to see what\'s new.', true);
	}
});
chrome.runtime.onStartup.addListener(init);
chrome.alarms.onAlarm.addListener(async a => { if (a.name === 'wakeUpTabs') await wakeUpTask()});
if (chrome.idle) chrome.idle.onStateChanged.addListener(async s => {
	if (s === 'active' || getBrowser() === 'firefox') {
		if (navigator && navigator.onLine === false) {
			// MV3: Use self instead of window in service worker context
			self.addEventListener('online', async _ => {await wakeUpTask()}, {once: true});
		} else {
			await wakeUpTask();
		}
	}
});
