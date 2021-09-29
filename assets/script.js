var button = document.getElementById("btn");
var excuseArr = ["We played nano blade into 6 man!", "I charged them off the map!", "We wanted to practice different comps!", "We weren't on main roles!"]


var displayExcuse = function() {
    var excuseEl = document.querySelector("#excuse");
    excuseEl.textContent = "";
    var random = Math.floor(Math.random() * (excuseArr.length));
    excuseEl.textContent = excuseArr[random];
    console.log(random)
}

button.addEventListener("click", () => displayExcuse());