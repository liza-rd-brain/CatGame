function Cat() {
    this.catEl = null
    this.bodyCat = null
    

}

let cprt = Cat.prototype
cprt.CLASS_NAME = "cat"

cprt.render = function () {
    this.catEl = document.createElement("div")
    this.catEl.className = this.CLASS_NAME
   /*  //экспериментальная отрисовка котика
    this.bodyCat = document.createElement("div")
    this.bodyCat.className = "bodyCat"
    this.catEl.appendChild(this.bodyCat) */


    return this.catEl
}








cprt = null



 /* let headCat = document.createElement("div")
    headCat.className = "headCat"
    catEl.appendChild(headCat)

    let tailCat = document.createElement("div")
    tailCat.className = "tailCat"
    catEl.appendChild(tailCat)

    let pawCat = document.createElement("div")
    pawCat.className = "pawCat"
    catEl.appendChild(pawCat)

    let earCat = document.createElement("div")
    earCat.className = "earCat"
    catEl.appendChild(earCat)

    let eyeCat = document.createElement("div")
    eyeCat.className = "eyeCat"
    catEl.appendChild(eyeCat)

    let smileCat = document.createElement("div")
    smileCat.className = "smileCat"
    catEl.appendChild(smileCat) */