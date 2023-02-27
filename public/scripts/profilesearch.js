const $ = require('jquery');
var request = require('request');

/**
 * Returns a list of steam game ids from a given steam profile id
 */
function getProfileGames(profileID) {
    let steamIDs = [];
    let url = "https://steamcommunity.com/profiles/" + profileID + "/games/?tab=all";

    // gets the steam game ids by looking for numbers after "game_"
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {            
            steamIDs = body.match(/(\d+)(?<=game_\d+)/g);
        }
    });
    return steamIDs;
}

module.exports = {getProfileGames};