chrome.runtime.onMessage.addListener(onMessage);
    
function onMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "GAME_DATA":
            sendResponse({message: "Got the game_data, thanks!"});
            break;
        default:
            sendResponse({message: "What is this crap?"});
    }
}