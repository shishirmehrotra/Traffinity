//////////////////////////////////////////////////////////////////////////////////////////
// 
// SET UP CLASSES: Car, Path, Fleet
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// CAR

var Car = function (id) {

  this.currentPath = null;
  this.id = id;

  // Create DOM element 
  this.element = document.createElement("IMG");
  this.element.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png";
  this.element.classList.add("car");
  this.element.id = 'car' + id;
  mapContainer.appendChild(this.element);

  // Set functions: draw, rotate
  this.draw = function () {
    this.element.style.left = this.currentPath.x2 + "px";
    this.element.style.top = this.currentPath.y2 + "px";
    this.element.style.transform = "rotate(" + this.currentPath.rotation + "deg)";
  };

  this.rotate = function (value) { this.element.style.transform = "rotate(" + value + "deg)"; }



  this.setPath = function (path) {
    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); }
    this.currentPath = path;
    path.currentCar = this;
  this.currentPath.arrow.stroke('white');
  pathsLayer.draw();
  }

  this.nextStep = function () {
    // TODO select from openTransitions
    if (this.currentPath != null) {
      if (this.currentPath.nextPathOptions.length > 0) {
        if (this.currentPath.nextPathOptions[0].currentCar === null) {
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
    this.displayString = "";
    this.displayStringLong = "";
    this.rotation = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;
    
    this.arrow = new Konva.Arrow({
      x: 0,
      y: 0,
      points: [this.x1, this.y1, this.x2, this.y2],
      pointerLength: 5,
      pointerWidth: 5,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
    });
    pathsLayer.add(this.arrow);

    this.arrowLabel = new Konva.Text({
      x: this.x1,
      y: this.y1,
      text: this.displayString,
      fontSize: 12,
      fontFamily: 'Roboto',
      fill: 'white'
      
    });
    this.arrowLabel.rotate(this.rotation);
      pathsLayer.add(this.arrowLabel);
    // Types: Dropoff, Parking spot, Start, End, RightTurn, LeftTurn, ...

    // Draw function

  this.setDisplayStrings = function () {
    this.displayString = "";

    var newString = "";
    newString += this.name;
    newString += ": ";
    nextPathOptions.forEach(function (elem) { newString += elem.name + "|"; });
    //newString += " " + this.rotation;
    this.displayString = newString;
    this.arrowLabel.text(this.displayString);
    // To Do: Add displayStringLong when we have dependent paths
  }

  this.draw = function () {
    
    this.setDisplayStrings();
    pathsLayer.draw();
    


    // ctx.font = "12px Arial";
    // ctx.fillStyle = "white";

    // ctx.fillText(this.displayString, x1, y1-10); 

  }
  this.clearCurrentCar = function () {
    this.currentCar = null;
    this.arrow.stroke('black');
    pathsLayer.draw();
  };


  this.getOpenPathTransitions = function (priority) {
    var openTransitions = []; 

    pathTransitions.forEach(function(e) {
      if(e.fromPath=this && e.isAvailable()) openTransitions.push(e);
    });

    return openTransitions;
  }
};

//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH TRANSITIONS

var PathTransition = function(fromPath, toPath, dependentPaths) {
  this.fromPath = fromPath;
  this.toPath = toPath;
  this.dependentPaths = dependentPaths;

  this.isAvailable = function(priority) {
    var available = true;
    
    if(this.toPath.currentCar != null) return false;

    this.dependentPaths.forEach(function (e) {
      if(e["priority"] <= priority && e["path"].currentCar != null) 
          available = false; 
    });

    return available;

  }
};

//////////////////////////////////////////////////////////////////////////////////////////
// 
// EXECUTION
//
//////////////////////////////////////////////////////////////////////////////////////////


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

// Setup Global Variables
var mapContainer = document.getElementById("mapContainer");
var pathsCanvas = document.getElementById("pathsCanvas");
var carFleet = [];
var paths = [];
var pathTransitions = [];

var pathsStage = new Konva.Stage({
  container: 'pathsCanvasDiv',
  width: 1400,
  height: 500
});
var pathsLayer = new Konva.Layer();

// add the layer to the stage
pathsStage.add(pathsLayer);

setupSliders();
createPaths();
createPathTransitions();
createCarFleet();
runSimulation();
//createCarFleetFillAllPaths();
//createCarFleetRandom();

// Call Debug functions
consoleLogAllPaths();



//////////////////////////////////////////////////////////////////////////////////////////
// 
// SETUP FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function setupSliders() {
  let elementsArray = document.querySelectorAll(".slider");

  elementsArray.forEach(function (elem) {
    elem.addEventListener("input", function () {
      this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #C6C6C6 ' + this.value + '%, #C6C6C6 100%)'
    });

    elem.dispatchEvent(new Event('input'));
  });


}

function createPaths() {
  var previousPath;

  // Across Portola
  for (var i = 0; i < 9; i++) {
    paths.push(new Path(i, i * 50, 70, (i + 1) * 50, 70, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  // Into parking lot
  for (var i = 9; i < 13; i++) {
    paths.push(new Path(i, 450, 20 + (i - 8) * 50, 450, 20 + (i - 7) * 50, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  // random angled line
  for (var i = 13; i < 16; i++) {
    paths.push(new Path(i, 450 + (i -13) * 50, 270 + (i - 13) * 50, 450 + (i - 12) * 50, 270 + (i - 12) * 50, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

   for (var i = 16; i < 21; i++) {
    paths.push(new Path(i, 600+50*(i-16), 420, 600+50*(i-15), 420, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  // Into parking lot
  for (var i = 21; i < 29; i++) {
    paths.push(new Path(i, 850+(i-21)*5, 420 - (i - 21) * 50, 850+(i-20)*5, 420 - (i - 20) * 50, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  for (var i = 29; i < 47; i++) {
    paths.push(new Path(i, 890-(i-29) * 50, 20, 890-(i-28) * 50, 20, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  for (var i = 47; i < 48; i++) {
    paths.push(new Path(i, 450, 70 + (i - 48) * 50, 450, 70 + (i - 47) * 50, new Array(), new Array()));
    if (i > 0) { paths[i - 1].nextPathOptions.push(paths[i]); }

  }

  paths.forEach(function (elem) { elem.draw(); });
}

function createPathTransitions() {
  
}

function createCarFleet() {
  var numberOfCars = document.getElementById("sliderAmountOfCars").value;
  for (var i = 0; i < numberOfCars; i++) {
    carFleet.push(new Car(i));
  }
}
/*
function createCarFleetFillAllPaths() {
  var numberOfCars = document.getElementById("sliderAmountOfCars").value;
  for (var i = 0; i<numberOfCars; i++){
    carFleet.push(new Car());
    if(i < paths.length-1) {carFleet[i].setPath(paths[i]);}
    else {carFleet[i].setPath(paths[0]);}
    carFleet[i].draw();
  }
}
*/

function carFleetAssignRandomPaths() {
  carFleet.forEach(function (e) {
    var random = getRandomInt(paths.length);
    e.setPath(paths[random]);
    e.draw();
  });
}


//////////////////////////////////////////////////////////////////////////////////////////
// 
// RUN FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////


function togglePaths() {
  pathsCanvas.hidden = !pathsCanvas.hidden;
}

function runSimulation() {
  carFleetAssignRandomPaths();

  var timeScale = 50000;

  for (var i = 0; i < 2000; i++) {
    window.setTimeout(nextStep, timeScale / 60 * i, 20);
  }
}


function nextStep() {
  carFleet.forEach(function (elem) {
    elem.nextStep()
  })
}

//////////////////////////////////////////////////////////////////////////////////////////
// 
// HELPER FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//////////////////////////////////////////////////////////////////////////////////////////
// 
// DEBUG FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function consoleLogAllPaths() {
  console.log("paths.displayString");
  paths.forEach(function (e) { console.log(e.displayString); });
}



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





var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function () {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
  $TABLE.find('table').append($clone);
});

$('.table-remove').click(function () {
  $(this).parents('tr').detach();
});

$('.table-up').click(function () {
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
  
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    
    data.push(h);
  });
  
  // Output the result
  $EXPORT.text(JSON.stringify(data));
});