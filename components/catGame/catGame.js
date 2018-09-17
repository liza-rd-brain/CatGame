function CatGame(container) {
    this.container = container
    this.catEl = null
    this.layersEl = null
    this.barrierEl = null
    this.healthLevelEl = null
    //начальный уровень  0 - точка траснформации   
    this.timerCollision = null

    this.curentLevel = 0
    // количество жизней
    this.levelCount = 3
    this.topCoord = "183px"
    this.middleCoord = "283px"
    this.bottomCoord = "383px"
    this.jumpUp = this.jumpUp.bind(this)
    this.jumpDown = this.jumpDown.bind(this)
    this.takeTheLevel = this.takeTheLevel.bind(this)
    this.smash = this.smash.bind(this)
    this.deleteHealthPoint = this.deleteHealthPoint.bind(this)
    this.goGame = this.goGame.bind(this)
    this.stopCheckCollison = this.stopCheckCollison.bind(this)
    this.barrierMove = this.barrierMove.bind(this)
    this.barrierDelete = this.barrierDelete.bind(this)
    this.barrierSelectLevel = this.barrierSelectLevel.bind(this)


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

    this.healthLevelEl = new HealthLevel(this.levelCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)

    this.goGame()


}


// из метода goGame мы будем управлять течением игры
cgprt.goGame = function () {
    // игра начинается= барьер двигается, только если у нас еще есть жизни
    if (this.levelCount > 0) {
        //барьер будет с каждым экраном перерисовываться
        this.barrierEl = new Barrier(this.topCoord, this.middleCoord, this.bottomCoord).render()
        this.catGameEl.appendChild(this.barrierEl)

        //выбираем рандомное расположение барьера
        this.barrierSelectLevel()
        //прибавляем 500 ms, чтобы успеть экрану обновиться
        setTimeout(this.barrierMove, 500)
    }
    //зацикливаем вызов игры
    //тоже потом очистим, когда красиво остановим игру
    setTimeout(this.goGame, 4600)

}

cgprt.barrierSelectLevel = function () {

    //решаем какой уровень займет барьер

    let randomLevel = Math.floor(Math.random() * 3)
    switch (randomLevel) {
        case 0:
            this.barrierEl.classList.add("barrierOne")
            // придумаем св-во типа линия движения, в него будем отдавать верхнюю, среднюю, нижнюю линию
            // для большого количества препятствий, вероятно, проще будет заочно расчертить на невидимые промежутки-лиинии
            this.barrierEl.lineOfMotion = -2
            break

        case 1:
            this.barrierEl.classList.add("barrierTwo")
            this.barrierEl.lineOfMotion = 0
            break

        case 2:
            this.barrierEl.classList.add("barrierThree")
            this.barrierEl.lineOfMotion = 2
    }


}

cgprt.barrierMove = function () {
    // добавляем класс с анимацией
    this.barrierEl.classList.add("barrierMove")
    // говорим насколько сдвинуться барьеру
    // это тоже как-то перенестив рандомный решатель
    this.barrierEl.style.transform = `translateX(${-610}px)`

    // игра началась, запустили таймер на проверку столкновения через 1.5 секунды
    // он будет работать примерно одну секунду(может и поменьше)
    setTimeout(this.smash, 1500)

    // по окончании одного экрана удаляем элемент
    setTimeout(this.barrierDelete, 4000)
}

cgprt.barrierDelete = function () {
    this.catGameEl.removeChild(this.barrierEl)
}

cgprt.stopCheckCollison = function () {
    clearInterval(this.timerCollision)
}



cgprt.smash = function () {
    // зацикливаем таймер проверки на столкновение
    this.timerCollision = setTimeout(this.smash, 250)



    if (this.curentLevel == this.barrierEl.lineOfMotion) {
        console.log('бум')
        this.deleteHealthPoint()

        // если столкновение произошло,  очистим таймер ожидания столкновения сразу
        this.stopCheckCollison()
        /* this.barrierEl.classList.add("barrierMoveDalay")
        this.barrierEl.style.transform = `translateX(${-610}px)` */
        // этот таймер нужно очистить
    }
    //если столкновение не произошло, то мы очистим таймер через 600ms
    else (setTimeout(this.stopCheckCollison, 500))


}
cgprt.deleteHealthPoint = function () {
    this.levelCount -= 1
    this.catGameEl.removeChild(this.healthLevelEl)
    this.healthLevelEl = new HealthLevel(this.levelCount).render()
    this.catGameEl.appendChild(this.healthLevelEl)


}



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
// нужно ли потом очистить таймер setTimeout?!




// кот носом врезался в препятствие
/* cgprt.checkCollision = function () {

    if (this.curentLevel != -1) {
        console.log('бум')
    }
} */





cgprt = null