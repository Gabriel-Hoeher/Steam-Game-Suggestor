let searchData = {
    'search' : 'temp',
    'type' : [{'Genre': 'Action'}]
} 

let genreList = [
    "Single-player", "Multi-player", "Co-op", "Action", "Indie", "Adventure", "Simulation",
    "Strategy", "DLC", "RPG", "Game demo", "Racing",  "PvP", "Cross-Play", "Casual", "In-App Purchases",
    "Free to Play"
]

let curType = 'steamID';
let tpBtnClck = false;

window.onload = function() {
    generateGenres();
    console.log("Page Loaded");
    
    let typeIcon = d3.select('#type-button');
    
    typeIcon.append('figure')
    .attr('class', 'image is-32x32 icon')
    .append('img')
    .attr('src', '../images/steam_icon.png');

    let typeButton = document.getElementById('type-button');
    typeButton.addEventListener('click', () => {
        typeFunction();
    });

    let steamS = document.getElementById('steamID');
    steamS.addEventListener('click', () => {
        typeClick('steamID');
    });

    let gameS = document.getElementById('gameName');
    gameS.addEventListener('click', () => {
        typeClick('gameName');
    });

    let genreS = document.getElementById('genre');
    genreS.addEventListener('click', () => {
        typeClick('genre');
    });
};
    
function myClick(event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('#icon') && !event.target.matches('svg')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
        tpBtnClck = false;
        document.getElementById('genreContainer').style.opacity = 1;
        document.getElementById("genreContainer").style.zIndex = 0;
        window.removeEventListener("click", myClick);
    }
}
    
function typeFunction() {
    window.removeEventListener("click", myClick);
    document.getElementById("typedown").classList.toggle("show");
    document.getElementById("genreContainer").style.zIndex = -1;
    document.getElementById('genreContainer').style.opacity = 0.5;
    
    if (tpBtnClck) {
        tpBtnClck = false;
        document.getElementById('genreContainer').style.opacity = 1;
        document.getElementById("genreContainer").style.zIndex = 0;
    } else {
        tpBtnClck = true;
    }
    
    if (document.getElementById("typedown").classList.contains("show")) {
        // Close the dropdown menu if the user clicks outside of it
        window.addEventListener("click", myClick);
    }
}
    
function typeClick(type) {
    let typeInput = document.getElementById('dropval');
    typeInput.value = type;
    
    let typeBtn = d3.select('#type-button');
    let typeIcon = d3.select('.icon');
    
    let table = document.querySelectorAll('.isHighlighted');
    
    if (type == 'steamID' && curType != 'steamID') {
        typeIcon.remove("img");
        console.log("steam");
        typeBtn.append('figure')
        .attr('class', 'image is-32x32 icon')
        .append('img')
        .attr('src', '../images/steam_icon.png');
        document.getElementById("search-txt").placeholder = "Search Steam ID...";
        document.getElementById("search-txt").value = "";
        curType = 'steamID';
        for (var i = 0; i < table.length; i++) {
            table[i].classList.remove("isHighlighted");
            table[i].style.color="rgb(195, 195, 195)"
        }
    }
    else if (type == 'gameName' && curType != 'gameName') {
        typeIcon.remove("img");
        typeInput.value = ("gameName");
        console.log("game");
        typeBtn.append('figure')
        .attr('class', 'image is-32x32 icon')
        .append('img')
        .attr('src', '../images/gamepad_icon.png');
        document.getElementById("search-txt").placeholder = "Search Game...";
        document.getElementById("search-txt").value = "";
        curType = 'gameName';
        for (var i = 0; i < table.length; i++) {
            table[i].classList.remove("isHighlighted");
            table[i].style.color="rgb(195, 195, 195)"
        }
    }
    else if (type == 'genre' && curType != 'genre') {
        typeIcon.remove("img");
        console.log("genre");
        typeBtn.append('figure')
        .attr('class', 'image is-32x32 icon')
        .append('img')
        .attr('src', '../images/crosshairs_icon.png');
        document.getElementById("search-txt").placeholder = "Search By Genre...";
        document.getElementById("search-txt").value = "";
        curType = 'genre';
    }
    tpBtnClck = false;
    document.getElementById('genreContainer').style.opacity = 1;
    document.getElementById("genreContainer").style.zIndex = 0;
}


function generateGenres(){
    // grabs the genreTable from the html
    let table = document.getElementById('genreTable');
    
    // Sets the caption 
    let cap = document.createElement('caption');
    cap.innerHTML = "Select your genre(s)"
    table.appendChild(cap);
    
    //Sets the value for formatting a new line
    var evenOdd = Math.round(genreList.length / 2);
    
    //Creates a new table row
    let tr = document.createElement('tr');
    for(let i = 0; i < genreList.length; i++){
        
        //genre represents the table data
        let genre = document.createElement('td')
        
        //Assigns the onclick functionality
        genre.onclick = function(){
            typeClick("genre");
            //Adds or removes the text if the genre has been clicked before
            if(genre.classList.contains("isHighlighted")){
                genre.classList.remove("isHighlighted");
                genre.style.color="rgb(195, 195, 195)"
                //Removes text from the search bar
                removeFromSearch(genreList[i])
            }else{
                genre.classList.add("isHighlighted");
                genre.style.color="black"
                //Adds text to the search bar
                fillInSearch(genreList[i]);
            }
        };
        
        //Sets the style of the genre to the colour in the search box
        genre.style.color="rgb(195, 195, 195)"
        genre.innerHTML = genreList[i]
        
        tr.appendChild(genre);
        
        //Adds new lines if necessary for formatting
        if (evenOdd % 2 == 0) {
            if ((i+1) % 6 == 0) {
                table.appendChild(tr);
                tr = document.createElement('tr');
            }
        } else {
            if ((i+1) % 5 == 0) {
                table.appendChild(tr);
                tr = document.createElement('tr');
            }
        }
    }
    table.appendChild(tr);
}

function removeFromSearch(text){
    //Removes all possible outcomes for inserting a genre, also dissallows multiple genres to be entered
    //Order is key here, if the order is switched it may cause an error.
    document.getElementById("search-txt").value = document.getElementById("search-txt").value.replace(text + ",",'');
    document.getElementById("search-txt").value = document.getElementById("search-txt").value.replace("," + text,'');
    document.getElementById("search-txt").value = document.getElementById("search-txt").value.replace(text,'');
}

function fillInSearch(text){
    // Checks if there is text in there in order to put a , if necessary
    if(document.getElementById("search-txt").value != ""){
        document.getElementById("search-txt").value += "," + text;
    }
    // Runs if the search bar is empy
    else{
        document.getElementById("search-txt").value += text;
    }
    
}

export{fillInSearch, removeFromSearch}