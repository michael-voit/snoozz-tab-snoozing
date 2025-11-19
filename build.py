# usage
# python3 build.py
# local dependencies (npm) - uglifyjs, csso

import json
import shutil
from re import search
import os
import subprocess

FOLDER = 'build_temp'

#
# Run npm build:sw to generate service_worker.js for MV3
#
print('\n\n⧗ Building service worker for Manifest V3...')
result = subprocess.run(['npm', 'run', 'build:sw'], capture_output=True, text=True)
if result.returncode != 0:
	print('❌ Error building service worker:')
	print(result.stderr)
	exit(1)
print('✓ Service worker built successfully\n')

#
# Read version from manifest.v3.json (source of truth)
#
with open('manifest.v3.json') as m:
	data_v3 = json.load(m)
VERSION = data_v3['version']

# Also load manifest.json for MV2 builds
with open('manifest.json') as m:
	data_v2 = json.load(m)

print('\n\nBuilding Snoozz \x1b[1;31;34mv' + VERSION + '\x1b[0m\n');

#
#	delete old files if they exist
#
old = [FOLDER, 'snoozz-chrome-mv3-' + VERSION, 'snoozz-ff-' + VERSION, 'snoozz-' + VERSION, 'snoozz-safari-' + VERSION]
for file in old:
	if os.path.exists(file):
		shutil.rmtree(file)
oldzip = ['snoozz-chrome-mv3-' + VERSION + '.zip', 'snoozz-ff-' + VERSION + '.zip', 'snoozz-' + VERSION + '.zip', 'snoozz-safari-' + VERSION + '.zip']
for zippy in oldzip:
	if (os.path.exists(zippy)) :
		os.remove(zippy)
#
# Copy essential files only
#
shitfiles = shutil.ignore_patterns('.DS_Store', '.git', '.Trashes', '.Spotlight-V100', '.github')
shutil.copytree('html', FOLDER + '/html', ignore = shitfiles)
# shutil.copytree('scripts', FOLDER + '/scripts', ignore = shitfiles)
shutil.copytree('icons', FOLDER + '/icons', dirs_exist_ok=True, ignore = shitfiles)
shutil.copytree('sounds', FOLDER + '/sounds', dirs_exist_ok=True, ignore = shitfiles)

#
# Minify Files (JS + CSS)
#
def minifyFilesInDirectory(directory, ext, url):
	sameSize = '{:<16}'
	os.mkdir(FOLDER + '/' + directory)
	for root, dirs, files in os.walk(directory):
		for name in files:
			print('\n⧖ Minifying  ' + '\x1b[1;32;33m' + sameSize.format(name) + '\x1b[0m ...', end='')
			chars = len(ext)
			if name.endswith('.min' + ext):
				shutil.copyfile(os.path.join(root, name), FOLDER + '/' + directory + '/' + name)
				print('\r✓ Copied    ' + '\x1b[1;32;33m' + sameSize.format(name) + '\x1b[0m -> \x1b[1;32;32m' + name[:-chars] + '.min' + ext + '\x1b[0m', end='', flush=True)
			elif ext == '.js' and not name.endswith('.min' + ext):
				subprocess.run(['npx', 'uglifyjs', directory + '/' + name, '-c', '-m', '-o', FOLDER + '/' + directory + '/' + name[:-chars] + '.min' + ext], check=True, capture_output=True)
				replaceInHTMLFiles(name, name[:-chars] + '.min' + ext)
				replaceInManfest(name, name[:-chars] + '.min' + ext)
				print('\r✓ Minified  ' + '\x1b[1;32;33m' + sameSize.format(name) + '\x1b[0m -> \x1b[1;32;32m' + name[:-chars] + '.min' + ext + '\x1b[0m', end='', flush=True)
			elif ext == '.css' and not name.endswith('.min' + ext):
				subprocess.run(['npx', 'csso', directory + '/' + name, '-o', FOLDER + '/' + directory + '/' + name[:-chars] + '.min' + ext], check=True, capture_output=True)
				replaceInHTMLFiles(name, name[:-chars] + '.min' + ext)
				print('\r✓ Minified  ' + '\x1b[1;32;33m' + sameSize.format(name) + '\x1b[0m -> \x1b[1;32;32m' + name[:-chars] + '.min' + ext + '\x1b[0m', end='', flush=True)

def replaceInHTMLFiles(original, replacement):
	for root, dirs, files in os.walk(FOLDER + '/html'):
		for name in files:
			file = open(os.path.join(root, name), 'rt')
			h_data = file.read()
			h_data = h_data.replace(original, replacement)
			file.close()
			file = open(os.path.join(root, name), 'wt')
			file.write(h_data)
			file.close()

def replaceInManfest(original, replacement):
	global data_v2, data_v3
	# Update both manifest objects with minified file references
	data_v2 = json.loads(json.dumps(data_v2).replace(original, replacement))
	data_v3 = json.loads(json.dumps(data_v3).replace(original, replacement))

minifyFilesInDirectory('scripts', '.js', 'https://www.toptal.com/developers/javascript-minifier/raw')
minifyFilesInDirectory('styles', '.css', 'https://cssminifier.com/raw')

#
# Build Chrome MV3 release using manifest.v3.json
#
with open(FOLDER + '/manifest.json', 'w+') as m:
	m.write(json.dumps(data_v3, indent=4))

name = 'snoozz-chrome-mv3-' + VERSION
shutil.make_archive(name, 'zip', FOLDER)
print('\n\nCreated Chrome MV3 Release: ' + '\x1b[35m ' + name + '.zip' + '\x1b[0m')

#
# Build Firefox MV2 release using manifest.json with modifications
#
# Add Open popup shortcut to start of manifest.commands
del data_v2['offline_enabled']
mod_commands = {'_execute_browser_action' : {'description': 'Open the Snoozz popup'}}
for key, value in data_v2['commands'].items(): mod_commands[key] = value
data_v2['commands'] = mod_commands

with open(FOLDER + '/manifest.json', 'w+') as m:
	m.write(json.dumps(data_v2, indent=4))

name = 'snoozz-ff-' + VERSION
shutil.make_archive(name, 'zip', FOLDER)
print('Created Firefox MV2 Release: ' + '\x1b[35m ' + name + '.zip' + '\x1b[0m')

#
# Build GitHub release (MV3 version)
#
with open(FOLDER + '/manifest.json', 'w+') as m:
	m.write(json.dumps(data_v3, indent=4))

shutil.copy('LICENSE', FOLDER)

name = 'snoozz-' + VERSION
shutil.make_archive(name, 'zip', FOLDER)
print('Created GitHub Release (MV3): ' + '\x1b[35m ' + name + '.zip' + '\x1b[0m')

#
# Build Safari release (MV2 version with modifications)
#
os.remove(FOLDER + '/LICENSE')  # Remove LICENSE from previous build
shutil.copy('docs/safari.md', FOLDER)
shutil.copy('instructions_safari.txt', FOLDER)
shutil.copy('safari.sh', FOLDER)

# Start fresh with MV2 data for Safari modifications
safari_data = json.loads(json.dumps(data_v2))
if 'idle' in safari_data['permissions']: safari_data['permissions'].remove('idle')
if 'notifications' in safari_data['permissions']: safari_data['permissions'].remove('notifications')
safari_data['permissions'] = [p.replace('tabs','activeTab') for p in safari_data['permissions']]
del safari_data['commands']

with open(FOLDER + '/manifest.json', 'w+') as m:
	m.write(json.dumps(safari_data, indent=4))

name = 'snoozz-safari-' + VERSION
shutil.make_archive(name, 'zip', FOLDER)
print('Created Safari MV2 Release: ' + '\x1b[35m ' + name + '.zip' + '\x1b[0m')

#
# Cleanup
#
shutil.rmtree(FOLDER)
