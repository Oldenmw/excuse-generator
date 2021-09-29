var button = document.getElementById("btn");
var excuseArr = ["We played nano blade into 6 man!", "I charged them off the map!", "We wanted to practice different comps!", "We weren't on main roles!"]
var previousExcuse = excuseArr.length + 1;

var displayExcuse = function(index) {
    var excuseEl = document.querySelector("#excuse");
    excuseEl.textContent = "";
    excuseEl.textContent = excuseArr[index];
}
var randomExcuse = function() {
    var random = Math.floor(Math.random() * (excuseArr.length));
    if (random === previousExcuse) {
        randomExcuse();
    } else {
        previousExcuse = random;
        displayExcuse(random);
    }
}

button.addEventListener("click", () => randomExcuse());