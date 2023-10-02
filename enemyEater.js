class EnemyEater {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.energy = 8;
        this.index = index;
        this.directions = [];
    }

    getNewCoordinates(){
        this.directions = [
             [this.x - 1, this.y - 1],
             [this.x    , this.y - 1],
             [this.x + 1, this.y - 1],
             [this.x - 1, this.y    ],
             [this.x + 1, this.y    ],
             [this.x - 1, this.y + 1],
             [this.x    , this.y + 1],
             [this.x + 1, this.y + 1]
        ];
     }
     
    chooseCell(character) {
        let found = [];
        this.getNewCoordinates();

        for (let i in this.directions) {
            let x = this.directions[i][0];
            let y = this.directions[i][1];

            if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length){
                if (matrix[y][x] == character) {
                    found.push(this.directions[i]);
                }
            }
        } 

        return found;
    }

    mul() {
        let newCell = random(this.chooseCell(2)) || random(this.chooseCell(3));
        if (newCell) {
            let enemyEater = new EnemyEater(newCell[0], newCell[1], this.index);
            enemyEaterArr.push(enemyEater);
            matrix[newCell[1]][newCell[0]] = 5;
        }
    }

    eat() {
        let grassEaterFoods = this.chooseCell(2);
        let predatorFoods = this.chooseCell(3);

        let grassEaterFood = random(grassEaterFoods);
        let predatorFood = random(predatorFoods);

        if (grassEaterFood) {
            this.energy++;
            matrix[this.y][this.x] = 0;
            let newX = grassEaterFood[0];
            let newY = grassEaterFood[1];
            matrix[grassEaterFood[1]][grassEaterFood[0]] = 5;
            this.x = newX;
            this.y = newY;

            for (let i in grassEaterArr) {
                if (newX == grassEaterArr[i].x && newY == grassEaterArr[i].y) {
                    grassEaterArr.splice(i, 1);
                    break;
                }
            }

            if (this.energy >= 12) {
                this.mul();
            }
            
        } else if(predatorFood) {
            this.energy++;
            matrix[this.y][this.x] = 0;
            let newX = predatorFood[0];
            let newY = predatorFood[1];
            matrix[predatorFood[1]][predatorFood[0]] = 5;
            this.x = newX;
            this.y = newY;

            for (let i in predatorArr) {
                if (newX == predatorArr[i].x && newY == predatorArr[i].y) {
                    predatorArr.splice(i, 1);
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

    move() {
        let emptyCells = this.chooseCell(0);
        let newCell = random(emptyCells);
        this.energy--; 

        if (newCell) {
            let newX = newCell[0];
            let newY = newCell[1];
            matrix[this.y][this.x] = 0;
            matrix[newY][newX] = 5;
            this.x = newX;
            this.y = newY;
        }

        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        for (let i in enemyEaterArr) {
            if (this.x == enemyEaterArr[i].x && this.y == enemyEaterArr[i].y) {
                enemyEaterArr.splice(i, 1);
                break;
            }
        }
        matrix[this.y][this.x] = 0;
    }
}