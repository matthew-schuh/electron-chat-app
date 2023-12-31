const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object.
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["addMessage", "addChat"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        on: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, data) => {
            let validChannels = ["getChatData", "storeUserInfo"];
            if (validChannels.includes(channel)) {
                ipcRenderer.invoke(channel, data);
            }
        },
        invokeAsnc: async (channel, data) => {
            let validChannels = ['toMain'];
            if (validChannels.includes(channel)) {
                await ipcRenderer.invoke(channel, data);
            }
        }
    }
);