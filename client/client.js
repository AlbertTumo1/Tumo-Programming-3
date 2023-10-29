// replaces random(0, a) with Math.floor(Math.random() * a);

const socket = io();

let board;
let colorWeather = "summer";

console.log(colorWeather);

let winterBtn = document.getElementById("weather-winter");
let sprintBtn = document.getElementById("weather-spring");
let summerBtn = document.getElementById("weather-summer");
let autumnBtn = document.getElementById("weather-autumn");

let eventRadiation = document.getElementById("event-radiation");
let eventVirus = document.getElementById("event-virus");
let eventRain = document.getElementById("event-rain");

winterBtn.addEventListener("click", () => handleWeatherChange("winter"));
sprintBtn.addEventListener("click", () => handleWeatherChange("spring"));
summerBtn.addEventListener("click", () => handleWeatherChange("summer"));
autumnBtn.addEventListener("click", () => handleWeatherChange("autumn"));

eventRadiation.addEventListener("click", () => handleEventChange("radiation"));
eventVirus.addEventListener("click", () => handleEventChange("virus"));
eventRain.addEventListener("click", () => handleEventChange("rain"));

function setup() {  
    createCanvas(16 * 50, 16 * 50);
    background('#acacac');
}

function myDraw(matrix, side) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 0) {
                fill("#acacac");
            } else if (matrix[y][x] == 1 && colorWeather !== "winter") {
                fill("green");
            } else if (matrix[y][x] == 2 && colorWeather !== "winter"){
                fill("yellow") // yellow
            } else if (matrix[y][x] == 3 && colorWeather !== "winter") {
                fill("red");
            } else if (matrix[y][x] == 4 && colorWeather !== "winter") {
                fill("#898383");
            } else if (matrix[y][x] == 5 && colorWeather !== "winter") {
                fill("blue");
            }

            // winter
            
            else if (matrix[y][x] == 1 && colorWeather == "winter") {
                console.log("HELLO WINTA")
                fill("F5F5F5");
            }    
            else if (matrix[y][x] == 2 && colorWeather == "winter") {
                fill("#fff9ae");
            }   
            else if (matrix[y][x] == 3 && colorWeather == "winter") {
                fill("#ff7b7b");
            }     
            else if (matrix[y][x] == 4 && colorWeather == "winter") {
                fill("#2d2d2d");
            }   
            else if (matrix[y][x] == 5 && colorWeather == "winter") {
                fill("#4169e1");
            }
            
            if (matrix[y][x] == 1 && colorWeather == "autumn") {
                console.log("HELLO AUTMN")
                fill("#d6d6d6");
            }    
            if (matrix[y][x] == 2 && colorWeather == "autumn") {
                fill("#f8ed62");
            }   
            if (matrix[y][x] == 3 && colorWeather == "autumn") {
                fill("#ff7b7b");
            }     
            if (matrix[y][x] == 4 && colorWeather == "autumn") {
                fill("#635b5b");
            }   
            if (matrix[y][x] == 5 && colorWeather == "autumn") {
                fill("#4169e1");
            }  

            else if (matrix[y][x] == 5 && colorWeather == "spring") {
                fill("#0092ff");
            }

            rect(x * side, y * side, side, side);
        }
    }
}

socket.on("display_matrix", handleMatrix);
socket.on("display_statistics", getStats);

function handleMatrix(info) {
    myDraw(info.matrix, info.side);
    board = info.matrix;
}

function handleWeatherChange(weather) {
    colorWeather = weather;
    socket.emit("change_weather", weather);
}

function handleEventChange(event) {
    socket.emit("change_event", event);
}

function getStats(creatures) {
    let grassCount = document.getElementById("grass-count");
    let grassEaterCount = document.getElementById("grassEater-count");
    let predatorCount = document.getElementById("predator-count");
    let kingEaterCount = document.getElementById("kingEater-count");
    let enemyEaterCount = document.getElementById("enemyEater-count");

    grassCount.textContent = `Grass Count: ${creatures.grass}`;
    grassEaterCount.textContent = `Grass Eater Count: ${creatures.grassEater}`;
    predatorCount.textContent = `Predator Count: ${creatures.predator}`;
    kingEaterCount.textContent = `King Eater Count: ${creatures.kingEater}`;
    enemyEaterCount.textContent = `Enemy Eater Count: ${creatures.enemyEater}`;
    console.log(creatures)
}

socket.on("get_weather", (realWeather) => colorWeather = realWeather);

window.onload = function() {
    socket.emit("get_weather");
}