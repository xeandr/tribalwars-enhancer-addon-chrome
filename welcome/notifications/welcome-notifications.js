chrome.runtime.onMessage.addListener(onMessage);

function onMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "SCREEN":
            if ( request.data != "welcome" ) return;
            onWelcomeScreen(sender, request.game_data);
            break;
    }
}

function onWelcomeScreen(sender, game_data) {
    var data = parseWelcomeScreen();

    chrome.runtime.sendMessage({type: "WELCOME_SCREEN_DATA", data: data}, function(response) {
        console.log(response.message);
    });
}


function parseWelcomeScreen() {
    var data = {
        "tribeActivity": parseTribeActivity($("#tribe-activity"))
    };
    return data;
}

function parseTribeActivity(tribeActivity) {
    var tribeActivityTable = $(tribeActivity).find("#all table");
    return parseTribeActivityTable(tribeActivityTable);
}

function parseTribeActivityTable(tribeActivityTable) {
    var activities = {};
    console.log(tribeActivityTable);
    $(tribeActivityTable).find("tr").each(function(){
        var row = this;
        var activity = parseTribeActivityTableRow(row);
    });
    return activities;
}

function parseTribeActivityTableRow(row) {
    var activity = {};
    activity.type = $(row).find("img").prop("src").match(/\/(\w+)\.png/)[1];
    activity.id = activity.type;
    
    console.log(activity);
    return activity;
}
