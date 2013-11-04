chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.onChanged.addListener(onChanged);

    
function onMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "WELCOME_SCREEN_DATA":
            onWelcomeScreenDataReceived(sender, request.data);
            sendResponse({message: "Got the WELCOME_SCREEN_DATA, thanks!"});
            break;
    }
}


function onWelcomeScreenDataReceived(sender, welcomeScreenData) {
    console.log("Event script got WELCOME_SCREEN_DATA", welcomeScreenData);
    
    chrome.storage.local.set(welcomeScreenData.tribeActivity, function(){
        console.log("Saved!");
    });
    
}

function onChanged(changes, namespace) {
    if (namespace != "local") return;
    
    var options = {
        type: "basic",
        title: "Primary Title",
        message: "Primary message to display",
        iconUrl: ""
    }
    
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
        
        var notificationId = key;
        chrome.notifications.create(notificationId, options, onCreated);
    }
}

function onCreated(notificationId) {
    console.log("created", notificationId);

}