let userSessionInfo = loadSessionFromLocalStorage();
let chatData;
let chatSendButton = document.getElementById('chat-message-send-button');
let chatInput = document.getElementById('chat-message');
let userIsCurrentMessage = true;
let $chatLog = $('#chat-log');

if (typeof userSessionInfo === 'string') {
    userSessionInfo = JSON.parse(userSessionInfo);
}
// TODO fall back to electron?
// if (userSessionInfo === false) {
//     userSessionInfo = loadSessionFromElectron();
// }
loadChatData();
$('#chat-entry-0').addClass('active');

chatSendButton.onclick = sendMessage;
$(chatInput).on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        sendMessage();
    }
});

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
            chats: {}
        };
    }

    if (!chatData.chats.length) {
        // If no chats, auto create the first chat per the guidelines.
        let newChatData = generateNewChat();
        chatData.chats[newChatData.partnerName] = newChatData;
    }
    // These should be keyed by something other than just the chat partner's name,
    // but since they're imaginary we don't have much to go off of.
    let firstChat;
    $.each(chatData.chats, (i, chatInfo) => {
        chatInfo.chatId = i;
        addChat(chatInfo);
        if (!firstChat) {
            firstChat = chatInfo;
        }
    });
    // Safe to do since we automatically add a chat if there are none.
    // Note it would be better ux to go to the most recent chat. Even better would be to re-order chats
    // in the sidebar by most recent, similar to SMS apps.
    goToChat(firstChat);
}

// Adds chat HTML components to the chat sidebar.
function addChat(chatInfo) {
    // Add chat to sidebar
    let $chatEntry = $('<div class="chat-entry" id="chat-entry-' + chatInfo.chatId + '" data-key="' + chatInfo.chatId + '"></div>');
    $('<div class="user-photo"><img src=' + chatInfo.partnerPhoto + '></div>').appendTo($chatEntry);
    $('<div class="chat-entry--user-name">' + chatInfo.partnerName + '</div>').appendTo($chatEntry);
    $('<div class="chat-entry--recent-message-text">' + (chatInfo.messages && chatInfo.messages.length ? chatInfo.messages[chatInfo.messages.length - 1].message : '') + '</div>').appendTo($chatEntry);
    $('<div class="chat-entry--time">' + (chatInfo.messages && chatInfo.messages.length ? chatInfo.messages[chatInfo.messages.length - 1].time : '') + '</div>').appendTo($chatEntry);
    $chatEntry.appendTo('#chat-sidebar');
}

// Generates new "random" chat data.
function generateNewChat() {
    let chatData = {
        partnerName: getRandomName(),
        partnerPhoto: getRandomPhoto(),
        messages: [],
    };

    // Send the (currently empty) chat to electron to be stored.
    window.api.send('addChat', {
        sessionInfo: userSessionInfo,
        data: chatData
    });

    return chatData;
}

// Opens the specified chat.
function goToChat(chatInfo) {
    $('#chat-entry-' + chatInfo.chatId).addClass('active');
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

// Triggered when the send button is pressed. Sends the message to electron to be stored,
// adds it to the chat display, and updates the sidebar.
function sendMessage() {
    let msg = chatInput.value;
    // Note we don't want to do anything if the message is empty.
    if (msg && msg.length) {
        msg = msg.trim(); // Also don't allow only (or leading/trailing) whitespace characters.
        if (msg.length) {
            // At this point the message is known to have some text in it and should be sanitized.
            msg = sanitize(msg);
            let msgData = {
                message: msg,
                time: getTime()
            };
            // Once sanitized, we can ship it off to Electron to be saved.
            window.api.send('addMessage', {
                sessionInfo: userSessionInfo,
                data: msgData,
                partnerKey: $('.chat-entry.active').attr('data-key')
            });
            updateChatLog(msgData);
            updateSidebar(msgData);

            // Note who sent the message depends on who sent the previous message since it alternates.
            // So we simply flip a boolean to keep track.
            userIsCurrentMessage = !userIsCurrentMessage;
            chatInput.value = "";
        }
    }
}

// Remove dangerous characters from a given string.
function sanitize(s) {
    // Quick and dirty, but this will escape any html.
    return $('<p>').text(s).text();
}

// Get time formatted in 12hour format (AM/PM)
function getTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    // Since we want 12 hour format, get hours between 0 and 12
    hours = hours % 12;
    // If hours is 0, it should instead say 12 (00:30 is actually 12:30 am)
    hours = hours ? hours : 12;
    // Pad minutes with leading 0 if necessary
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// Adds given message to chat log.
function updateChatLog(msgData) {
    let msgClass = 'chat-message-user';
    if (!userIsCurrentMessage) {
        msgClass = 'chat-message-other';
    }

    let $chatMessage = $('<div class="chat-message">' + msgData.message + '</div>');
    $chatMessage.append('<div class="time">' + msgData.time + '</div>');
    $chatMessage.append('<div class="tail"></div>')
    $chatMessage.addClass(msgClass);
    $chatMessage.prependTo($chatLog);
}

// Updates sidebar text and time with latest message data.
function updateSidebar(msgData) {
    $('.chat-entry.active .chat-entry--recent-message-text').text(msgData.message);
    $('.chat-entry.active .chat-entry--time').text(msgData.time);
}