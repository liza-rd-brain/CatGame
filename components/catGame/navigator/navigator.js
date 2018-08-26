function Navigator(changeCoord) {
    this.changeCoord = changeCoord
}

let nprt = Navigator.prototype
nprt.CLASS_NAME = "navigator"

nprt.UP = "up"
nprt.DOWN = "down"

nprt.render = function () {
    let navigatorEl = document.createElement("div")
    navigatorEl.className = this.className

    let arrowUpEl = new Arrow(this.changeCoord, this.UP).render()
    navigatorEl.appendChild(arrowUpEl)

    let arrowDownEl = new Arrow(this.changeCoord, this.DOWN).render()
    navigatorEl.appendChild(arrowDownEl)


    return navigatorEl
}



nprt = null