function Line(coord) {
    this.coord = coord

}
let lprt = Line.prototype
lprt.CLASS_NAME = "line"

lprt.render = function () {
    let lineEl = document.createElement("div")
    lineEl.style.top = this.coord
    lineEl.className = this.CLASS_NAME
    return lineEl
}

lprt = null