class Player {
    constructor (){
        this.x = 0
        this.y = 0
        this.size = 5
        this.speed = 4
        this.hitFrame = -1
        this.hitEffectFrame = 40
    }

    onTask(){
        if(!this.isDamaged()) this.moveByKey()
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

    hit(){
        if(this.isDamaged()) return

        this.hitFrame = frame
    }

    isDamaged(){
        return this.hitFrame >= 0
    }

    isDead(){
        return this.hitFrame >= 0 && this.hitFrame + this.hitEffectFrame < frame
    }

    onDraw(){
        push()
        noStroke()
        if(! this.isDamaged()){
            fill(255, 0, 0)
            square(this.x - this.size / 2, this.y - this.size / 2, this.size)
        } else {     
            const effectProgress = (frame - this.hitFrame) / this.hitEffectFrame
            const radius = effectProgress * this.size * 5;
               
            fill(255, 255 * sin(effectProgress * PI))
            rect(0, 0, width, height)
            fill(255, 0, 0)
            for (let angle = 0; angle < TAU; angle += PI/6) {
                square(this.x - this.size / 2 + radius * cos(angle), 
                    this.y - this.size / 2 + radius * sin(angle), 
                    this.size * (1 - effectProgress))
            }
        }
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

let frame = 0

function setup() {
    createCanvas(500, 500)

    restart()
}

function draw() {
    doTask()
    render()
}

function doTask(){
    player.onTask()
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
        player.hit()
    }

    if(frameCount % 60 == 0){
        for (let angle = 0; angle < TAU; angle+=PI/6) {
            let bullet = new Bullet()
            bullet.angle = angle; bullet.speed = 5; bullet.size = 5;
            bullet.x = bullet.y = 250;
            bulletList.push(bullet)
        }
    }

    frame++

    if(player.isDead()) restart()
}

function render(){
    background(0)

    player.onDraw()
    bulletList.forEach((a, b, c) =>{a.onDraw()})
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