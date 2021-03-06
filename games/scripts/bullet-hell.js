const stgAreaWidth = 500
const stgAreaHeight = 500

const progressGaugeAreaWidth = 50

const messageAreaWidth = 400

const bulletLiveWidthMargin = 100
const bulletLiveHeightMargin = 100

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
            circle(this.x, this.y, this.size)
        } else {     
            const effectProgress = min(1, (frame - this.hitFrame) / this.hitEffectFrame)
            const radius = effectProgress * this.size * 5;

            fill(255, 0, 0)
            for (let angle = 0; angle < TAU; angle += PI/6) {
                circle(this.x + radius * cos(angle), 
                    this.y + radius * sin(angle), 
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
        circle(this.x, this.y, this.size)
        pop()
    }
}

class ToWhiteEffect{
    constructor (){
        this.flashFrame = 20
        this.frame = this.flashFrame + 1
        this.onflashMax = () => {       
        }
    }
    start(onflashMax){
        this.onflashMax = onflashMax
        this.frame = 0
    }
    onTask(){
        this.frame++

        if(this.frame == this.flashFrame){
            this.onflashMax()
        }
    }

    onDraw(){
        if(this.frame > this.flashFrame) return

        let alpha = 255 * sin(this.frame / this.flashFrame * PI / 2)

        background(255, alpha)
    }
}

class ToBlackEffect{
    constructor (){
        this.flashFrame = 20
        this.frame = this.flashFrame + 1
        this.onflashMin = () => {       
        }
    }
    start(onflashMin){
        this.onflashMin = onflashMin
        this.frame = 0
    }
    onTask(){
        this.frame++

        if(this.frame == this.flashFrame){
            this.onflashMin()
        }
    }
    onDraw(){
        if(this.frame > this.flashFrame) return

        background(255, 255 * sin(PI / 2 + this.frame / this.flashFrame * PI / 2))
    }
}

//interface
class BulletHell {
    start(){
    }

    onTask(){
        
    }

    maxSeconds(){

    }

    remainSeconds(){
    }

    getProgress(){   
    }

    isEnded(){
    }
    
    isNull(){
    }
}

//BulletHell???????????????????????????
class BulletHellImpl extends BulletHell{
    constructor(activeFrame){
        super()
        this.activeFrame = activeFrame
        this.remainFrame = 0
        this.frame = 0

        this.marginFrame = 60
    }

    maxSeconds(){
        return int(this.activeFrame / 60)
    }

    start(){
        this.remainFrame = this.activeFrame
        this.frame = 0
    }

    onTask(){
        this.frame++

        if(this.frame < this.marginFrame) return

        if(this.remainFrame > 0) this._onBulletHellTask()

        this.remainFrame--
    }

    remainSeconds(){
        return int(this.remainFrame / 60)
    }

    getProgress(){
        return min(1, 1 - this.remainFrame / this.activeFrame)
    }

    isEnded(){
        return this.remainFrame <= -this.marginFrame
    }

    isNull(){
        return false
    }
}

class NullBulletHell extends BulletHell{
    constructor(){
        super()
    }

    start(){
    }

    onTask(){
        
    }

    maxSeconds(){
        return 0
    }

    remainSeconds(){
        return 0
    }

    getProgress(){
        return 0
    }

    isEnded(){
        return false
    }
    
    isNull(){
        return true
    }
}

class BulletHell1 extends BulletHellImpl{
    constructor(){
        super(500)
    }

    _onBulletHellTask(){
        if(this.frame % 30 == 0){
            for (let angle = this.frame; angle < this.frame + TAU; angle += PI / 5) {
                let bullet = new Bullet()
                bullet.angle = angle; bullet.speed = 2; bullet.size = 20;
                bullet.x = stgAreaWidth / 2 
                bullet.y = stgAreaHeight / 2
                bulletList.push(bullet)
            }
        }

        if(this.frame % 40 == 0){
            for (let angle = this.frame; angle < this.frame + TAU; angle += PI / 10) {
                let bullet = new Bullet()
                bullet.angle = angle; bullet.speed = 5; bullet.size = 5;
                bullet.x = stgAreaWidth / 2 
                bullet.y = stgAreaHeight / 2
                bulletList.push(bullet)
            }
        }
    }
}

class BulletHell2 extends BulletHellImpl{
    constructor(){
        super(500)
    }

    _onBulletHellTask(){
        if(this.frame % 80 == 0){
            for (let angle = this.frame; angle < this.frame + TAU; angle += PI / 6) {
                let bullet = new Bullet()
                bullet.angle = angle; bullet.speed = 5; bullet.size = 40;
                bullet.x = stgAreaWidth / 2 
                bullet.y = stgAreaHeight / 2
                bulletList.push(bullet)
            }
        }

        if(this.frame % 50 == 0){
            for (let angle = this.frame; angle < this.frame + TAU; angle += PI / 10) {
                let bullet = new Bullet()
                bullet.angle = angle; bullet.speed = 2; bullet.size = 5;
                bullet.x = stgAreaWidth / 2 
                bullet.y = stgAreaHeight / 2
                bulletList.push(bullet)
            }
        }
    }
}

class LinearBulletHellScheduler{
    constructor(){
        this.bulletHellList = [
            () => {return new NullBulletHell},
            () => {return new BulletHell1},
            () => {return new BulletHell2}
        ]

        this.maxAttackAmount = 2
    }

    nextBulletHell(){
        if(this.bulletHellList.length == 0) return new NullBulletHell()

        let createFunc = this.bulletHellList.pop()

        return createFunc()
    }

    getProgress(){
        return 1 - this.bulletHellList.length / this.maxAttackAmount
    }
}

let player

let keyMap = new Map()
let bulletList = []

let frame = 0

let restartRequired = false
let allowAttack = true

const toWhiteEffect = new ToWhiteEffect()
const toBlackEffect = new ToBlackEffect()

let bulletHell
let bulletHellScheduler

function setup() {
    createCanvas(stgAreaWidth + progressGaugeAreaWidth + messageAreaWidth, stgAreaHeight)
    bulletHellScheduler = new LinearBulletHellScheduler()
    bulletHell = bulletHellScheduler.nextBulletHell()
    restart()
}

function draw() {
    doTask()
    render()
}

function doTask(){
    player.onTask()

    if(bulletHell.isNull() && !restartRequired){
        restartRequired = true
        toWhiteEffect.start(() => {
            bulletHellScheduler = new LinearBulletHellScheduler()
            bulletHell = bulletHellScheduler.nextBulletHell()
            restart()
        })
    }

    if(player.isDead() && !restartRequired){
        restartRequired = true

        toWhiteEffect.start(() => {
            restart()
        })
    }

    bulletList.forEach((a, b, c) =>{a.move()})

    if(player.x < 0) player.x = 0
    if(player.y < 0) player.y = 0
    if(player.x > stgAreaWidth) player.x = stgAreaWidth
    if(player.y > stgAreaHeight) player.y = stgAreaHeight

    bulletList = bulletList.filter((a, b, c) => {
        return (a.x > -bulletLiveWidthMargin && (stgAreaWidth + bulletLiveWidthMargin) > a.x) &&
                (a.y > -bulletLiveHeightMargin && (stgAreaHeight + bulletLiveHeightMargin) > a.y)
    })

    let hitBullet = bulletList.filter((a, b, c) => {
        let sizeAve = a.size / 2 + player.size / 2
        return dist(a.x, a.y, player.x, player.y) < sizeAve
    })

    if(hitBullet.length > 0){
        player.hit()
    }

    if(allowAttack) {
        if(!bulletHell.isEnded()){
            bulletHell.onTask()
        } else {
            bulletHell = bulletHellScheduler.nextBulletHell()
            bulletHell.start()
        }
    }

    toWhiteEffect.onTask()
    toBlackEffect.onTask()

    frame++
}

function render(){
    background(0)

    player.onDraw()
    bulletList.forEach((a, b, c) =>{a.onDraw()})

    //????????????
    push()
    fill(255)
    stroke(255)
    textSize(20)
    text(bulletHell.remainSeconds(), stgAreaWidth - 25, 25)    
    pop()

    toWhiteEffect.onDraw()
    toBlackEffect.onDraw()

    //?????????????????????
    push()
    stroke(255)
    fill(0)
    rect(stgAreaWidth, 0, progressGaugeAreaWidth, height)
    strokeWeight(5)
    line(stgAreaWidth + progressGaugeAreaWidth / 2, height / 20, 
        stgAreaWidth + progressGaugeAreaWidth / 2, height - height / 20)
    const hellProgressHeight = (1 - bulletHell.getProgress()) * height * 9 / 10  + height / 20
    const scheduleProgressHeight = (1 - bulletHellScheduler.getProgress()) * height * 9 / 10  + height / 20
    stroke(255, 0, 0)
    line(stgAreaWidth + progressGaugeAreaWidth / 10, hellProgressHeight,
        stgAreaWidth + progressGaugeAreaWidth - progressGaugeAreaWidth / 10, hellProgressHeight)
    stroke(255, 255, 0)
    line(stgAreaWidth + progressGaugeAreaWidth / 10, scheduleProgressHeight,
        stgAreaWidth + progressGaugeAreaWidth - progressGaugeAreaWidth / 10, scheduleProgressHeight)
    pop()

    //????????????????????????
    push()
    stroke(255)
    fill(0)
    rect(stgAreaWidth + progressGaugeAreaWidth, 0, messageAreaWidth, height)
    textSize(20)
    fill(255)
    const messages = [
        "????????????",
        "????????????????????????????????????",
        "???????????????",
        "??????????????? (????????????)???????????????????????????"
    ]
    for (let index = 0; index < messages.length; index++) {
        const element = messages[index];
        text(element, stgAreaWidth + progressGaugeAreaWidth, 25 * (index + 1))    
    }
    pop()
}

function restart(){
    player = new Player()
    player.x = stgAreaWidth / 2
    player.y = stgAreaHeight * 9 / 10

    keyMap.set(UP_ARROW, false)
    keyMap.set(DOWN_ARROW, false)
    keyMap.set(LEFT_ARROW, false)
    keyMap.set(RIGHT_ARROW, false)

    restartRequired = false
    allowAttack = false

    frame = 0

    bulletList = []

    toBlackEffect.start(()=>{allowAttack = true})

    bulletHell.start()
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
