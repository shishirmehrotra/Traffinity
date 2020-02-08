
function handleConfigureClick(myRadio) {
  //alert('New value: ' + myRadio.value);
  if (myRadio.value === "Run") {
    document.getElementById("runPanels").hidden = false;
    document.getElementById("configurePanels").hidden = true;
  }
  if (myRadio.value === "Configure") {
    document.getElementById("runPanels").hidden = true;
    document.getElementById("configurePanels").hidden = false;
  }
}


function showPathNames() {
  if (document.getElementById("checkboxShowPathNames").checked === true) {
   pathNamesLayer.show();
  }
  else {
    pathNamesLayer.hide();
  }
};

  /*
  timer = window.clearTimeout()
  for (var i = 0; i < 2000; i++) {
    timer = window.setTimeout(nextStep, timeScale/30*i, 20);
  }
  */

/*
function moveDown(amount) {
  var car = document.getElementById("car1");
  car.style.top = parseFloat(getComputedStyle(car).top) + amount + "px";
}
function moveUp(amount) {
  var car = document.getElementById("car1");
  car.style.top = parseFloat(getComputedStyle(car).top) - amount + "px";
}
function moveLeft(amount) {
  var car = document.getElementById("car1");
  car.style.left = parseFloat(getComputedStyle(car).left) - amount + "px";
}
function moveRight(amount) {
  var car = document.getElementById("car1");
  car.style.left = parseFloat(getComputedStyle(car).left) + amount + "px";
}
function rotate(value) {
  var car = document.getElementById("car1");
  //car.classList.toggle("rotateUp");
  car.style.transform = "rotate(" + value + "deg)";
}

var rotateSlider = document.getElementById("rotateSlider");

rotateSlider.oninput = function () {
  //  console.log("rotate to " + rotateSlider.value);
  rotate(rotateSlider.value);
}


function moveDownPortola() {
  console.log("move down portola");
  // Get the car
  var car = document.getElementById("car1");

  // Start at (10, 120)
  car.style.top = "120px";
  car.style.left = "10px";

  // Then moveRight(20) 60 times
  var i;
  for (i = 0; i < 60; i++) {
    window.setTimeout(moveRight, 1000 / 60 * i, 20);
  }

}
*/
/*
let sliderArray = document.getElementByClass("slider");

sliderArray.forEach(function(elem) {
    elem.oninput = function() {
        this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #fff ' + this.value + '%, white 100%)'
    };
)}
*/


