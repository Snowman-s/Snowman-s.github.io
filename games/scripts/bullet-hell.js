class Player {
    constructor (){
        this.x = 0
        this.y = 0
        this.size = 5
        this.speed = 4
    }

    moveByKey(){
        let dx = 0
        let dy = 0
        if(keyMap.get(UP_ARROW)){
            dy -= 1
        }
        if(keyMap.get(DOWN_ARROW)){
            dy += 1
        }
        if(keyMap.get(LEFT_ARROW)){
            dx -= 1
        }
        if(keyMap.get(RIGHT_ARROW)){
            dx += 1
        }

        if(Math.abs(dx) > 0 && Math.abs(dy) > 0) {
            dx /= Math.sqrt(2)     
            dy /= Math.sqrt(2) 
        }

        dx *= this.speed
        dy *= this.speed

        this.x += dx
        this.y += dy
    }

    onDraw(){
        push()
        fill(255, 0, 0)
        noStroke()
        square(this.x - this.size / 2, this.y - this.size / 2, this.size)
        pop()
    }
}

class Bullet {
    constructor (){
        this.x = 0
        this.y = 0
        this.size = 5
        this.speed = 4
        this.angle = 2 * PI
    }

    move(){
        this.x += this.speed * cos(this.angle)
        this.y += this.speed * sin(this.angle)
    }

    onDraw(){
        push()
        noStroke(255)
        square(this.x - this.size / 2, this.y - this.size / 2, this.size)
        pop()
    }
}

let player

let keyMap = new Map()
let bulletList = []
let gameOver = false

let frame = 0

function setup() {
    createCanvas(500, 500)

    restart()
}

function draw() {
    if(!gameOver) doTask()
    render()
    
    if(keyMap.get(82)) restart()
}

function doTask(){
    player.moveByKey()
    bulletList.forEach((a, b, c) =>{a.move()})

    if(player.x < 0) player.x = 0
    if(player.y < 0) player.y = 0
    if(player.x > 500) player.x = 500
    if(player.y > 500) player.y = 500

    bulletList = bulletList.filter((a, b, c) => {
        return (a.x > -100 && 600 > a.x) && (a.y > -100 && 600 > a.y)
    })

    let hitBullet = bulletList.filter((a, b, c) => {
        let sizeAve = a.size / 2 + player.size / 2
        return abs(a.x - player.x) < sizeAve && abs(a.y - player.y) < sizeAve
    })

    if(hitBullet.length > 0){
        gameOver = true
    }

    if(frameCount % 60 == 0){
        for (let angle = 0; angle < TAU; angle+=PI/6) {
            let bullet = new Bullet()
            bullet.angle = angle; bullet.speed = 5; bullet.size = 5;
            bullet.x = bullet.y = 250;
            bulletList.push(bullet)
        }
    }
}

function render(){
    background(0)

    player.onDraw()
    bulletList.forEach((a, b, c) =>{a.onDraw()})

    if (gameOver) {
        push()
        fill(255)
        stroke(255)
        textAlign(CENTER)
        textSize(50)
        text('Game Over!!', 0, 150, 500)
        textSize(30)
        text('Press \"R\" to Restart', 0, 350, 500)
        pop()
    }
}

function restart(){
    player = new Player()
    player.x = 250
    player.y = 450

    keyMap.set(UP_ARROW, false)
    keyMap.set(DOWN_ARROW, false)
    keyMap.set(LEFT_ARROW, false)
    keyMap.set(RIGHT_ARROW, false)
    keyMap.set(82, false)

    gameOver = false
    frame = 0

    bulletList = []
}

function keyPressed(){
    if(keyMap.has(keyCode)){
        keyMap.set(keyCode, true)
    }
}

function keyReleased(){
    if(keyMap.has(keyCode)){
        keyMap.set(keyCode, false)
    }
}