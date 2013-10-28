chrome.runtime.onMessage.addListener(onMessage);
    
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