let mongoose = require('mongoose');
const { default: axios } = require('axios');

//Set up for connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/games', {      
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(error) {
    if (error) {
        console.error("Unable to conncect: ", error);
    }
    else {
        console.log("Connected to MongoDB");
    }
});
mongoose.set('useCreateIndex', true);

//Creates Schema
const { Schema } = mongoose;
let gameSchema = new Schema({
    id: Number,
    name: String,
    date: String,
    tags: [String],
    score: Number
}, { collection: 'games' });

//Query top games by score with limit 
function queryTop(response, limit) {
    mongoose.model('game', gameSchema).find({       
        tags: {$nin: ["Game demo", "DLC"]}              //dont include game tags or DLC
    })
    .limit(limit)
    .sort({score : -1 })                                //sorts by top score
    .then((game) => {
        response.send(game);
    });
}

//Queries game db for games with substring of name with limit/sort
function queryName(response, name, limit, sort) {
    mongoose.model('game', gameSchema).find({
        name: { $regex: name, $options: 'i' },          //i makes it case-insensitive
        tags: {$nin: ["Game demo", "DLC"]}              //dont include game tags or DLC
    })
    .limit(limit)
    .sort(sort)
    .then(function(game) {
        response.send(game);
    });
}

//This will return 5 recommended games for a single game
function baseRecommendation(tagList, ID) {
    return new Promise((resolve) => {
        resolve(mongoose.model('game', gameSchema).find({
            tags: {
                $all: tagList,
                $nin: ["Game demo", "DLC"]              //doesnt include Demo and DLC
            }              
        })
        .limit(6)   
        .sort({score: -1})
        //Returns list of 5 recommended game ID's
        .then((games) => {
            let IDs = [];
            for (let i in games) {
                if (games[i].id == ID) continue;        //removes same game 
                IDs.push(games[i].id);
            }
            if (IDs.length == 6) IDs.pop();             //limits to 5
            return IDs;
        })
    )});
}

//Queries game db for games with same genres
function queryGenre(response, tagList, limit, sort, useDemoDLC) {
    let result;
    //Include DLC and Demos
    if (useDemoDLC) {
        result = mongoose.model('game', gameSchema).find({
            tags: {$all: tagList}       
        });
    }
    else {
        result = mongoose.model('game', gameSchema).find({
            tags: {
                $all: tagList,
                $nin: ["Game demo", "DLC"]              //doesnt include Demo and DLC
            }              
        });
    }
    result.limit(limit)
    .sort(sort)
    .then(function(game) {
        response.send(game);
    })
}

/**Returns data of a given game ID 
 * Searches steam api to get price and description
 * returns {tag,id,name,date,score,price,description}
*/
function getGameData(response, gameID) {
    let gamePromise = getSteamUrlData(gameID);
    gamePromise.then((gameData) => {
        mongoose.model('game', gameSchema).findOne({
            id: parseInt(gameID),   
        })
        .then((game) => {
            //query db for any games with top 3 tags of game (limit always at 5)
            let getRecommended = baseRecommendation(game.tags.splice(0,3), game.id);
            getRecommended.then((games) => {
                response.render('game', {
                    tags: game.tags,
                    id: game.id,
                    name: game.name,
                    date: game.date,
                    score: game.score,
                    price: gameData.price,
                    description: gameData.description,
                    recGames: games
                });
            });
        });
    });
}

//Called by index.js to recomment games based off user profile
function recommendGames(value, response, sort) {
    let gamePromise = searchSteamPlayer(value, 'profiles');         //searches baseID
    let gamePromiseCustomID = searchSteamPlayer(value, 'id');       //searches customID

    gamePromise.then(function(IDs) {
        if (IDs.data.search('var rgGames = ') > 0) {                //BaseID
            parseGames(IDs, response, sort);
            return;
        }
        else console.log("User has custom ID");
    });

    //Custom ID
    gamePromiseCustomID.then(function(IDs) {
        parseGames(IDs, response, sort);
    });
}

//Adds all games from steam api call to list 
function parseGames(IDs, response, sort) {
    try {
        let playersGames = [];
        //retrieves all game data on a profile by parsing html
        IDs = IDs.data.substring(IDs.data.search('var rgGames = ') + 14, IDs.data.search('}}];') + 3);     
        IDs = JSON.parse(IDs);
        
        for (game in IDs) {
            playersGames.push(IDs[game].appid);             //add to array of ID's
        }   
        getGenres(processGenres, response, playersGames ,sort);
    }
    catch (e) {
        //Non-public profiles will not work
        console.error("Error getting users games. Profile is likely private");  
    }
}

//search up games in db, tallies genre count
function getGenres(callback, response, playersGames, sort) {
    let genres = {};
    for (const game in playersGames) {
        mongoose.model('game', gameSchema).findOne({ id: parseInt(playersGames[game]) })
        .catch((err) => {
            console.log('error: ', err);
        })
        .then((dbGame) => {
            //if in db add genres to dictionary OR create new key
            if (dbGame) {
                for (const tag in dbGame.tags) {
                    if (dbGame.tags[tag] in genres) genres[dbGame.tags[tag]] += 1;      //increment genre
                    else genres[dbGame.tags[tag]] = 1;                                  //new genre
                } 
            }
            
            if (game == playersGames.length - 1) {
                callback(genres, response, sort);      //proccess data if last            
            }
        });
    }
}

//returns max 30 games that have top 3 tags
function processGenres(genres, response, sort) {
    //sorts and splices to top 3
    let genreEntries = Object.entries(genres).sort((a,b) => {
        return b[1] - a[1];
    }).splice(0,6);
    
    tagList = [];
    for (let i in genreEntries) tagList.push(genreEntries[i][0]);   //pulls tags

    //query db for any games with top 6 tags (limit always at 30)
    queryGenre(response, tagList, 30, sort, false);
}

//Returns promise of steam page html
function searchSteamPlayer(value, urlVariant) {
    return new Promise((resolve) => {
        let url = `https://steamcommunity.com/${urlVariant}/${value}/games/?tab=all`;
        resolve(axios.get(url)
        .catch(error =>{
            console.log(error);
        }));
    });
}

//Returns promise of steam api of description and price
function getSteamUrlData(gameID) {
    let url = `http://store.steampowered.com/api/appdetails?appids=${gameID}`;
    return new Promise((resolve) => {
        axios.get(url)
        .catch(error => {
            console.log(error);
        })
        .then(result => {
            let desc = "";
            let price = "";

            //checks if they exist
            try { desc = result.data[gameID].data.short_description; }
            catch(e) { desc = "Download and play on steam"; }
            try { price = result.data[gameID].data.price_overview.final_formatted}
            catch(e) { price = "Check Store For Details"; }
            resolve({
                'description': desc,
                'price': price
            });
        });
    });
}

//exports
module.exports.functions = {
    queryName, queryGenre, getGameData, recommendGames, queryTop
};