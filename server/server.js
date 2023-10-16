const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(express.static("../client"));

app.get("/", function(req, res){
   res.redirect("index.html");
});



// MY CODE



const Grass = require("./grass.js");
const GrassEater = require("./GrassEater.js");
const KingEater = require("./kingEater.js");
const Predator = require("./predator.js");
const EnemyEater = require("./enemyEater.js");

let matrix = [];

const side = 50;

const grassArr = [];
const grassEaterArr = [];
const predatorArr = [];
const kingEaterArr = [];
const enemyEaterArr = [];

const a = 16;
const b = 16;

function Generation(count ,character) {
    let p = 0;
    while (p < count) {
        let k = Math.floor(random(0,a))
        let l = Math.floor(random(0,b))
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

    // Generation(16,1); // grass
    // Generation(3,2); // grass eater
    // Generation(3,3); // predator
    // Generation(2,4); // king eater
    // Generation(15,5); // enemy eater (eats only grassEater and Predator)
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
}

fillMatrix();
createObjects();

console.log(matrix)

io.on('connection', function (socket) {
    socket.emit("display_matrix", matrix);
});
 
server.listen(3000, function(){
    console.log("Example is running on port 3000, test");
 });