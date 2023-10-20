// replaces random(0, a) with Math.floor(Math.random() * a);
const socket = io();

function setup() {  
    createCanvas(16 * 50, 16 * 50);
    background('#acacac');
}

function myDraw(matrix, side) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 0) {
                fill("#acacac");
            } else if (matrix[y][x] == 1) {
                fill("green");
            } else if (matrix[y][x]==2){
                fill("#fbdc04")
            } else if (matrix[y][x] == 3) {
                fill("red");
            } else if (matrix[y][x] == 4) {
                fill("black");
            } else if (matrix[y][x] == 5) {
                fill("orange");
            }
         
            rect(x * side, y * side, side, side);
        }
    }
}

socket.on("display_matrix", handleMatrix);
socket.on("display_statistics", getStats);

function handleMatrix(info) {
    myDraw(info.matrix, info.side);
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