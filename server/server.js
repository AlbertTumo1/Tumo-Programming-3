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

// IMPORTANT TASKS: Unique Events

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

realWeather = null;
realEvent = null;

var id;

const a = 16;
const b = 16;

side = 50;

function Generation(count ,character) {
    let p = 0;
    while (p < count) {
        let k = Math.floor(Math.random() * a);
        let l = Math.floor(Math.random() * b);
        if(matrix[k][l] == 0){
            matrix[k][l] = character;
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
    Generation(30,2); // grass eater
    Generation(25,3); // predator
    Generation(15,4); // king eater
    Generation(15,5); // enemy eater (eats only grassEater and Predator)
}

function createObjects() {
    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < matrix[y].length; ++x){
            if(matrix[y][x] == 1){
                console.log("GENERATED NEW GRASS")
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

    if(realWeather == "winter") {
        id = setInterval(() => {
            console.log("PREDATOR INTERVAL")
            for(let i in predatorArr) {
                predatorArr[i].eat();   
            }
        }, 3000);
    } else {
        for(let i in predatorArr) {
            predatorArr[i].eat();   
        }
        if(id) {
            clearInterval(id);
        }
    }
   
    if(!realWeather || realWeather == "summer") {
        for(let i in kingEaterArr) {
            kingEaterArr[i].eat();   
        }
    } else if(realWeather == "winter") {
            for(let i in kingEaterArr) {
                kingEaterArr[i].eat();
            }   
    } else if(realWeather == "spring") {
            for(let i in kingEaterArr) {
                kingEaterArr[i].eat();   
            }
    } else if(realWeather == "autumn") {
            for(let i in kingEaterArr) {
                kingEaterArr[i].eat();   
            }
        }

    if(realWeather == "winter") {
       id = setInterval(() => {
            for(let i in enemyEaterArr) {
                enemyEaterArr[i].eat();   
            }
        }, 3000);
    } else {
        clearInterval(id)
        for(let i in enemyEaterArr) {
            enemyEaterArr[i].eat();   
        }
    }

    io.sockets.emit("display_matrix", {matrix: matrix, side: side});
}

function Stastistics() {
    let creatures = {
        grass: grassArr.length, // 1
        grassEater:grassEaterArr.length, // 2
        predator:predatorArr.length, // 3
        kingEater:kingEaterArr.length, // 4
        enemyEater:enemyEaterArr.length, // 5
    };

    fs.writeFileSync("Stastics.txt", JSON.stringify(creatures, null, 2), "utf-8");
    let info = fs.readFileSync("Stastics.txt").toString();

    io.sockets.emit("display_statistics", creatures);
}

fillMatrix();
createObjects();
setInterval(start, 1000);
setInterval(Stastistics, 1000);

io.on('connection', function (socket) {
    socket.emit("display_matrix", {matrix: matrix, side: side});

    // Event
    socket.on("change_event", (event) => {
        realEvent = event;

        if(event !== "radiation") {
            for(let i = 0; i < grassArr.length; i++) {
                grassArr[i].allowed = true;
            }
        }

        if(event === "radiation") {
            console.log("RADIATION")
            for(let i = 0; i < grassArr.length; i++) {
                grassArr[i].allowed = false;
            }

            Generation(25, 2);

            for(let y = 0; y < matrix.length; ++y){
                for(let x = 0; x < matrix[y].length; ++x){
                    if(matrix[y][x] == 2){
                        console.log("GENERATED NEW GRASS EATER ))))")
                        let grassEater = new GrassEater(x,y,2);
                        grassEaterArr.push(grassEater);
                    }        
                }
            }
            // Generation(5,4); // king eater
        } else if(event === "virus") {
            console.log("VIRUSSS");

            grassEaterArr = [];
            kingEaterArr = [];

            console.log(grassEaterArr.length, kingEaterArr.length)

            Generation(30, 1);

            for(let y = 0; y < matrix.length; ++y){
                for(let x = 0; x < matrix[y].length; ++x){
                    if(matrix[y][x] == 1){
                        console.log("GENERATED NEW GRASS  ))))")
                        let grass = new Grass(x,y,1);
                        grassArr.push(grass);
                    }   
                    if(matrix[y][x] == 2){
                        matrix[y][x] = 0;
                    }  
                    if(matrix[y][x] == 4){
                        matrix[y][x] = 0;
                    }    
                }
            }
        } else if(event === "hunger") {
            console.log("HUNGER")
            
            Generation(8, 4);
            Generation(15, 5);

            for(let y = 0; y < matrix.length; ++y){
                for(let x = 0; x < matrix[y].length; ++x){
                    if(matrix[y][x] == 4){
                        console.log("GENERATED NEW KING EATER")
                        let kingEater = new KingEater(x,y,4);
                        kingEaterArr.push(kingEater);
                    } else if(matrix[y][x] == 5) {
                        console.log("GENERATED NEW Enemy Eater")
                        let enemyEater = new EnemyEater(x,y,5);
                        enemyEaterArr.push(enemyEater);
                    }
                }
            }
        } else if(event === "predator_spawner") {
            Generation(20, 3);

            for(let y = 0; y < matrix.length; ++y){
                for(let x = 0; x < matrix[y].length; ++x){
                    if(matrix[y][x] == 3){
                        console.log("GENERATED NEW PREDATOR");
                        let predator = new Predator(x,y,3);
                        predatorArr.push(predator);
                    }
                }
            }
        } 
        else if(event === "reset_game") {
            matrix = [];

            grassArr = [];
            grassEaterArr = [];
            predatorArr = [];
            kingEaterArr = [];
            enemyEaterArr = [];
            
            realWeather = null;
            realEvent = null;

            
        }
    })

    // Weather
    socket.on("get_weather", () => {
        socket.emit("get_weather", realWeather);
    })
    
    socket.on("change_weather", (weather) => {
        if(weather === "winter") {
            realWeather = "winter";

            for(let i = 0; i < grassArr.length; i++) {
                grassArr[i].allowed = false;
                
            }
        }
        else if(weather === "summer") {
            realWeather = "summer";

            for(let i = 0; i < grassArr.length; i++) {
                if(grassArr[i].allowed == false) {
                    grassArr[i].allowed = true;
                }
            }

            if(predatorArr.length > 0) {
                for(let i = 0; i < predatorArr.length; i++) {
                    predatorArr[i].energy = 20;
                }
            }

            if(kingEaterArr.length > 0) {
                for(let i = 0; i < kingEaterArr.length; i++) {
                    kingEaterArr[i].energy = 5;
                }
            }

            if(enemyEaterArr.length > 0) {
                for(let i = 0; i < enemyEaterArr.length; i++) {
                    enemyEaterArr[i].energy = 5;
                }
            }
        }
        else if(weather === "spring") {
            realWeather = "spring";

            for(let i = 0; i < grassArr.length; i++) {
                if(grassArr[i].allowed == false) {
                    grassArr[i].allowed = true;
                }
            }
        }
        else if(weather === "autumn") {
            realWeather = "autumn";

            for(let i = 0; i < grassArr.length; i++) {
                if(grassArr[i].allowed == false) {
                    grassArr[i].allowed = true;
                }
            }
        }
    })
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
    King Eater: Also changes color but becomes slower
    Enemy Eater: Becomes Slower
*/



// socket.on("change_event", (event) => {
//     realEvent = event;

//     if(event !== "radiation") {
//         for(let i = 0; i < grassArr.length; i++) {
//             grassArr[i].allowed = true;
//         }
//     }

//     if(event === "radiation") {
//         console.log("RADIATION")
//         for(let i = 0; i < grassArr.length; i++) {
//             grassArr[i].allowed = false;
//         }
//         Generation(5,4); // king eater
//     } else if(event === "virus") {
//         console.log("VIRUS!!!")
//         // Grass Eater, King Eater
//         kingEaterArr.length = 0;
//         grassEaterArr.length = 0;
//         Generation(20,1);
//     } else if(event === "rain") {
//         Generation(30,2); // grass eater
//         Generation(25,3); // predator
//         Generation(20,5);
//         kingEaterArr.length = 0;
//     }
// })