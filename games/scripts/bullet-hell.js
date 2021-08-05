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
        square(player.x - player.size / 2, player.y - player.size / 2, player.size)
        pop()
    }
}

let i = 0
let player

let keyMap = new Map()

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

    if(player.x < 0) player.x = 0
    if(player.y < 0) player.y = 0
    if(player.x > 500) player.x = 500
    if(player.y > 500) player.y = 500

    player.onDraw()

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