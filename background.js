chrome.runtime.onMessage.addListener(onMessage);
    
function onMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "GAME_DATA":
            onGameDataReceived(sender, request.data);
            sendResponse({message: "Got the game_data, thanks!"});
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
    }, 
    function(response) {
        console.log(response.message);
    });
}