function CatGame(container) {
    this.container = container
    this.catEl = null
    this.layersEl = null
    this.barrierEl = null
    this.healthLevelEl = null

    this.screenCount = 0
    this.curentLevel = 0
    this.idAnimation = 0
    this.healthCount = 3
    this.gameState = "goGame"
    this.numberOfBarriers = 0
    this.arrayOfBarriers = 0
    this.arrayForSelect = 0

    this.lastJumpTime = 0
    /* this.beginningOfTheGameTime = 0 */
    this.timeOfBeginningMovingTheBarrier = 0
    this.beginningOfTheGameTime = performance.now()
    




    this.jumpUp = this.jumpUp.bind(this)
    this.jumpDown = this.jumpDown.bind(this)
    this.smash = this.smash.bind(this)
    this.deleteHealthPoint = this.deleteHealthPoint.bind(this)
    this.goGame = this.goGame.bind(this)
    this.barrierMove = this.barrierMove.bind(this)
    this.barrierDelete = this.barrierDelete.bind(this)
    this.barrierSelectLevel = this.barrierSelectLevel.bind(this)
    this.update = this.update.bind(this)
    this.fallAfterTheJumpUp = this.fallAfterTheJumpUp.bind(this)
    this.changeCoordUp = this.changeCoordUp.bind(this)
    this.changeCoordDown = this.changeCoordDown.bind(this)
    this.createBarriers = this.createBarriers.bind(this)

    requestAnimationFrame(this.update)

    this.topCoord = "183px"
    this.middleCoord = "283px"
    this.bottomCoord = "383px"
    this.catLeft = "200px"
    this.catWidth = "120px"
    this.barrierWidth = "8px"
    this.catHight = "50px"
    this.barrierHight = "30px"
    this.catCoordYBottom = 235
    this.catCoordYTop = this.catCoordYBottom + 50

    this.barrierCoordYBottom = 0
    this.barrierCoordYTop = 0
    this.timeForCoordChangeUp = 0
    this.timeForCoordChangeDown = 0
    this.catChangingCoordYBottom = 0
}

let cgprt = CatGame.prototype
cgprt.CLASS_NAME = "catGame"

cgprt.stepCatY = 50
cgprt._multiplier = 1

cgprt._durationOfOneScreen = 4200 * cgprt._multiplier
cgprt._timeOfMovingTheBarrier = 4000 * cgprt._multiplier
cgprt._timeOfBeginningCollision = 1800 * cgprt._multiplier
cgprt._timeOfEndingCollision = 2300 * cgprt._multiplier
cgprt._durationOfJumpUp = 200 * cgprt._multiplier
cgprt._durationOfJumpDown = 500 * cgprt._multiplier

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

    this.healthLevelEl = new HealthLevel(this.healthCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)
}


cgprt.update = function () {
    this.idAnimation = requestAnimationFrame(this.update)

    //barrierMove должен стоять здесь, сначала задекларировать transition чтобы потом установить transform.translate  
    //чтобы кадр успел обновиться для анимации барьера,

    this.barrierMove()
    this.goGame()
    this.smash()
    this.barrierDelete()

    this.fallAfterTheJumpUp()

    this.changeCoordUp()
    this.changeCoordDown()
}

cgprt.goGame = function () {
    if (this.healthCount > 0) {
        // если прошло время равное _durationOfOneScreen для данного номера счетчика экрана
        if (this.gameState === "goGame") {
            this.createBarriers()
            //делаем домик
            var houseEl = new House().render()
            this.catGameEl.appendChild(houseEl)

            this.screenCount++
            console.log("goGame")
            this.gameState = "barrierMove"
        }
    }
    else {
        alert("GAME OVER")
        cancelAnimationFrame(this.idAnimation)
    }
}

cgprt.barrierMove = function () {
    if (this.gameState == "barrierMove") {
        for (let i = 0; i < this.numberOfBarriers; i++) {

            this.arrayOfBarriers[i].classList.add("barrierMove")
            this.arrayOfBarriers[i].style.transitionDuration = `${this._timeOfMovingTheBarrier}ms`
            // это тоже как-то перенести в КОНСТАНТУ привязка к ширине экрана
            this.arrayOfBarriers[i].style.transform = `translateX(${-610}px)`
            this.timeOfBeginningMovingTheBarrier = performance.now()
            console.log("barrierMove")
        }
        this.gameState = "smash"
    }
}

cgprt.smash = function () {

    if (this.gameState == "smash" &&
        (this._timeOfEndingCollision + this.timeOfBeginningMovingTheBarrier) > performance.now() &&
        performance.now() > (this.timeOfBeginningMovingTheBarrier + this._timeOfBeginningCollision)
    ) {
        for (let i = 0; i < this.numberOfBarriers; i++) {
            if (this.curentLevel == this.arrayOfBarriers[i].lineOfMotion) {
                this.deleteHealthPoint()
                console.log("smash")
                break
            }
        }
        this.gameState = "barrierDelete"
    }
}

cgprt.barrierDelete = function () {
    if (performance.now() > this.timeOfBeginningMovingTheBarrier + this._timeOfMovingTheBarrier
        && this.gameState == "barrierDelete") {
        for (let i = 0; i < this.numberOfBarriers; i++) {
            this.catGameEl.removeChild(this.arrayOfBarriers[i])
            console.log("barrierDelete")
        }
        this.itIsNewBarrier = false
        this.gameState = "goGame"
    }
}

cgprt.deleteHealthPoint = function () {
    this.healthCount -= 1
    this.catGameEl.removeChild(this.healthLevelEl)
    this.healthLevelEl = new HealthLevel(this.healthCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)
}

cgprt.createBarriers = function () {
    this.numberOfBarriers = Math.floor(Math.random() * 4) + 1
    this.arrayForSelect = [0, 1, 2, 3, 4, 5]
    this.arrayOfBarriers = new Array(this.numberOfBarriers)

    for (let i = 0; i < this.numberOfBarriers; i++) {
        this.arrayOfBarriers[i] = new Barrier().render()
        this.catGameEl.appendChild(this.arrayOfBarriers[i])
        this.barrierEl = this.arrayOfBarriers[i]
        this.barrierSelectLevel()
        this.arrayOfBarriers[i].lineOfMotion = this.barrierEl.lineOfMotion
    }
}

cgprt.barrierSelectLevel = function () {
    // мне нужно получить любой имеющийся элемент из массива this.arrayForSelect и избежать повторений
    var randomLevel = false
    while (!randomLevel) {
        randomLevel = this.arrayForSelect[Math.floor(Math.random() * 6)]
        delete this.arrayForSelect[randomLevel]
    }

    switch (randomLevel) {
        case 0:
            this.barrierEl.classList.add("barrierLevelTwo")
            //т.к. экран все равно будет перерисовываться будем добавлять классы..
            this.barrierEl.lineOfMotion = 2
            this.barrierCoordYBottom = 335
            this.barrierCoordYTop = 385
            break
        case 1:
            this.barrierEl.classList.add("barrierLevelOne")
            this.barrierEl.lineOfMotion = 1
            this.barrierCoordYBottom = 285
            this.barrierCoordYTop = 335
            break
        case 2:
            this.barrierEl.classList.add("barrierLevelZero")
            this.barrierEl.lineOfMotion = 0
            this.barrierCoordYBottom = 235
            this.barrierCoordYTop = 285
            break
        case 3:
            this.barrierEl.classList.add("barrierLevelMinusOne")
            this.barrierEl.lineOfMotion = -1
            this.barrierCoordYBottom = 185
            this.barrierCoordYTop = 235
            break
        case 4:
            this.barrierEl.classList.add("barrierLevelMinusTwo")
            this.barrierEl.lineOfMotion = -2
            this.barrierCoordYBottom = 135
            this.barrierCoordYTop = 185
            break
        case 5:
            this.barrierEl.classList.add("barrierLevelMinusThree")
            this.barrierEl.lineOfMotion = -3
            this.barrierCoordYBottom = 85
            this.barrierCoordYTop = 135
            break
    }

}

cgprt.changeCoordUp = function () {
    if (this.timeForCoordChangeUp != 0 && (performance.now() - this.timeForCoordChangeUp) <= this._durationOfJumpUp
        /* && catChangingCoordYBottom <= this.catCoordYBottom - 5 */
    ) {
        this.catChangingCoordYBottom += 5
        console.log(this.catChangingCoordYBottom)
    }
    else {
        this.catCoordYBottom = this.catChangingCoordYBottom
    }
}


cgprt.changeCoordDown = function () {
    if (this.timeForCoordChangeDown != 0 && (performance.now() - this.timeForCoordChangeDown) <= this._durationOfJumpDown / 2
        && this.catCoordYBottom >= 240
    ) {
        this.catCoordYBottom -= 5
        console.log(this.catCoordYBottom)
    }
}

cgprt.fallAfterTheJumpUp = function () {
    //если не занял уровень, то спрыгивает
    if (this.curentLevel !== -2 && this.curentLevel !== 0 && this.curentLevel !== 2) {
        //спрыгивает спустя 600 мс
        if (this.lastJumpTime != 0 && (this.lastJumpTime + this._durationOfJumpDown) <= performance.now()) {
            // когда величина time (текущее время) достигнет this.lastJumpTime + 600)
            this.curentLevel += 1
            this.catEl.style.transitionDuration = `${this._durationOfJumpDown / 2}ms`
            this.catEl.style.transform = `translateY(${this.curentLevel * this.stepCatY}px)`
            this.timeForCoordChangeDown = performance.now()
        }
    }
}

cgprt.jumpUp = function () {
    // не можем прыгнуть выше верхнего уровня
    if (this.curentLevel !== -4) {
        this.curentLevel -= 1
        this.catEl.style.transitionDuration = `${this._durationOfJumpUp}ms`
        this.catEl.style.transform = `translateY(${this.curentLevel * this.stepCatY}px)`;
        this.lastJumpTime = performance.now()
        this.timeForCoordChangeUp = performance.now()
        this.catChangingCoordYBottom = this.catCoordYBottom
    }
}

cgprt.jumpDown = function () {
    // не можем прыгнуть ниже нижнего уровня
    if (this.curentLevel !== 2) {
        this.curentLevel += 2
        // мысль сделать переменную изменение уровня котика и закинуть ее в RAF!
        this.catEl.style.transitionDuration = `${this._durationOfJumpDown}ms`
        this.catEl.style.transform = `translateY(${this.curentLevel * this.stepCatY}px)`
    }
}

cgprt = null