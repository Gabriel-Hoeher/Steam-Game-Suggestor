/**  
 * Returns the card image of a game given the steam id
 */
function getCardImage(steamID) {
    let url = "https://steamcdn-a.akamaihd.net/steam/apps/" + steamID + "/library_600x900_2x.jpg";
    let cardImage = document.createElement("img");
    cardImage.src = url;
    cardImage.alt = "card image";
    return cardImage;
}

/**  
 * Returns the background image of a game given the steam id
 */
function getBackgroundImage(steamID) {
    let url = "https://cdn.akamai.steamstatic.com/steam/apps/" + steamID + "/page_bg_generated_v6b.jpg";
    document.body.style.backgroundImage = `url(${url}), url(images/Background_Not_Found.jpg)`;
}

/**  
 * Returns the header image of a game given the steam id
 */
function getHeaderImage(steamID) {
    let url = "https://cdn.akamai.steamstatic.com/steam/apps/" + steamID + "/header.jpg";
    let headerImage = document.createElement("img");
    headerImage.src = url;
    return headerImage;
}

function getDefaultImage(name) {
    let canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;
    let ctx = canvas.getContext("2d");

    //Fill background
    ctx.fillStyle = "rgb(28, 65, 91)";
    ctx.fillRect(0, 0, 200, 300);

    ctx.fillStyle = "rgb(195, 195, 195)";   //Text colour
    ctx.font = '32px sans-serif';           //Size and font
    ctx.textAlign = "center";               //Centre text

    //Fit text to box size
    let words = name.split(" ");
    let line = "";
    let offset = 70;

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(line + " " + word).width;
        if (width < 200) {
            line = line + " " + word;
        }
        else {
            ctx.fillText(line, 100, offset);
            offset += 40;
            line = word;
        }
    }
    ctx.fillText(line, 100, offset);

    return canvas.toDataURL("images/jpg");
}

export { getHeaderImage, getBackgroundImage, getCardImage, getDefaultImage };