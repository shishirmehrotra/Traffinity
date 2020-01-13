//////////////////////////////////////////////////////////////////////////////////////////
// To Do
// - Get rid of NextPathOptions
// - Model the rest of path Transitions
// - Run simulation - how cars are created, next frame, time warp
//
// Later
// - Edit and store paths directly -- need to pick storage model (e.g. https://repl.it/site/blog/firebase)



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
  //this.currentPath.arrow.stroke('white');
  pathsLayer.draw();
  }

  this.nextStep = function () {
    // TODO select from openTransitions
    if (this.currentPath != null) {
      var validPathTransitions = pathTransitions.filter(e => e.fromPath === this.currentPath && e.isAvailable());
      if(validPathTransitions.length > 0) {
          var random = getRandomInt(validPathTransitions.length);

          this.setPath(validPathTransitions[random].toPath); this.draw();
      }
    }
  }
};

//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH

var Path = function (id, x1, y1, x2, y2, types, name) {

  

  // Set initial values
    this.name = name;
    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.types = types;
    this.currentCar = null;
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


    var r = 10;
    var initialTheta = Math.PI / 2;

    this.arrowLabel = new Konva.Text({
      x: this.x1 + r * Math.cos(this.rotation + initialTheta),
      y: this.y1 + r * Math.sin(this.rotation + initialTheta),
      text: this.displayString,
      fontSize: 10,
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
    newString += this.id;
    newString += ": ";
    pathTransitions.filter(e => e.fromPath === this).forEach(e => newString += e.toPath.id + "|");
    //nextPathOptions.forEach(function (elem) { newString += elem.id + "|"; });
    //newString += " " + this.rotation;
    if(this.name != null) newString += "\n" + this.name;
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

  this.consoleLog = function () {
    var string = "From: " + this.fromPath.id;
    if(this.fromPath.name != null) string += " " + this.fromPath.name + " ";
    string += " To: " + this.toPath.id 
    if(this.toPath.name != null) string += " " + this.toPath.name + " "; 
    string += " [";
    this.dependentPaths.forEach(function(e)
      { 
        string += e["path"].id + e["priority"];
        });
    string += "]";
    console.log(string);
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
consoleLogAllPathTransitions();




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

function createPathLine(x1, y1, x2, y2, numberOfSegments, types, incomingPathIndex, firstPathName, lastPathName) {
  
  var xIncrement = (x2-x1)/numberOfSegments;
  var yIncrement = (y2-y1)/numberOfSegments;
  var currentIndex = paths.length;
  var isFirstSegment = true;

  for (var i = 0; i < numberOfSegments; i++) {
    paths.push(new Path(currentIndex, x1+i*xIncrement, y1+i*yIncrement, x1+(i+1)*xIncrement, y1+(i+1)*yIncrement, types));
    if (isFirstSegment === true) {
      if (incomingPathIndex != null) { 
        pathTransitions.push(new PathTransition(paths[incomingPathIndex], paths[currentIndex], [])); 
      }
      paths[currentIndex].name = firstPathName;
      isFirstSegment = false;
    }
    else {
      pathTransitions.push(new PathTransition(paths[currentIndex-1], paths[currentIndex], [])); 
    }
    currentIndex = paths.length;
  }
  paths[currentIndex-1].name = lastPathName;
}

function findPathByName(name) {
  var validPaths = paths.filter(e => e.name === name);
  if (validPaths.length === 1) return validPaths[0];
  return false;
}


function createPaths() {
  var previousPath;

  
/*
  for (var i = 0; i < 9; i++) {
    paths.push(new Path(i, i * 50, 70, (i + 1) * 50, 70, new Array(), new Array()));    
    if (i > 0) { pathTransitions.push(new PathTransition(paths[i-1], paths[i], [])); }

  }

  
  for (var i = 9; i < 13; i++) {
    paths.push(new Path(i, 450, 20 + (i - 8) * 50, 450, 20 + (i - 7) * 50, new Array(), new Array()));
    if (i > 0) { pathTransitions.push(new PathTransition(paths[i-1], paths[i], [])); }
  }

  // random angled line
  for (var i = 13; i < 16; i++) {
    paths.push(new Path(i, 450 + (i -13) * 50, 270 + (i - 13) * 50, 450 + (i - 12) * 50, 270 + (i - 12) * 50, new Array(), new Array()));
    if (i > 0) { pathTransitions.push(new PathTransition(paths[i-1], paths[i], [])); }
  }
   for (var i = 16; i < 21; i++) {
    paths.push(new Path(i, 600+50*(i-16), 420, 600+50*(i-15), 420, new Array(), new Array()));
    if (i > 0) { pathTransitions.push(new PathTransition(paths[i-1], paths[i], [])); }
  }
8?
  // Into parking lot
  /*for (var i = 21; i < 29; i++) {
    paths.push(new Path(i, 850+(i-21)*5, 420 - (i - 21) * 50, 850+(i-20)*5, 420 - (i - 20) * 50, new Array(), new Array()));
    if (i > 0) { pathTransitions.push(new PathTransition(paths[i-1], paths[i], [])); }
  }*/
  createPathLine(0,    70, 450,  70,  9, [], null, "EStart", "ETurnInStart");  // Across Portola
  createPathLine(450,  70, 450, 270,  4, [], paths.length-1, "EEnter");  // Into parking lot
  createPathLine(450, 270, 600, 420,  3, [], paths.length-1);  // Angle along curb
  createPathLine(600, 420, 850, 420,  5, [], paths.length-1);  // Dropoff Curb
  createPathLine(850, 420, 890,  20,  8, [], paths.length-1);  // Exit parking lot
  createPathLine(890,  20, 440,  20,  9, [], paths.length-1, null, "WTurnInStart");  // West bound Portola
  createPathLine(440,  20, -10,  20, 9, [], paths.length-1);  // West bound Portola
  createPathLine(450,  20, 450,  70,  1, [], null, null, "WTurnInActive");  // West bound Portola turn into parking lot


  pathTransitions.push(new PathTransition(findPathByName("WTurnInStart"), findPathByName("WTurnInActive"), []));
  //pathTransitions.push(new PathTransition(paths[37], paths[47], []));

  pathTransitions.push(new PathTransition(findPathByName("WTurnInActive"), findPathByName("EEnter"), []));
  //pathTransitions.push(new PathTransition(paths[47], paths[9], []));

  // Remove 46 to 47
  //pathTransitions = pathTransitions.filter(value => !(value.fromPath.id === 46 && value.toPath.id === 47));

  paths.forEach(function (elem) { elem.draw(); });
}

function createPathTransitions() {
  
}

function createCarFleet() {
  console.log("create car fleet");
  var numberOfCars = document.getElementById("sliderAmountOfCars").value;
  numberOfCars = 20;
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
    if(paths[random].currentCar === null) {e.setPath(paths[random])}
    else(e.setPath(paths[0]));
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

function consoleLogAllPathTransitions() {
  console.log("pathsTransitions");
  //console.log(JSON.stringify(pathTransitions));
  pathTransitions.forEach(function (e) { 
    e.consoleLog();
    //console.log(e.fromPath.id + " " + e.toPath.id); 
    });
}




//////////////////////////////////////////////////////////////////////////////////////////
// 
// OLD CODE -- TO BE MERGED ABOVE AND THEN DELETED
//
//////////////////////////////////////////////////////////////////////////////////////////



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