import * as imageSearch from './imagesearch.js';
import * as mainSearch from './gamesearch.js';
var sortBySelect;

// Genre List for applying the generateListGenres() function
let genreList = [
    "Single-player", "Multi-player", "Co-op", "Action", "Indie", "Adventure", "Simulation",
    "Strategy", "DLC", "RPG", "Game demo", "Racing",  "PvP", "Cross-Play", "Casual", "In-App Purchases",
    "Free to Play"
]
let searchOptions = ["gameName", "steamID"]
let limit = 30;
let sort = "score";

function setSortBy(newSort) {
    console.log("Setting sort by to: " + newSort);
    sort = newSort;
    getGames();
}

function setLimit(newLimit) {
    console.log("Setting limit to: " + newLimit);
    limit = newLimit;
    getGames();
}

// These will be done on the load of the window
window.onload =( function(){
    
    // Creates the table of genres below the search bar
    generateSearchOptions()
    generateListGenres()
    
    // Creates the dropdown for the viewBy
    var dropdown = document.querySelectorAll('.dropdown');
    dropdown[0].addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown[0].classList.toggle('is-active');   
    });
    // Creates the dropdown for the sortBy
    dropdown[1].addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown[1].classList.toggle('is-active');
    });

    //Dropdowns for sort by
    let scoredd = document.getElementById("Score");
    scoredd.addEventListener('click', () => {
        setSortBy("score");
    });
    let titledd = document.getElementById("Title");
    titledd.addEventListener('click', () => {
        setSortBy("title");
    });

    //Dropdowns for number
    let lim30 = document.getElementById("30");
    lim30.addEventListener('click', () => {
        setLimit(30);
    });
    let lim60 = document.getElementById("60");
    lim60.addEventListener('click', () => {
        setLimit(60);
    });
    let lim120 = document.getElementById("120");
    lim120.addEventListener('click', () => {
        setLimit(120);
    });
    
    getGames();
    
});

function getGames() {
    // Recieves the data from the search
    let params = new URLSearchParams(window.location.search);
    let value = params.get("value");
    let type = params.get("type");
    // Makes the ajax call to recieve data
    $.ajax({
        type: 'POST',
        url: '/getSearchGames',
        data: {
            "value": value,
            "type": type,
            "limit": limit,
            "sort": sort
        }
        // Displays the cards in the cardImgContainer
    }).done(function(games) {
        let imgContainer = document.getElementById("imageContainer")
        imgContainer.innerHTML = "";
        for (let i = 1; i < games.length + 1; i++) {
            // Assigns a placeholder if there is no card for the game
            let placeholderImg = imageSearch.getDefaultImage(games[i-1].name);//"images/Steam_Not_Found.jpg";
            let container = document.createElement('a');
            let cardImg = imageSearch.getCardImage(games[i-1].id);

            // Adds the card class to the cardImg for formatting
            cardImg.classList.add("card");
            cardImg.setAttribute('onerror', `this.src = '${placeholderImg}';`)
            container.setAttribute('href', `/game?id=${games[i-1].id}`);
            container.appendChild(cardImg);
            imgContainer.appendChild(container);
            
        }
    });
}

function generateSearchOptions(){
    let table = document.getElementById('searchOption');
    
    let tr = document.createElement('tr');
    for(let i=0; i<searchOptions.length; i++){
        let searchOption = document.createElement('td');
        searchOption.style="padding-left: 4rem"
        if (searchOptions[i] == "gameName") {
            searchOption.innerText = "Game Name";
        }
        else {
            searchOption.innerText = "Steam ID"
        }
        searchOption.id = searchOptions[i];
        
        searchOption.onclick = function(){
            document.getElementById("dropval").value = searchOption.id;

            if (searchOption.id == "steamID") {
                let td = document.getElementById("gameName")
                td.classList.remove("isHighlighted");
                td.style = "padding-left: 4rem; color: rgb(195, 195, 195);";
            }
            else{
                let td = document.getElementById("steamID")
                td.classList.remove("isHighlighted");
                td.style = "padding-left: 4rem; color: rgb(195, 195, 195);";
            }
    

            // Checks if the class is already applied, in which case it removes the class
            if(searchOption.classList.contains("isHighlighted")){
                searchOption.classList.remove("isHighlighted");
                searchOption.style.color="rgb(195, 195, 195)"
            }else{
                searchOption.classList.add("isHighlighted");
                searchOption.style.color="black"                
            }
        }
        tr.appendChild(searchOption);
    }
    table.appendChild(tr);
}

// Generates the List of genres and applies the classes and onclick functionality
function generateListGenres(){
    //Gets the table from game_list.pug
    let table = document.getElementById('genreTable')
    for(let i = 0;  i < genreList.length; i++){
        //creates a table row and genre as a td
        let tr = document.createElement('tr');
        let genre = document.createElement('td');
        // onclick functionality to apply the ishighlighted class, and adds the text to the search bar
        genre.onclick = function(){
            let typeIn = document.getElementById("dropval");
            typeIn.value = "genre";
            // Checks if the class is already applied, in which case it removes the class
            if(genre.classList.contains("isHighlighted")){
                genre.classList.remove("isHighlighted");
                genre.style.color="rgb(195, 195, 195)"
                //Removes the genre from the search bar
                mainSearch.removeFromSearch(genreList[i])
            }else{
                genre.classList.add("isHighlighted");
                genre.style.color="black"
                //Adds the genre to the search bar
                mainSearch.fillInSearch(genreList[i]);

            }
        }
        //Sets the value of td to have the genre
        genre.innerHTML=genreList[i];
        tr.appendChild(genre);
        table.appendChild(tr);
    }
}