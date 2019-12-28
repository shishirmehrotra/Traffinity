//////////////////////////////////////////////////////////////////////////////////////////
// 
// SET UP CLASSES: Car, Path, Fleet
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// CAR

var Car = function (x, y) {
// Set initial position
  this.x = x;
  this.y = y;

// Create DOM element 
  this.element = document.createElement("IMG");
  this.element.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png";
  this.element.classList.add("car");
  this.element.id = 'car1';
  mapContainer.appendChild(this.element);

// Set functions: draw, rotate
  this.draw = function () {
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
  };

  this.rotate = function (value) { this.element.style.transform = "rotate(" + value + "deg)"; }
};

//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH

var Path = function (x1, y1, x2, y2, types) {
// Set initial values
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.types = types;



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
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x2, y2, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
  }

};


//////////////////////////////////////////////////////////////////////////////////////////
// 
// SET UP ACTUAL INSTANCES
//
//////////////////////////////////////////////////////////////////////////////////////////

//var map = new Map();
var mapContainer = document.getElementById("container");
var pathsCanvas = document.getElementById("pathsCanvas");

var paths = [];
for (var i = 0; i<20; i++){
  paths.push(new Path(i*50,50, (i+1)*50, 50));
  paths[i].draw();
}

//var path = new Path(10, 10, 100, 100);
//path.draw();


var carFleet = [];
for (var i = 0; i<20; i++){
  carFleet.push(new Car(i*50,50));
  carFleet[i].draw();
}


function togglePaths() {
    pathsCanvas.hidden = !pathsCanvas.hidden;
}

//////////////////////////////////////////////////////////////////////////////////////////
// 
// OLD CODE -- TO BE MERGED ABOVE AND THEN DELETED
//
//////////////////////////////////////////////////////////////////////////////////////////


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
