//////////////////////////////////////////////////////////////////////////////////////////
// 
// SET UP CLASSES: Car, Path, Fleet
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// CAR

var Car = function () {

  this.currentPath = null;

// Create DOM element 
  this.element = document.createElement("IMG");
  this.element.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png";
  this.element.classList.add("car");
  this.element.id = 'car1';
  mapContainer.appendChild(this.element);

 // Set functions: draw, rotate
  this.draw = function () {
    //this.element.style.left = x + "px";
    //this.element.style.top = y + "px";

    this.element.style.left = this.currentPath.x2 + "px";
    this.element.style.top = this.currentPath.y2 + "px";

  };

  this.rotate = function (value) { this.element.style.transform = "rotate(" + value + "deg)"; }
  

  
  this.setPath = function(path) {
      if (this.currentPath != null) { this.currentPath.clearCurrentCar();}
      this.currentPath = path;
      path.currentCar = this;
  }

  this.nextStep = function() {
    if(this.currentPath != null) {
      if(this.currentPath.nextPathOptions.length > 0) {
        if(this.currentPath.nextPathOptions[0].currentCar === null) {
          this.setPath(this.currentPath.nextPathOptions[0]);
          this.draw();
        }
      }
    }
  }
};

//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH

var Path = function (name, x1, y1, x2, y2, types, nextPathOptions) {
// Set initial values
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.types = types;
  this.nextPathOptions = nextPathOptions;
  this.currentCar = null;
  this.name = name;


// Types: Dropoff, Parking spot, Start, End, RightTurn, LeftTurn, ...
  
// Draw function
  this.draw = function() {
    var ctx = pathsCanvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x1, y1, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x2, y2, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    ctx.fillText(name + "-> 9 + 7"  , x1, y1-10);
    ctx.fillText("11|3.6|2.4",x1, y1+20)
    //ctx.fillText("");

  }
  this.clearCurrentCar = function() {
    this.currentCar = null;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
// 
// SET UP ACTUAL INSTANCES
//
//////////////////////////////////////////////////////////////////////////////////////////


//var map = new Map();
var mapContainer = document.getElementById("container");
var pathsCanvas = document.getElementById("pathsCanvas");

var paths = [];
var previousPath;
for (var i = 0; i<20; i++){
  paths.push(new Path(i, i*50,70, (i+1)*50, 70, new Array(), new Array()));
  paths[i].draw();
  if(i>0) {  paths[i-1].nextPathOptions.push(paths[i]);}
}
//var path = new Path(10, 10, 100, 100);
//path.draw();


var carFleet = [];
var numberOfCars = document.getElementById("sliderAmountOfCars").value;
for (var i = 0; i<numberOfCars; i++){
  carFleet.push(new Car());
  if(i < paths.length-1) {carFleet[i].setPath(paths[i]);}
  else {carFleet[i].setPath(paths[0]);}
  carFleet[i].draw();
}


function togglePaths() {
    pathsCanvas.hidden = !pathsCanvas.hidden;
}

function nextStep() {
  carFleet.forEach(function(elem){
    elem.nextStep()
    })
}

let elementsArray = document.querySelectorAll(".slider");

elementsArray.forEach(function(elem) {
    elem.addEventListener("input", function() {
        this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #C6C6C6 ' + this.value + '%, #C6C6C6 100%)'
    });
});

//////////////////////////////////////////////////////////////////////////////////////////
// 
// OLD CODE -- TO BE MERGED ABOVE AND THEN DELETED
//
//////////////////////////////////////////////////////////////////////////////////////////

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

 
  