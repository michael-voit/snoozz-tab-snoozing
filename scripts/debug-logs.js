// Debug Logs Viewer
var autoRefreshInterval = null;
var currentFilter = '';
var isTogglingDebug = false; // Flag to prevent toggle conflicts

async function loadLogs(skipToggleUpdate = false) {
	try {
		// Check if debug logging is enabled
		var debugEnabled = await getOptions('debugLogging');

		// Update toggle state (skip if we're currently toggling to prevent conflicts)
		if (!skipToggleUpdate && !isTogglingDebug) {
			var toggle = document.getElementById('debugToggle');
			if (toggle) {
				toggle.checked = debugEnabled === true;
			}
		}

		var logs = await getDebugLogs();
		var totalLogs = logs.length;

		// Apply filter if set
		if (currentFilter) {
			logs = logs.filter(log =>
				log.message.toLowerCase().includes(currentFilter.toLowerCase()) ||
				log.timestampStr.includes(currentFilter)
			);
		}

		// Update stats
		document.getElementById('totalLogs').textContent = totalLogs;
		document.getElementById('lastUpdate').textContent = dayjs().format('HH:mm:ss');

		// Calculate storage size
		var storageSize = (JSON.stringify(logs).length / 1024).toFixed(2);
		document.getElementById('storageSize').textContent = storageSize + ' KB';

		// Render logs
		var tbody = document.getElementById('logsBody');

		// Show warning if debug logging is disabled
		if (debugEnabled === false) {
			tbody.innerHTML = '<tr><td colspan="2" class="warning-state">Debug Logging is currently <strong>disabled</strong>. Enable it in <a href="#" id="goToSettings">Settings</a> to start logging.</td></tr>';
			document.getElementById('goToSettings')?.addEventListener('click', (e) => {
				e.preventDefault();
				openExtensionTab('/html/settings.html');
			});
			return;
		}

		if (logs.length === 0) {
			tbody.innerHTML = '<tr><td colspan="2" class="empty-state">No logs found. Logs will appear here once events occur.</td></tr>';
			return;
		}

		// Build table rows
		var rows = logs.map(log => {
			var colorClass = getColorClass(log.color);
			return `
				<tr class="log-row ${colorClass}">
					<td class="col-time">${log.timestampStr}</td>
					<td class="col-message">${escapeHtml(log.message)}</td>
				</tr>
			`;
		}).join('');

		tbody.innerHTML = rows;

	} catch (e) {
		console.error('Failed to load logs:', e);
		document.getElementById('logsBody').innerHTML =
			'<tr><td colspan="2" class="error-state">Error loading logs: ' + e.message + '</td></tr>';
	}
}

function getColorClass(color) {
	var colorMap = {
		'green': 'log-green',
		'red': 'log-red',
		'blue': 'log-blue',
		'yellow': 'log-yellow',
		'pink': 'log-pink',
		'orange': 'log-orange',
		'grey': 'log-grey',
		'cyan': 'log-cyan',
		'magenta': 'log-magenta'
	};
	return colorMap[color] || 'log-default';
}

function escapeHtml(text) {
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

async function exportLogs() {
	try {
		var logs = await getDebugLogs();
		var exportData = {
			exportedAt: new Date().toISOString(),
			totalLogs: logs.length,
			logs: logs
		};

		var blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = `snoozz-debug-logs-${dayjs().format('YYYY-MM-DD-HHmmss')}.json`;
		a.click();
		URL.revokeObjectURL(url);

		showNotification('Logs exported successfully!', 'success');
	} catch (e) {
		console.error('Failed to export logs:', e);
		showNotification('Failed to export logs: ' + e.message, 'error');
	}
}

async function clearLogs() {
	if (!confirm('Are you sure you want to clear all debug logs?')) {
		return;
	}

	try {
		await clearDebugLogs();
		await loadLogs();
		showNotification('Logs cleared successfully!', 'success');
	} catch (e) {
		console.error('Failed to clear logs:', e);
		showNotification('Failed to clear logs: ' + e.message, 'error');
	}
}

function showNotification(message, type) {
	var notification = document.createElement('div');
	notification.className = 'notification notification-' + type;
	notification.textContent = message;
	document.body.appendChild(notification);

	setTimeout(() => {
		notification.classList.add('show');
	}, 10);

	setTimeout(() => {
		notification.classList.remove('show');
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

function scrollToBottom() {
	var container = document.querySelector('.logs-container');
	container.scrollTop = container.scrollHeight;
}

function setupAutoRefresh() {
	var checkbox = document.getElementById('autoRefresh');

	if (checkbox.checked) {
		autoRefreshInterval = setInterval(loadLogs, 2000);
	} else {
		if (autoRefreshInterval) {
			clearInterval(autoRefreshInterval);
			autoRefreshInterval = null;
		}
	}
}

async function toggleDebugLogging() {
	var toggle = document.getElementById('debugToggle');
	var newValue = toggle.checked;

	// Set flag to prevent loadLogs from changing toggle state
	isTogglingDebug = true;

	try {
		// Auto-delete debug logs when logging is disabled (consistent with Settings behavior)
		if (newValue === false) {
			await clearDebugLogs();
		}

		await saveOption('debugLogging', newValue);
		showNotification('Debug logging ' + (newValue ? 'enabled' : 'disabled'), 'success');

		// Reload logs after saving completes (but skip toggle update)
		await new Promise(r => setTimeout(r, 300));
		await loadLogs(true); // Skip toggle update since we just set it
	} catch (e) {
		console.error('Failed to toggle debug logging:', e);
		showNotification('Failed to update setting: ' + e.message, 'error');
		// Revert toggle on error
		toggle.checked = !newValue;
	} finally {
		// Release flag after a delay to ensure all storage events are processed
		setTimeout(() => {
			isTogglingDebug = false;
		}, 1000);
	}
}

function goToSettings() {
	window.location.href = chrome.runtime.getURL('/html/settings.html');
}

// Event listeners
document.getElementById('refreshBtn').addEventListener('click', loadLogs);
document.getElementById('exportBtn').addEventListener('click', exportLogs);
document.getElementById('clearBtn').addEventListener('click', clearLogs);
document.getElementById('scrollBottom').addEventListener('click', scrollToBottom);
document.getElementById('settingsBtn').addEventListener('click', goToSettings);
document.getElementById('debugToggle').addEventListener('change', toggleDebugLogging);

document.getElementById('autoRefresh').addEventListener('change', setupAutoRefresh);

document.getElementById('filterInput').addEventListener('input', (e) => {
	currentFilter = e.target.value;
	loadLogs();
});

// Initialize
loadLogs();
setupAutoRefresh();

// Listen for storage changes to auto-update
chrome.storage.onChanged.addListener((changes) => {
	if (changes.debugLogs) {
		loadLogs();
	}
	if (changes.snoozedOptions && changes.snoozedOptions.newValue && changes.snoozedOptions.newValue.debugLogging !== undefined) {
		loadLogs();
	}
});
