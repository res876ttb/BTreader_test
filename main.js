'use strict';

const electron = require('electron');
const {dialog, ipcMain, Menu, MenuItem} = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	var mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		height: mainWindowState.height,
		width: mainWindowState.width,
		minWidth: 600,
		minHeight: 450,
	});

	mainWindowState.manage(mainWindow); // let windowStateKeeper listen to the window state and save it when it change

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
	let data;
	switch(arg[0]) {
		case 'getDataPath':
			event.returnValue = app.getPath('userData');
			break;
		case 'openTXT':
			console.log('Main process is opening text file.');
			data = dialog.showOpenDialog({
				filters: [
					{name: 'Text file', extensions: ['txt']}
				],
				properties: ['openFile', 'multiSelections']
			});
			event.returnValue = data === undefined ? null : data;
			break;
		case 'openImage':
			console.log('Main process is opening image file.');
			data = dialog.showOpenDialog({
				filters: [
					{name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp']}
				],
				properties: ['openFile']
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
		case 'fileNotInLibrary':
			console.log('Book is removed from library!');
			event.returnValue = null;
			dialog.showMessageBox({
				type: 'info',
				title: '',
				message: '書架上已經沒有 \"' + arg[1] + '\" 這本書囉！'
			});
			break;
		default:
			console.log('Main process received unexpected messages :', arg, 'Some error occurs.');
			event.returnValue = null;
			break;
	}
});
