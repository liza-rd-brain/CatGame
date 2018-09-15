function Layers(topCoord, middleCoord, bottomCoord) {
    this.topCoord = topCoord
    this.middleCoord = middleCoord
    this.bottomCoord = bottomCoord

}
let lsprt = Layers.prototype
lsprt.CLASS_NAME = "layers"



lsprt.render = function () {
    let layersEl = document.createElement("div")
    layersEl.className = this.CLASS_NAME

    let topLineEl = new Line( this.topCoord).render()
    layersEl.appendChild(topLineEl)
    let middleLineEl = new Line(this.middleCoord).render()
    layersEl.appendChild(middleLineEl)
    let bottomLineEl = new Line(this.bottomCoord).render()
    layersEl.appendChild(bottomLineEl)



    return layersEl
}

lsprt = null