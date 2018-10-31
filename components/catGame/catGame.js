function CatGame(container) {
    this.container = container
    this.catEl = null
    this.layersEl = null
    this.healthLevelEl = null
    this.houseEl = null

    this.IsCatOnHouse = false
    this.attempcheckCatOnHouse = 0

    this.houseOne = null
    this.houseTwo = null

    this.curentLevel = 0
    this.idAnimation = 0
    this.healthCount = 3
    this.gameState = "goGame"
    this.numberOfBarriers = 0
    this.arrayOfBarriers = 0

    this.lastJumpTime = 0
    this.timeOfBeginningMovingTheBarrier = 0
    this.beginningOfTheGameTime = performance.now()
    this.timeBeginningMovingHome = 0

    this.jumpUp = this.jumpUp.bind(this)
    this.jumpDown = this.jumpDown.bind(this)
    this.smash = this.smash.bind(this)
    this.deleteHealthPoint = this.deleteHealthPoint.bind(this)
    this.goGame = this.goGame.bind(this)
    this.barrierMove = this.barrierMove.bind(this)

    this.barrierDelete = this.barrierDelete.bind(this)

    this.barrierSelectLevel = this.barrierSelectLevel.bind(this)
    this.barrierSelectLineOfMotion = this.barrierSelectLineOfMotion.bind(this)
    this.update = this.update.bind(this)
    this.fallAfterTheJumpUp = this.fallAfterTheJumpUp.bind(this)

    this.createBarriers = this.createBarriers.bind(this)
    this.createHouse = this.createHouse.bind(this)
    this.checkCatOnHouse = this.checkCatOnHouse.bind(this)

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
cgprt._timeOfMovingTheBarrier = 3000 * cgprt._multiplier
cgprt._timeOfBeginningCollision = 1400 * cgprt._multiplier
cgprt._timeOfEndingCollision = 1800 * cgprt._multiplier
cgprt._durationOfJumpUp = 200 * cgprt._multiplier
cgprt._durationOfJumpDown = 500 * cgprt._multiplier


cgprt._classOneHouse = "houseOneMove"
cgprt._classTwoHouse = "houseTwoMove"

/* cgprt._timeOfMovingHome = cgprt._timeOfMovingTheBarrier - 300 */

cgprt._levelTwo = "barrierLevelTwo"
cgprt._levelOne = "barrierLevelOne"
cgprt._levelZero = "barrierLevelZero"
cgprt._levelMinusOne = "barrierLevelMinusOne"
cgprt._levelMinusTwo = "barrierLevelMinusTwo"
cgprt._levelMinusThree = "barrierLevelMinusThree"

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

    this.houseOne = this.createHouse(this._classOneHouse)
    this.houseTwo = this.createHouse(this._classTwoHouse) 
    this.timeBeginningMovingHome = performance.now()

}
cgprt.createHouse = function (classHouse) {
    this.houseEl = new House().render()
    this.catGameEl.appendChild(this.houseEl)
    this.houseEl.classList.add(classHouse)
    console.log("houseMove")

}


cgprt.update = function () {
    this.idAnimation = requestAnimationFrame(this.update)

    switch (this.gameState) {
        //barrierMove должен стоять здесь, сначала задекларировать transition чтобы потом установить transform.translate  
        //чтобы кадр успел обновиться для анимации барьера,
        case "barrierMove":
            this.barrierMove()
            break
        case "goGame":
            this.goGame()
            break
        case "smash":
            this.smash()
            break
        case "barrierDelete":
            this.barrierDelete()
            break
    } 

    this.fallAfterTheJumpUp()
    this.checkCatOnHouse()


}

cgprt.checkCatOnHouse = function () {
    const hasA = this.timeBeginningMovingHome + 1900 + (3500 * this.attempcheckCatOnHouse)
    const someConditionA = performance.now() > hasA
    const hasB = this.timeBeginningMovingHome + 3500 + (3500 * this.attempcheckCatOnHouse)
    const someConditionB = performance.now() < hasB
    const someCondition = someConditionA && someConditionB

    if (someCondition) {
        this.IsCatOnHouse = true
    }
    else if (performance.now() > (this.timeBeginningMovingHome + 3500 + (3500 * this.attempcheckCatOnHouse))) {
        this.IsCatOnHouse = false
        this.attempcheckCatOnHouse++
    }

}


cgprt.goGame = function () {
    const hasHealth = this.healthCount > 0;
    if (hasHealth) {
        this.createBarriers()
        console.log("goGame")
        this.gameState = "barrierMove"
    }
    else {
        alert("GAME OVER")
        cancelAnimationFrame(this.idAnimation)
    }
}

cgprt.barrierMove = function () {
    for (let i = 0; i < this.numberOfBarriers; i++) {
        let barrierMove = this.arrayOfBarriers[i]
        barrierMove.classList.add("barrierMove")
        barrierMove.style.transitionDuration = `${this._timeOfMovingTheBarrier}ms`

        // это тоже как-то перенести в КОНСТАНТУ привязка к ширине экрана
        barrierMove.style.transform = `translateX(${-600}px)`
        this.timeOfBeginningMovingTheBarrier = performance.now()
        console.log("barrierMove")

    }
    this.gameState = "smash"
}

cgprt.smash = function () {

    if ((this._timeOfEndingCollision + this.timeOfBeginningMovingTheBarrier) > performance.now() &&
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
    if (performance.now() > this.timeOfBeginningMovingTheBarrier + this._timeOfMovingTheBarrier) {
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
    var arrayForSelect = [0, 1, 2, 3, 4, 5]
    this.arrayOfBarriers = new Array(this.numberOfBarriers)

    for (let i = 0; i < this.numberOfBarriers; i++) {
        this.arrayOfBarriers[i] = new Barrier().render()
        this.catGameEl.appendChild(this.arrayOfBarriers[i])
        var barrierEl = this.arrayOfBarriers[i]
        // Бить на три метода, выбрали рандомный уровень, соответственную ему линию движения и класс 
        // или тупо массив перебирать?!

        let lineOfMotion = this.barrierSelectLineOfMotion(arrayForSelect)
        this.arrayOfBarriers[i].lineOfMotion = lineOfMotion
        var randomLevel
        delete arrayForSelect[randomLevel]

        let level = this.barrierSelectLevel(lineOfMotion)
        barrierEl.classList.add(level)

    }
}

cgprt.barrierSelectLineOfMotion = function (arrayForSelect) {
    // мне нужно получить любой имеющийся элемент из массива this.arrayForSelect и избежать повторений
    /* var randomLevel = 0  */

    var randomLevel = false
    while (!randomLevel) {
        randomLevel = arrayForSelect[Math.floor(Math.random() * 6)]
        delete arrayForSelect[randomLevel]
    }

    switch (randomLevel) {
        case 0:
            return lineOfMotion = 2
        case 1:
            return lineOfMotion = 1
        case 2:
            return lineOfMotion = 0
        case 3:
            return lineOfMotion = -1
        case 4:
            return lineOfMotion = -2
        case 5:
            return lineOfMotion = -3
    }
}

cgprt.barrierSelectLevel = function () {
    switch (lineOfMotion) {
        case 2:
            return level = this._levelTwo
        case 1:
            return level = this._levelOne
        case 0:
            return level = this._levelZero
        case -1:
            return level = this._levelMinusOne
        case -2:
            return level = this._levelMinusTwo
        case - 3:
            return level = this._levelMinusThree
    }
}

cgprt.fallAfterTheJumpUp = function () {
    //если не занял уровень, то спрыгивает
    if (/* this.curentLevel !== -2 */!this.IsCatOnHouse && this.curentLevel !== 0 && this.curentLevel !== 2) {
        //спрыгивает спустя 600 мс
        if (this.lastJumpTime != 0 && (this.lastJumpTime + this._durationOfJumpDown) <= performance.now()) {
            // когда величина time (текущее время) достигнет this.lastJumpTime + 600)
            this.curentLevel += 1
            this.catEl.style.transitionDuration = `${this._durationOfJumpDown / 2}ms`
            this.catEl.style.transform = `translateY(${this.curentLevel * this.stepCatY}px)`
            this.timeForCoordChangeDown = performance.now()
            /* this.IsCatOnHouse = false */

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