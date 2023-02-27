const { request, response, json } = require('express');
const express = require('express');
const model = require('./model/games_model.js');
const { default: axios } = require('axios');

let app = express();

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('/public/templates', __dirname + '/public/templates');
app.set('view engine', 'pug');

//renders main html page
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/templates/Main_Search.html');
});

/**
 * Searches game determining specifications (limit, sorting)
 * Can search by name, genre(s) and steamID, top games
 * Steam ID will produce preferences
 */
app.post('/getSearchGames', (request, response) => {
    let limit, sort;
    if (request.body.limit == null) limit = 30;
    else limit = parseInt(request.body.limit);                 //wont work rn
    if (request.body.sort == null || request.body.sort == 'score') sort = {score: -1};
    else sort = {name: 1};

    //SEARCH FOR TOP GAMES
    if (request.body.value == "") {
        console.log("Searching top games");
        model.functions.queryTop(response, limit);
        return;
    }

    //SEARCH FOR GAME
    else if (request.body.type == "gameName") {
        console.log("Searching for game");
        model.functions.queryName(response, request.body.value, limit, sort);
    }

    //SEARCH FOR STEAM ID
    else if (request.body.type == "steamID") {
        console.log("Searching for steamID");
        model.functions.recommendGames(request.body.value, response, sort);
    }
    
    //SEARCH FOR GENRE
    else {
        let useDemoDLC = false;
        let tagList = request.body.value.split(",");
        console.log("Searching for genre");
        
        //checks for Demo or DLC tags
        for (let i in tagList) {
            if (tagList[i] == 'DLC' || tagList[i] == 'Game demo') useDemoDLC = true;
        }
        model.functions.queryGenre(response, tagList, limit, sort, useDemoDLC);
    }
});

//Renders search page
app.get('/search', (request, response) => {
    response.render('Game_List');
});

//returns all info related to specific game
app.get('/game', (request, response) => {
    model.functions.getGameData(response, request.query.id);
});

app.set('port', process.env.PORT || 6500);      //set port 6500

app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}.`);
});
