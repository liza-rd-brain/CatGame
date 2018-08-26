function Arrow(changeCoord,direction) {
    this.changeCoord = changeCoord
    this.direction = direction
}

let aprt = Arrow.prototype
aprt.CLASS_NAME = "arrow"


aprt.render = function () {
    let ArrowEl = document.createElement("button")
    ArrowEl.type = "button"
    ArrowEl.innerHTML = this.direction
    ArrowEl.data = this.direction
    ArrowEl.addEventListener("click", this.changeCoord)

    return ArrowEl
}


aprt = null
