function Navigator(jumpUp, jumpDown) {
    this.jumpUp = jumpUp
    this.jumpDown = jumpDown
    
}

let nprt = Navigator.prototype
nprt.CLASS_NAME = "navigator"

nprt.UP = "up"
nprt.DOWN = "down"

nprt.render = function () {
    let navigatorEl = document.createElement("div")
    navigatorEl.className = this.className

    let arrowUpEl = new Arrow(this.UP).render()
    navigatorEl.appendChild(arrowUpEl)
    arrowUpEl.addEventListener("click", this.jumpUp)

    let arrowDownEl = new Arrow(this.DOWN).render()
    navigatorEl.appendChild(arrowDownEl)
    arrowDownEl.addEventListener("click", this.jumpDown)

    return navigatorEl
}

nprt = null