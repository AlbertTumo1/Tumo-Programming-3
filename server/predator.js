const LivingCreature = require("./LivingCreature.js");
const random = require("./random.js");

module.exports = class Predator extends LivingCreature {
    constructor(x, y, index){
        super(x, y, index);
        this.energy = 8;
        this.eatGrass = false;
    }

    getNewCoordinates() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    chooseCell(character) {
        this.getNewCoordinates();
        return super.chooseCell(character);
    }
    
    mul() {
        var newCell;
        if(!this.eatGrass) {
            newCell = random(this.chooseCell(2));
        } else {
            newCell = random(this.chooseCell(1)) || random(this.chooseCell(2));
        }
        
        if (newCell) {
            let predator = new Predator(newCell[0], newCell[1], this.index);
            predatorArr.push(predator);
            matrix[newCell[1]][newCell[0]] = 2;
        }
    }

    eat() {
        if(!this.eatGrass) {
            let foods = this.chooseCell(2);
            let food = random(foods);

            if (food) {
                this.energy++;
                matrix[this.y][this.x] = 0
                let newX = food[0]
                let newY = food[1]
                matrix[food[1]][food[0]] = 3;
                this.x = newX;
                this.y = newY;
    
                for (let i in grassEaterArr) {
                    if (newX == grassEaterArr[i].x && newY == grassEaterArr[i].y) {
                        grassEaterArr.splice(i, 1);
                        break;
                    }
                }
                if (this.energy >= 13) {
                    this.mul();
                }
            }
            
            else {
                this.move()
            }
        } else {
            let grassFoods = this.chooseCell(1);
            let grassEaterFoods = this.chooseCell(2);
            
            let grassFood = random(grassFoods);
            let grassEaterFood = random(grassEaterFoods);

            if (grassFood) {
                this.energy++;
                matrix[this.y][this.x] = 0;
                let newX = grassFood[0];
                let newY = grassFood[1];
                matrix[grassFood[1]][grassFood[0]] = 3;
                this.x = newX;
                this.y = newY;
    
                for (let i in grassArr) {
                    if (newX == grassArr[i].x && newY == grassArr[i].y) {
                        grassArr.splice(i, 1);
                        break;
                    }
                }
    
                if (this.energy >= 12) {
                    this.mul();
                }
    
            } else if (grassEaterFood) {
                this.energy++;
                matrix[this.y][this.x] = 0;
                let newX = grassEaterFood[0];
                let newY = grassEaterFood[1];
                matrix[grassEaterFood[1]][grassEaterFood[0]] = 3;
                this.x = newX;
                this.y = newY;
    
                for (let i in grassEaterArr) {
                    if (newX == grassEaterArr[i].x && newY == grassEaterArr[i].y) {
                        grassEaterArr.splice(i, 1);
                        break;
                    }
                }
    
                if (this.energy >= 14) {
                    this.mul();
                }
            }
            else {
                this.move();
            }
        }
    }

    move() {
        let emptyCells = this.chooseCell(0);
        let newCell = random(emptyCells);
        this.energy--; 

        if (newCell) {
            let newX = newCell[0]
            let newY = newCell[1]
            matrix[this.y][this.x] = 0
            matrix[newY][newX] = 3
            this.x = newX
            this.y = newY
        }

        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        for (let i in predatorArr) {
            if (this.x == predatorArr[i].x && this.y == predatorArr[i].y) {
                predatorArr.splice(i, 1);
                break;
            }
        }

        matrix[this.y][this.x] = 0;
    }
}