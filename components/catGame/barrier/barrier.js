function Barrier() { }

let bprt = Barrier.prototype
bprt.CLASS_NAME = "barrier"

bprt.render = function () {
    let barrierEl = document.createElement("div")
    barrierEl.className = this.CLASS_NAME
    return barrierEl
}

cprt = null