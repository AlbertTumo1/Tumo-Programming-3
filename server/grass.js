const LivingCreature = require("./LivingCreature.js");
const random = require("./random.js");

module.exports = class Grass extends LivingCreature {
    constructor(x, y, index){
        super(x, y, index);
        this.energy = 8;
        this.allowed = true;
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
        this.multiply++;
        let newCell = random(this.chooseCell(0));

        // console.log(newCell, this.multiply);
        if (this.multiply >= 3 && newCell && this.allowed) {
            let newGrass = new Grass(newCell[0], newCell[1], this.index);
            grassArr.push(newGrass);
            matrix[newCell[1]][newCell[0]] = 1;
            this.multiply = 0;  
        }

        if (this.energy <= 1) {
            this.die();
        }
    }

    die() {
        for (let i in grassArr) {
            if (this.x == grassArr[i].x && this.y == grassArr[i].y) {
                grassArr.splice(i, 1);
                break;
            }
        }

        matrix[this.y][this.x] = 0;
    }
}


