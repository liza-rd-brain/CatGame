function Cat() { }

let cprt = Cat.prototype
cprt.CLASS_NAME = "cat"

cprt.render = function () {
   let catEl = document.createElement("div")
    catEl.className = this.CLASS_NAME
    
    return catEl
}

cprt = null
