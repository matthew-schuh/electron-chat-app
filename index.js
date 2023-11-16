const {app, BrowserWindow, ipcMain} = require('electron'); // Modules to control app, create BrowserWindows, and ipc communication.
const storage = require('electron-json-storage'); // Handles storing/loading data from persistent storage.
const path = require('path');

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
  // Create the browser window.
  // TODO size this based on device screen size. Allow user to configure, and store configured size.
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 784,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false, // Turn off remote
      preload: path.join(__dirname, "preload.js") // Use our preload script
    }
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

ipcMain.handle('storeUserInfo', async (event, userInfo) => {
  await storeUserInfo(userInfo);
  return true;
});

ipcMain.handle('getChatData', async (event, sessionInfo) => {
  // Chats are keyed by phone number, first name, and last name.
  if (typeof sessionInfo === 'string') {
    sessionInfo = JSON.parse(sessionInfo);
  }
  let sessionKey = getSessionKey(sessionInfo);
  let chatData = {
    chats: []
  };
  if (!storage.has(sessionKey)) {
    storage.set(sessionKey, chatData);
    return chatData;
  } else {
    return storage.getSync(sessionKey);
  }
});

// TODO add validation here.
// User info should contain a valid phone number, country code (e.g. +1),
// first name, and last name. Should be a json string.
function storeUserInfo(userInfo) {
  if (typeof userInfo === 'string') {
    userInfo = JSON.parse(userInfo);
  }

  return new Promise((resolve, reject) => {
    let sessionKey = getSessionKey(userInfo);
    storage.set(sessionKey, {
      chats: {}
    });
    storage.set('userSessionInfo', userInfo, () => {
      resolve(true);
    });
  });
}

// Gives a "unique" key for storing/loading message/chat data.
function getSessionKey(sessionInfo) {
  return sessionInfo.phoneCountryCode + sessionInfo.phoneNumber + sessionInfo.firstName + sessionInfo.lastName;
}

// Adding a chat to a key
ipcMain.on('addChat', (event, chatInfo) => {
  if (typeof chatInfo === 'string') {
    chatInfo = JSON.parse(chatInfo);
  }
  console.log(chatInfo);
  // We can't add a chat to a session that doesn't exist, so check that.
  if (chatInfo.sessionInfo) {
    let sessionKey = getSessionKey(chatInfo.sessionInfo);
    if (storage.has(sessionKey)) {
      let data = storage.getSync(sessionKey);
      // TODO check if chat exists before adding it.
      let chatData = chatInfo.data;
      if (chatData) {
        if (!data.chats[chatData.partnerName]) {
          data.chats[chatData.partnerName] = chatData;
          storage.set(sessionKey, data);
        }
      }
    }
  }
});

ipcMain.on('addMessage', (event, messageInfo) => {
  if (typeof messageInfo === 'string') {
    messageInfo = JSON.parse(messageInfo);
  }

  // We can't add a message to a session that doesn't exist, so check that.
  if (messageInfo.sessionInfo) {
    let sessionKey = getSessionKey(messageInfo.sessionInfo);
    if (storage.has(sessionKey)) {
      let data = storage.getSync(sessionKey);
      if (messageInfo.partnerKey && data.chats[messageInfo.partnerKey]) {
        data.chats[messageInfo.partnerKey].messages.push(messageInfo.data);
      }
    }
  }
});