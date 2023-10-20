const express = require("express");
const app = express();
const fs = require("fs");
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(express.static("../client"));

app.get("/", function(req, res){
   res.redirect("index.html");
});



// MY CODE

// IMPORTANT TASKS: Statstics, Weather, Unique Events

const Grass = require("./grass.js");
const GrassEater = require("./GrassEater.js");
const KingEater = require("./kingEater.js");
const Predator = require("./predator.js");
const EnemyEater = require("./enemyEater.js");

matrix = [];

grassArr = [];
grassEaterArr = [];
predatorArr = [];
kingEaterArr = [];
enemyEaterArr = [];

const a = 16;
const b = 16;

side = 50;

function Generation(count ,character) {
    let p = 0;
    while (p < count) {
        let k = Math.floor(Math.random() * a);
        let l = Math.floor(Math.random() * b);
        console.log(k, l)
        if(matrix[k][l] == 0){
            matrix[k][l] = character
        }

        p++;
    }
}

function fillMatrix() {
    for (let i = 0; i < a; i++) {
        matrix.push([])

        for (let j = 0; j < b; j++) {
            matrix[i].push(0)
        }
    }

    Generation(60,1); // grass
    Generation(3,2); // grass eater
    Generation(10,3); // predator
    Generation(4,4); // king eater
    Generation(15,5); // enemy eater (eats only grassEater and Predator)
}

function createObjects() {
    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < matrix[y].length; ++x){
            if(matrix[y][x] == 1){
                let grass = new Grass(x,y,1);
                grassArr.push(grass);
            }
            else if(matrix[y][x] == 2){
                let grassEater = new GrassEater(x,y,2)
                grassEaterArr.push(grassEater)
            } 
            else if(matrix[y][x] == 3){
                let predator = new Predator(x,y,3)
                predatorArr.push(predator);
            }  
            else if(matrix[y][x] == 4){
                let kingEater = new KingEater(x,y,4);
                kingEaterArr.push(kingEater);
            }  
            else if(matrix[y][x] == 5){
                let enemyEater = new EnemyEater(x,y,5);
                enemyEaterArr.push(enemyEater);
            }          
        }
    }
}

function start() {
    for(let i in grassArr){
        grassArr[i].mul();
    }

    for(let i in grassEaterArr) {
        grassEaterArr[i].eat();   
    }

    for(let i in predatorArr) {
        predatorArr[i].eat();   
    }

    for(let i in kingEaterArr) {
        kingEaterArr[i].eat();   
    }

    for(let i in enemyEaterArr) {
        enemyEaterArr[i].eat();   
    }

    io.sockets.emit("display_matrix", {matrix: matrix, side: side});
}

function Stastistics() {
    let creatures = {
        grass:0, // 1
        grassEater:0, // 2
        predator:0, // 3
        kingEater:0, // 4
        enemyEater:0, // 5
    };

    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < matrix[y].length; ++x){
            if(matrix[y][x] == 1){
                creatures['grass'] += 1;
            }
            if(matrix[y][x] == 2){
                creatures['grassEater'] += 1;
            }
            if(matrix[y][x] == 3){
                creatures['predator'] += 1;
            }
            if(matrix[y][x] == 4){
                creatures['kingEater'] += 1;
            }
            if(matrix[y][x] == 5){
                creatures['enemyEater'] += 1;
            }
        }
    }

    fs.writeFileSync("Stastics.txt", JSON.stringify(creatures, null, 2), "utf-8");
    let info = fs.readFileSync("Stastics.txt").toString();
    console.log(info)

    io.sockets.emit("display_statistics", creatures);


}

fillMatrix();
createObjects();
setInterval(start, 1000);
setInterval(Stastistics, 1000);

console.log(matrix);

io.on('connection', function (socket) {
    socket.emit("display_matrix", {matrix: matrix, side: side});
});
 
server.listen(3000, function(){
    console.log("Example is running on port 3000, test");
});

/*
Weather: Spring
    Grass: Normal 
    Grass Eater: Becomes slower and energy levels drop a little
    Predator: Normal
    King Eater: Becomes slower and energy levels drop a little
    Enemy Eater: Becomes faster

Weather: Summer
    Grass: Faster
    Rest: Slower

Weather: Autumn
    Grass: Energy levels drop a little and loses a bit of color
    Grass Eater: Energy levels rise
    Predator: Becomes a little faster
    King Eater: Energy levels rise a little
    Enemy Eater: Energy levels drop a little

Weather Winter
    Grass: Changes Color to a little white / Stops Spreading
    Grass Eater: Becomes darker and starts spreading faster
    Predator: Becomes much faster and changes color to a little darker red
    King Eater: Also changes color but becomes faster
    Enemy Eater: Becomes Slower
*/