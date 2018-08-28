function Arrow(direction) {
    this.direction = direction
}

let aprt = Arrow.prototype
aprt.CLASS_NAME = "arrow"


aprt.render = function () {
    let ArrowEl = document.createElement("button")
    ArrowEl.type = "button"
    ArrowEl.innerHTML = this.direction
    
    return ArrowEl
}


aprt = null
