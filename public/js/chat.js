let userSessionInfo = loadSessionFromLocalStorage();
let chatData;
if (typeof userSessionInfo === 'string') {
    userSessionInfo = JSON.parse(userSessionInfo);
}
// TODO fall back to electron?
// if (userSessionInfo === false) {
//     userSessionInfo = loadSessionFromElectron();
// }
loadChatData();

function loadSessionFromLocalStorage() {
    let sessionInfo = localStorage.getItem('chatAppSessionInfo');
    if (!sessionInfo) {
        sessionInfo = false;
    }
    return sessionInfo;
}

function loadSessionFromElectron() {
    // TODO fall back to electron?
}

// Load chat data from electron, and once loaded generate the chat page.
async function loadChatData() {
    chatData = await window.api.invoke('getChatData', JSON.stringify(userSessionInfo));
    setUpChat();
}

function setUpChat() {
    if (!chatData || !chatData.chats) {
        chatData = {
            chats: []
        };
    }

    if (!chatData.chats.length) {
        // If no chats, auto create the first chat per the guidelines.
        chatData.chats.push(generateNewChat());
    }
    $.each(chatData.chats, (i, chatInfo) => {
        chatInfo.chatId = i;
        addChat(chatInfo);
    });
    // Safe to do since we automatically add a chat if there are none.
    // Note it would be better ux to go to the most recent chat. Even better would be to re-order chats
    // in the sidebar by most recent, similar to SMS apps.
    goToChat(chatData.chats[0]);
}

// Adds chat HTML components to the chat sidebar.
function addChat(chatInfo) {
    // TODO add chat to sidebar
    let $chatEntry = $('<div class="chat-entry" id="chat-entry-' + chatInfo.chatId + '"></div>');
    $('<div class="user-photo"><img src=' + chatInfo.partnerPhoto + '></div>').appendTo($chatEntry);
    $('<div class="chat-entry--user-name">' + chatInfo.partnerName + '</div>').appendTo($chatEntry);
    $('<div class="chat-entry--recent-message-text">' + (chatInfo.messages && chatInfo.messages.length ? chatInfo.messages[chatInfo.messages.length - 1].message : '') + '</div>').appendTo($chatEntry);
    $('<div class="chat-entry--time">' + (chatInfo.messages && chatInfo.messages.length ? chatInfo.messages[chatInfo.messages.length - 1].time : '') + '</div>').appendTo($chatEntry);
    $chatEntry.appendTo('#chat-sidebar');
}

// Generates new "random" chat data.
function generateNewChat() {
    return {
        partnerName: getRandomName(),
        partnerPhoto: getRandomPhoto(),
        messages: [],
    };
}

// Opens the specified chat.
function goToChat(chatInfo) {

}

// Generate a "random" name for a chat.
function getRandomName() {
    // TODO add more options.
    return "Darryl";
}

// Generate a "random" photo for a chat.
function getRandomPhoto() {
    // TODO add more options.
    return 'img/darryl_user.png';
}