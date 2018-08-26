function CatGame(container) {
    this.container = container
    //нужно занулить  cat и layer , но зачем?!
    // чтобы не отдавать компонент верхнего уровня вниз для аппендчайлда
    //но почему занулять!??!?
    this.catEl = null
    this.layersEl = null
    this.y = 200
    this.step = null
    //измеряется в пикселах
    this.yCoord = "200px"

    this.topCoord = "183px"
    this.middleCoord = "283px"
    this.bottomCoord = "383px"

    this.jump = this.jump.bind(this)
    this.reJump = this.reJump.bind(this)
    this.changeCoord = this.changeCoord.bind(this)



}

let cgprt = CatGame.prototype
cgprt.CLASS_NAME = "catGame"

cgprt.render = function () {
    this.catGameEl = document.createElement("div")
    this.catGameEl.className = this.CLASS_NAME
    this.container.appendChild(this.catGameEl)

    this.catEl = new Cat().render()
    this.catGameEl.appendChild(this.catEl)

    this.layersEl = new Layers(this.topCoord, this.middleCoord, this.bottomCoord).render()
    this.catGameEl.appendChild(this.layersEl)

    this.navigatorEl = new Navigator(this.changeCoord).render()
    this.catGameEl.appendChild(this.navigatorEl)
}

cgprt.changeCoord = function (event) {


    if (event.target.data == Navigator.prototype.UP) {
        this.catEl.style.transform = `translateY(${-100}px)`
    }
    else {
        this.catEl.style.transform = "translateY(0px)"
    }

    /* //получаем текущее значение y
    // this.yCoord = getComputedStyle(this.catEl).top

    // числовое значение y без px
    // this.y = +(this.yCoord.slice(0, -2))

    //решаем прыгаем вверх или вниз
    if (event.target.data == Navigator.prototype.UP) {
        const top = this.catEl.style.top = (this.y -= 100) + 'px';
        this.catEl.style.top = top;
        console.info(top);

        this.jump()
    }
    else {
        this.reJump()
    } */
}



cgprt.jump = function () {
    // если котик уже на верхнем уровне
    //то он прыгает вверх и падает вниз
    if (this.yCoord < this.topCoord) {
        setTimeout(this.reJump, 200)
    }
    /*  else {
         this.catEl.style.transition = " top 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
     } */
}

// если котик и так уже на нижнем уровне
// ниже он уже не прыгнет
cgprt.reJump = function () {
    if (this.yCoord > this.middleCoord) {

    }
    else {
        this.yCoord = (this.y += 100) + 'px'
        console.info(this.yCoord);
        this.catEl.style.top = this.yCoord
    }

}



/* //элемент просто ходит вверх вниз  через transform
    if (event.target.data == Navigator.prototype.UP) {
        this.catEl.style.transform = "translateY(-100px)"
    }
    else {
        this.catEl.style.transform = "translateY(0px)"
    }
 */



cgprt = null