function HealthLevel(levelCount) {
    this.levelCount = levelCount
}

let hlprt = HealthLevel.prototype
hlprt.CLASS_NAME = "healthLevel"

hlprt.render = function () {
    let healthLevelEl = document.createElement("div")
    healthLevelEl.className = this.CLASS_NAME
    
    for (i = 1; i <= this.levelCount; i++) {
        let healthPointEl = new HealthPoint().render()
        healthLevelEl.appendChild(healthPointEl)
    }

    return healthLevelEl

}



hlprt = null