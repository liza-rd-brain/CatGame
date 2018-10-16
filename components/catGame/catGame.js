function CatGame(container) {
    this.container = container
    this.catEl = null
    this.layersEl = null
    this.barrierEl = null
    this.healthLevelEl = null
    //начальный уровень  0 - точка траснформации   
    this.timerCollision = null
    // счетчик экранов, порядковый номер экрана
    this.screenCount = 0

    this.curentLevel = 0
    this.lastJumpTime = 0
    this.beginningOfTheGameTime = 0
    this.attemtCheckCollision = 1
    this.itIsNewScreen = false
    this.itIsNewBarrier = false
    // количество жизней
    this.levelCount = 3
    this.topCoord = "183px"
    this.middleCoord = "283px"
    this.bottomCoord = "383px"
    this.jumpUp = this.jumpUp.bind(this)
    this.jumpDown = this.jumpDown.bind(this)
    this.smash = this.smash.bind(this)
    this.deleteHealthPoint = this.deleteHealthPoint.bind(this)
    this.goGame = this.goGame.bind(this)
    /* this.stopCheckCollison = this.stopCheckCollison.bind(this) */
    this.barrierMove = this.barrierMove.bind(this)
    this.barrierDelete = this.barrierDelete.bind(this)
    this.barrierSelectLevel = this.barrierSelectLevel.bind(this)
    this.update = this.update.bind(this)
    this.fallAfterTheJumpUp = this.fallAfterTheJumpUp.bind(this)

    // объект будет создан с уже вложенным requestAnimationFrame
    // он будет постоянно проверять изменения перед отрисовкой кадра
    requestAnimationFrame(this.update)
    this.timeOfBeginningMovingTheBarrier = 0


    this.catLeft = "200px"
    this.catWidth = "120px"
    this.barrierWidth = "8px"
    this.catHight = "50px"
    this.barrierHight = "30px"

    // время начала игры, не будет изменяться
    this.beginningOfTheGameTime = performance.now()
    this.idAnimation = 0


}

let cgprt = CatGame.prototype
cgprt.CLASS_NAME = "catGame"

// шаг для прыжка котика
cgprt.stepY = 50
// константы координат


cgprt._multiplier = 1


//временные константы
cgprt._durationOfOneScreen = 4200 * cgprt._multiplier

// не понимаю, зачем нужна эта величина но без нее со второго экрана барьер просто сразу перемещается вконец..
// или уже не нужна
cgprt._timeToRefreshScreen = 0

cgprt._timeOfMovingTheBarrier = 4000 * cgprt._multiplier
cgprt._timeOfBeginningTheAreaOfCollision = 1800 * cgprt._multiplier
cgprt._timeOfEndingTheAreaOfCollision = 2200 * cgprt._multiplier
/* cgprt._intervalOfChekingTheCollision = 100 */
/* cgprt._durationOfChekingTheCollision = 400 */
cgprt._durationOfJumpUp = 200 * cgprt._multiplier
cgprt._durationOfJumpDown = 600 * cgprt._multiplier



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

    this.healthLevelEl = new HealthLevel(this.levelCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)


}


cgprt.update = function () {
    //зациклили вызов
    this.idAnimation = requestAnimationFrame(this.update)

    this.fallAfterTheJumpUp()

    this.barrierMove()
    this.goGame()
    this.smash()
    this.barrierDelete()

}


// из метода goGame мы будем управлять течением игры
cgprt.goGame = function () {
    // игра начинается= барьер двигается, только если у нас еще есть жизни
    if (this.levelCount > 0) {

        // если прошло время равное _durationOfOneScreen для данного номера счетчика экрана
        if (performance.now() > this.beginningOfTheGameTime + this._durationOfOneScreen * this.screenCount
            && this.itIsNewBarrier == false) {
            this.createBarrier()
            //выбираем рандомное расположение барьера
            this.barrierSelectLevel()
            // говорим, что это новый экран чтобы начать движение барьера
            this.itIsNewScreen = true
            this.itIsNewBarrier = true
            this.screenCount++
            console.log("goGame")
        }
    }
    else {
        // грамотно все очистить/застопить после окончания экрана
        alert("GAME OVER")
        cancelAnimationFrame(this.idAnimation)
    }
}


cgprt.barrierMove = function () {
    // если это новый экран, и прошел отрезок времени для обновленния экрана(пока не использую временной отрезок)
    if (this.itIsNewScreen) {

        // добавляем класс с анимацией
        this.barrierEl.classList.add("barrierMove")
        // сюда же вытащим время для движения барьера
        this.barrierEl.style.transitionDuration = `${this._timeOfMovingTheBarrier}ms`
        // это тоже как-то перенести в КОНСТАНТУ привязка к ширине экрана
        this.barrierEl.style.transform = `translateX(${-610}px)`


        this.timeOfBeginningMovingTheBarrier = performance.now()
        this.itIsNewScreen = false

        console.log("barrierMove")
    }
}



cgprt.smash = function () {
    var currentTime = performance.now()
    // здесь зададим промежуток времени проверки на коллизию
    // если это перая проверка, проведем ее через 1800 ms


    if (this.timeOfBeginningMovingTheBarrier != 0 &&
        (this._timeOfEndingTheAreaOfCollision + this.timeOfBeginningMovingTheBarrier)/*  * this.attemtCheckCollision */ > currentTime &&

        currentTime > (this.timeOfBeginningMovingTheBarrier + this._timeOfBeginningTheAreaOfCollision) /* * this.attemtCheckCollision */

        && this.attemtCheckCollision == this.screenCount && this.itIsNewScreen == false) {

        if (this.curentLevel == this.barrierEl.lineOfMotion) {
            /* console.log('бум') */
            this.deleteHealthPoint()

            this.attemtCheckCollision++
            //зануляем, чтобы не взять старое
            /* this.timeOfBeginningMovingTheBarrier = 0 */
            console.log("smash")
        }
    }
}




/* cgprt.stopCheckCollison = function () {
    clearInterval(this.timerCollision)
} */

//нужно сделать однократное удаление
cgprt.barrierDelete = function () {
    var newCount = performance.now()
    if (newCount > this.timeOfBeginningMovingTheBarrier + this._timeOfMovingTheBarrier
        && this.itIsNewBarrier == true && this.timeOfBeginningMovingTheBarrier != 0) {
        this.catGameEl.removeChild(this.barrierEl)
        this.itIsNewBarrier = false
        //16.10 занулила время начала движения барьера
        this.timeOfBeginningMovingTheBarrier = 0
        console.log("barrierDelete")
    }

}



cgprt.deleteHealthPoint = function () {
    this.levelCount -= 1
    this.catGameEl.removeChild(this.healthLevelEl)
    this.healthLevelEl = new HealthLevel(this.levelCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)


}

cgprt.createBarrier = function () {
    //барьер будет с каждым экраном перерисовываться
    this.barrierEl = new Barrier().render()
    this.catGameEl.appendChild(this.barrierEl)
}

cgprt.barrierSelectLevel = function () {
    /* let randomAmountBarrier = Math.floor(Math.random() * 4) */
    //решаем какой уровень займет барьер
    /*  let randomLevel = Math.floor(Math.random() * 6) */
    let randomLevel = 2

    switch (randomLevel) {
        case 0:
            this.barrierEl.classList.add("barrierLevelTwo")
            //т.к. экран все равно будет перерисовываться будем добавлять классы..
            this.barrierEl.lineOfMotion = 2
            break
        case 1:
            this.barrierEl.classList.add("barrierLevelOne")
            this.barrierEl.lineOfMotion = 1
            break
        case 2:
            this.barrierEl.classList.add("barrierLevelZero")
            this.barrierEl.lineOfMotion = 0
            break
        case 3:
            this.barrierEl.classList.add("barrierLevelMinusOne")
            this.barrierEl.lineOfMotion = -1
            break
        case 4:
            this.barrierEl.classList.add("barrierLevelMinusTwo")
            this.barrierEl.lineOfMotion = -2
            break
        case 5:
            this.barrierEl.classList.add("barrierLevelMinusThree")
            this.barrierEl.lineOfMotion = -3
            break
    }


}






//для каждой логики проверки вынести отдельный блок кода = отдельную функцию
cgprt.fallAfterTheJumpUp = function () {
    //если не занял уровень, то спрыгивает
    if (this.curentLevel !== -2 && this.curentLevel !== 0 && this.curentLevel !== 2) {
        //спрыгивает спустя 600 мс

        if (this.lastJumpTime != 0 && (this.lastJumpTime + 600) <= performance.now()) {
            // когда величина time (текущее время) достигнет this.lastJumpTime + 600)

            this.curentLevel += 1
            this.catEl.style.transitionDuration = `${this._durationOfJumpDown}ms`
            this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`
        }
    }
}



cgprt.jumpUp = function () {
    // не можем прыгнуть выше верхнего уровня
    if (this.curentLevel !== -4) {
        // уменьшаем уровень на 1
        this.curentLevel -= 1
        /* this.catEl.classList.add("jumpUp") */
        this.catEl.style.transitionDuration = `${this._durationOfJumpUp}ms`
        /* this.catEl.style.transitionDuration = `${this._durationOfJumpUp}ms` */
        this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`;
        this.lastJumpTime = performance.now()

    }
}


cgprt.jumpDown = function () {
    // не можем прыгнуть ниже нижнего уровня
    if (this.curentLevel !== 2) {
        this.curentLevel += 2
        this.catEl.style.transitionDuration = `${this._durationOfJumpDown}ms`
        this.catEl.style.transform = `translateY(${this.curentLevel * this.stepY}px)`
        /* //убрала 600 ms чтобы спрыгивание происходило сразу
        this.lastJumpTime = performance.now() - 600 */

    }

}



cgprt = null