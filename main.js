'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700
	});

	mainWindow.loadURL('file://' + __dirname + '/app/index.html');

	// developer tools
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;	
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// for macOS. When all windows of this app is closed but the app is not quit, this function can recreate the app window.
	if (mainWindow === null) {
		createWindow();
	}
});
