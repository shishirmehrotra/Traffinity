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
  car.style.transform = "rotate("+value+"deg)";
}
      
var rotateSlider = document.getElementById("rotateSlider");

rotateSlider.oninput = function() {
  console.log("rotate to " + rotateSlider.value);
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
  for(i=0; i<60; i++) {
    window.setTimeout(moveRight, 1000/60 * i, 20);
  }
  
}


var Car = function(x, y){
  // Set initial position
  this.x = x;
  this.y = y;
  
  // Create DOM element
  var newElement = document.createElement("IMG");   
  newElement.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png"; 
  document.body.appendChild(newElement);               
  newElement.classList.add("car");
  this.element = newElement; 

  // Setup functions
  this.draw = function() {
    this.element.style.top  = x +"px";
    this.element.style.left = y + "px"; 
  };

  this.rotate = function(value) { this.element.style.transform = "rotate("+value+"deg)";}
};

var newCar = new Car(100, 100);
newCar.draw();
newCar.rotate(30);



