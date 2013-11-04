chrome.runtime.onInstalled.addListener(onInstalled)
chrome.runtime.onMessage.addListener(onMessage);
 
function onInstalled(details) {
    if (details.reason == "update")
        chrome.storage.local.clear(function(){console.log("Local storage cleared!")});
}
 
function onMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "GAME_DATA":
            onGameDataReceived(sender, request.data);
            break;
    }
}


function onGameDataReceived(sender, game_data) {
    chrome.tabs.sendMessage(
        sender.tab.id, 
        {
            type: "SCREEN", 
            data: game_data.screen, 
            game_data: game_data
        });
}