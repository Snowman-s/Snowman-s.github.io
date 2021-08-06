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
        noStroke()
        square(this.x - this.size / 2, this.y - this.size / 2, this.size)
        pop()
    }
}

let i = 0
let player

let keyMap = new Map()
let bulletList = []

function setup() {
    createCanvas(500, 500)

    player = new Player()
    player.x = 250
    player.y = 450

    keyMap.set(UP_ARROW, false)
    keyMap.set(DOWN_ARROW, false)
    keyMap.set(LEFT_ARROW, false)
    keyMap.set(RIGHT_ARROW, false)
}

function draw() {
    background(0)

    player.moveByKey()
    bulletList.forEach((a, b, c) =>{a.move()})

    if(player.x < 0) player.x = 0
    if(player.y < 0) player.y = 0
    if(player.x > 500) player.x = 500
    if(player.y > 500) player.y = 500

    player.onDraw()
    bulletList.forEach((a, b, c) =>{a.onDraw()})

    bulletList = bulletList.filter((a, b, c) => {
        return (a.x > -100 && 600 > a.x) && (a.y > -100 && 600 > a.y)
    })

    if(frameCount % 60 == 0){
        for (let angle = 0; angle < TAU; angle+=PI/6) {
            let bullet = new Bullet()
            bullet.angle = angle; bullet.speed = 5; bullet.size = 5;
            bullet.x = bullet.y = 250;
            bulletList.push(bullet)
        }
    }

    i++
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