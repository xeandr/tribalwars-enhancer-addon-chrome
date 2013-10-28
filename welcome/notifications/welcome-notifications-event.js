chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

    
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
    
    chrome.storage.sync.set(welcomeScreenData.tribeActivity, function(){
        console.log("Saved!");
    });
    
}