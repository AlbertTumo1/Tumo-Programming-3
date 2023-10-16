// replaces random(0, a) with Math.floor(Math.random() * a);
const socket = io();

function setup() {  
    createCanvas(matrix[0].length * side, matrix.length * side);
    background('#acacac');

    Generation(16,1); // grass
    Generation(3,2); // grass eater
    Generation(3,3); // predator
    Generation(2,4); // king eater
    Generation(15,5); // enemy eater (eats only grassEater and Predator)
}

function draw() {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 0) {
                fill("#acacac");
            } else if (matrix[y][x] == 1) {
                fill("green");
            } else if (matrix[y][x]==2){
                fill("yellow")
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

function handleMatrix(info) {
    console.log(info);
}