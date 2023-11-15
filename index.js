const {app, BrowserWindow, ipcMain} = require('electron'); // Modules to control app, create BrowserWindows, and ipc communication.
const storage = require('electron-json-storage'); // Handles storing/loading data from persistent storage.

// Keep a global reference of the window object to prevent GC.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // For OSX - keep app open until CMD + Q
  // Other OS, close app on last window close.
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished initialization.
app.on('ready', function() {
  // Create the browser window and disable integration with node.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    nodeIntegration: false
  });

  // Load the login page.
  mainWindow.loadURL('file://' + __dirname + '/public/login.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipcMain.on('storeUserInfo', storeUserInfo);

// TODO add validation here.
// User info should contain a valid phone number, country code (e.g. +1),
// first name, and last name. Should be a json string.
function storeUserInfo(userInfo) {
  if (typeof userInfo === 'string') {
    userInfo = JSON.parse(userInfo);
  }
  storage.set('userSessionInfo', userInfo, () => {
    ipcMain.send('userInfoSaved');
  });
}