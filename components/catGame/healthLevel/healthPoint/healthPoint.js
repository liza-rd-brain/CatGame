function HealthPoint() {

}

let hpprt = HealthPoint.prototype
hpprt.CLASS_NAME = "healthPoint"

hpprt.render = function () {
    let healthPointEl = document.createElement("div")
    healthPointEl.className = this.CLASS_NAME

    return healthPointEl
}



hpprt = null