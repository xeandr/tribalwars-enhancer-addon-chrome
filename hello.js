window.addEventListener("message", onMessage, false);

// execute this little helper script in page context to retrieve game_data
var script = document.createElement('script');
script.textContent = '(function(){try{window.postMessage({type:"GAME_DATA",data:game_data}, "*")}catch(ex){alert("TWEnhancer: "+ex)}})()';
document.body.appendChild(script);
document.body.removeChild(script);


function onMessage(event) {
    // We only accept messages from ourselves
    if (event.source != window) return;
   
    switch(event.data.type) {
        case "GAME_DATA":
            onGameDataReceived(event.data.data);
            break;
        default:
            console.log("Unknown message type: ", event.data.type);
    }
}

function onGameDataReceived(game_data) {
    console.log("Content script received game data: ", game_data);
}