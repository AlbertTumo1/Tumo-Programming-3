// replaces random(0, a) with Math.floor(Math.random() * a);

const socket = io();

let board;
let colorWeather;

let winterBtn = document.getElementById("weather-winter");
let sprintBtn = document.getElementById("weather-spring");
let summerBtn = document.getElementById("weather-summer");
let autumnBtn = document.getElementById("weather-autumn");

winterBtn.addEventListener("click", () => handleWeatherChange("winter"));
sprintBtn.addEventListener("click", () => handleWeatherChange("spring"));
summerBtn.addEventListener("click", () => handleWeatherChange("summer"));
autumnBtn.addEventListener("click", () => handleWeatherChange("autumn"));

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
                fill("#fbdc04")
            } else if (matrix[y][x] == 3 && colorWeather !== "winter") {
                fill("red");
            } else if (matrix[y][x] == 4 && colorWeather !== "winter") {
                fill("black");
            } else if (matrix[y][x] == 5) {
                fill("orange");
            }
            else if (matrix[y][x] == 1 && colorWeather == "winter") {
                fill("F5F5F5");
            }    
            else if (matrix[y][x] == 2 && colorWeather == "winter") {
                fill("#ffe505");
            }   
            else if (matrix[y][x] == 3 && colorWeather == "winter") {
                fill("#560d0d");
            }     
            else if (matrix[y][x] == 4 && colorWeather == "winter") {
                fill("#2d2d2d");
            }      
            rect(x * side, y * side, side, side);
            console.log(colorWeather)
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