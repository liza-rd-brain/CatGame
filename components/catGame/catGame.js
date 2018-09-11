function CatGame(container) {
    this.container = container
    this.catEl = null
    this.layersEl = null
    this.barrierEl = null
    //начальный уровень  0 - точка траснформации
    this.timeoutId = null
    this.curentLevel = 0
    this.topCoord = "183px"
    this.middleCoord = "283px"
    this.bottomCoord = "383px"
    this.jumpUp = this.jumpUp.bind(this)
    this.jumpDown = this.jumpDown.bind(this)
    this.takeTheLevel = this.takeTheLevel.bind(this)
    this.smash = this.smash.bind(this)
    /* this.moveBarrier = this.moveBarrier.bind(this) */
    this.checkCollision = this.checkCollision.bind(this)
    this.catLeft = "200px"
    this.catWidth = "120px"
    this.barrierWidth = "8px"
    this.catHight = "50px"
    this.barrierHight = "30px"


}

let cgprt = CatGame.prototype
cgprt.CLASS_NAME = "catGame"

cgprt.stepY = 50

cgprt.render = function () {
    this.catGameEl = document.createElement("div")
    this.catGameEl.className = this.CLASS_NAME
    this.container.appendChild(this.catGameEl)

    this.catEl = new Cat().render()
    this.catGameEl.appendChild(this.catEl)

    this.layersEl = new Layers(this.topCoord, this.middleCoord, this.bottomCoord).render()
    this.catGameEl.appendChild(this.layersEl)

    this.navigatorEl = new Navigator(this.jumpUp, this.jumpDown).render()
    this.catGameEl.appendChild(this.navigatorEl)

    this.barrierEl = new Barrier().render()
    this.catGameEl.appendChild(this.barrierEl)

    //задаю таймер для движения барьера
    // без таймера еще ничего не построиться и работать не будет
    /*  setTimeout(this.moveBarrier, 1000) */

    // таймер для проверки коллизии


    setInterval(this.checkCollision, 5000)


/*     this.moveBarrier()
 */}

cgprt.jumpUp = function () {
    if (this.curentLevel !== -4) {
        this.curentLevel -= 1
        this.catEl.classList.add("jumpUp")
        this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`;
        setTimeout(this.takeTheLevel, 600);
    }
}

cgprt.takeTheLevel = function () {
    if (this.curentLevel !== -2 && this.curentLevel !== 0) {
        setTimeout(this.jumpDown, 200);
    }
}

cgprt.jumpDown = function () {
    if (this.curentLevel !== 2) {
        if (this.curentLevel !== -4 && this.curentLevel !== -2 && this.curentLevel !== 0) {
            this.curentLevel += 1
            this.catEl.classList.add("jumpDown")
            this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`
        }
        else {
            this.curentLevel += 2
            this.catEl.classList.add("jumpDown")
            this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`
        }
    }
}


// проверяет столкновение с котом на период прохождения препятствия под котиком
// приходится играть со временем, чтобы добиться оптимального эффекта
// нужно ли потом очистить таймер setTimeout
cgprt.checkCollision = function () {
    //может быть id таймер вынести в конструктор
    //после столкновения нам его тоже можно сразу очистить?!
    var checkCollisionTimerID = setInterval(this.smash, 100)
    setTimeout(stopCollisionTimerID, 700)
    function stopCollisionTimerID() {
        clearInterval(checkCollisionTimerID), 1000
    }

    /*  setTimeout (clearInterval(checkCollisionTimerID), 1000) */


}

cgprt.smash = function () {

    if (this.curentLevel != -1) {
        console.log('бум')
    }
}



// кот носом врезался в препятствие
/* cgprt.checkCollision = function () {

    if (this.curentLevel != -1) {
        console.log('бум')
    }
} */


/*  let barrierLeft = getComputedStyle(this.barrierEl).left
 if (barrierLeft <= "290px" && barrierLeft >= "260px" && this.curentLevel == -1) {
     console.log("No collision")
 } */













cgprt = null