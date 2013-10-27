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
        // "tribeActivity": parseTribeActivity($("#tribe-activity"))
        "tribeActivity": parseTribeActivity($("#welcome-page"))
    };
    return data;
}

function parseTribeActivity(tribeActivity) {
    var tribeActivityTable = $(tribeActivity).find("#all table");
    return parseTribeActivityTable(tribeActivityTable);
}

function parseTribeActivityTable(tribeActivityTable) {
    var activities = {};
    $(tribeActivityTable).find("tr").each(function(){
        var row = this;
        if ( $(row).hasClass("show_more") ) return;
        var activity = parseTribeActivityTableRow(row);
        activities[activity.id] = activity;
    });
    return activities;
}

function parseTribeActivityTableRow(row) {
    var activity = {};
    var links = $(row).find("td:eq(1)").find("a");
    activity.time = new Date( new Date().getFullYear().toString() + " " + $(row).find("td:eq(0)").text() + "-0000" ).getTime();
    activity.source = {player:{},ally:{}};
    activity.target = {village:{},player:{},ally:{},forum:{thread:{}}};
    var color = $(row).find("td:eq(1)").find("img").prop("src").match(/\/(\w+)\.png/)[1];
    switch (color) {
        case "red": 
            activity.type = "loss";
            var hasAlly = 0;
            activity.source.player.id = $(links[0]).prop("href").match(/id=(\d+)/)[1];
            activity.source.player.name = $(links[0]).text();
            activity.source.ally.name = $(links[0]).prop("title");
            if ($(links[1]).prop("href").indexOf("info_ally") > -1) {
                activity.source.ally.id = $(links[1]).prop("href").match(/id=(\d+)/)[1];
                activity.source.ally.tag = $(links[1]).text();
                hasAlly = 1;
            }
            activity.target.village.id = $(links[1+hasAlly]).prop("href").match(/id=(\d+)/)[1];
            activity.target.village.coord = $(links[1+hasAlly]).prop("title");
            activity.target.village.name = $(links[1+hasAlly]).text();
            activity.target.player.id = $(links[2+hasAlly]).prop("href").match(/id=(\d+)/)[1];
            activity.target.player.name = $(links[2+hasAlly]).text();
            activity.target.ally.name = $(links[2+hasAlly]).prop("title");
            break;    
        case "green":
            activity.type = "gain";
            activity.source.player.id = $(links[0]).prop("href").match(/id=(\d+)/)[1];
            activity.source.player.name = $(links[0]).text();
            activity.source.ally.name = $(links[0]).prop("title");
            activity.target.village.id = $(links[1]).prop("href").match(/id=(\d+)/)[1];
            activity.target.village.coord = $(links[1]).prop("title");
            activity.target.village.name = $(links[1]).text();
            if (links.length > 2) {
                activity.target.player.id = $(links[2]).prop("href").match(/id=(\d+)/)[1];
                activity.target.player.name = $(links[2]).text();
                activity.target.ally.name = $(links[2]).prop("title");
                if (links.length > 3) {
                    activity.target.ally.id = $(links[3]).prop("href").match(/id=(\d+)/)[1];
                    activity.target.ally.tag = $(links[3]).text();
                }
            }
            if (typeof(activity.target.player.id) == "undefined") activity.subtype = "barbarian";
            else if (activity.source.player.id == activity.target.player.id) activity.subtype = "self";
            else if (activity.source.ally.name == activity.target.ally.name) activity.subtype = "internal";
            else activity.subtype = "regular";
            break;
        case "blue":
            console.log(row);
            var hasAlly = 0;
            activity.type = "info";
            activity.source.player.id = $(links[0]).prop("href").match(/id=(\d+)/)[1];
            activity.source.player.name = $(links[0]).text();
            activity.source.ally.name = $(links[0]).prop("title");
            if ($(links[1]).prop("href").indexOf("info_ally") > -1) {
                activity.source.ally.id = $(links[1]).prop("href").match(/id=(\d+)/)[1];
                activity.source.ally.tag = $(links[1]).text();
                hasAlly = 1;
            }
            if ( links.length > 2 ) {
                activity.subtype = "forum";
                activity.target.forum.thread.id = $(links[1+hasAlly]).prop("href").match(/thread_id=(\d+)/)[1];
                activity.target.forum.thread.name = $(links[1+hasAlly]).text();
                activity.target.forum.id = $(links[2+hasAlly]).prop("href").match(/forum_id=(\d+)/)[1];
                activity.target.forum.name = $(links[2+hasAlly]).text();
            } else {
                activity.subtype = "change";
                activity.target.player.id = $(links[1]).prop("href").match(/id=(\d+)/)[1];
                activity.target.player.name = $(links[1]).text();
                activity.target.ally.name = $(links[1]).prop("title");
            }
            break;
    }
    activity.id = [activity.time, activity.type, activity.source.player.id, activity.target.village.id||activity.target.forum.thread.id].join("_");
    return activity;
}
