'use strict';

const electron = require('electron');
const {dialog, ipcMain, Menu, MenuItem} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700,
		minWidth: 580,
		minHeight: 450,
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
	app.quit();
});

app.on('activate', function () {
	// for macOS. When all windows of this app is closed but the app is not quit, this function can recreate the app window.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('synchronous-message', (event, arg) => {
	switch(arg) {
		case 'openTXT':
			console.log('Main process is opening text file.');
			let data = dialog.showOpenDialog({
				filters: [
					{name: 'Text file', extensions: ['txt']}
				],
				properties: ['openFile', 'multiSelections']
			});
			event.returnValue = data === undefined ? null : data;
			break;
		case 'fileNotExists':
			console.log('File is deleted, renamed, or moved to other folder.');
			event.returnValue = null;
			dialog.showMessageBox({
				type: 'error',
				title: '檔案不存在',
				message: '檔案可能已經被刪除、重新命名或搬移到其他資料夾。\n閱讀記錄將會被移除。'
			});
			break;
		default:
			console.log('Main process received unexpected messages :', arg, 'Some error occurs.');
			event.returnValue = null;
			break;
	}
});
