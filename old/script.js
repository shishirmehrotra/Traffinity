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


/////////////////////////////////////////////////////////////////////////////////////////////////////
// CAR

var carColors = [
"#FF0000",
"#FF1100",
"#FF2300",
"#FF3400",
"#FF4600",
"#FF5700",
"#FF6900",
"#FF7B00",
"#FF8C00",
"#FF9E00",
"#FFAF00",
"#FFC100",
"#FFD300",
"#FFE400",
//"#FFF600",
//"#F7FF00",
"#E5FF00",
"#D4FF00",
"#C2FF00",
"#B0FF00",
"#9FFF00",
"#8DFF00",
"#7CFF00",
"#6AFF00",
"#58FF00",
"#47FF00",
"#35FF00",
"#24FF00",
"#12FF00", 
"#00FF00"]

var Car = function (id) {

  this.currentPath = null;
  this.id = id;
  this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
  this.ticksSinceLastMove = 0;
  //this.ticksSinceLastMovePrevious = 0;
  this.ticksSinceLastMoveHistory = [];
  //this.color = carColors[carColors.length];
  this.currentRotation = 0;

  this.group = new Konva.Group({
    x: 0,
    y: 0
  })

  this.passengerOne = new Konva.Rect({
    x: 5,
    y: 4,
    width: 4,
    height: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 7
  });
  /*= new Konva.Circle({
    x: 8,
    y: 6,
    radius: 5,
    fill: 'black',
    stroke: 'white',
    strokeWidth: 1
  });*/

  this.passengerTwo = new Konva.Rect({
    x: 11,
    y: 4,
    width: 4,
    height: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 7
  });

  /*= new Konva.Circle({
    x: 15,
    y: 6,
    radius: 5,
    fill: 'black',
    stroke: 'white',
    strokeWidth: 1
  });*/

  this.rectangle = new Konva.Rect({
     x: 0,
     y: 0,
    width: 26,
    height: 12,
    fill:'red',
    cornerRadius: 3
  });
  /*this.front = new Konva.Rect({
    x:2, 
    y:1,
    width: 4,
    height: 10,
    fill: 'black'
  })

  this.back = new Konva.Rect({
    x:26, 
    y:1,
    width: 3,
    height: 10,
    fill: 'black'
  })*/

  this.sideRight = new Konva.Rect({
    x:2,
    y:1,
    width:22,
    height:1,
    fill: 'black'
  })
  this.sideLeft = new Konva.Rect({
    x:2,
    y:10,
    width:22,
    height:1,
    fill: 'black'
  })
  //this.front.moveToTop();
  //this.back.moveToTop();
  this.sideRight.moveToTop();
  this.sideLeft.moveToTop();
  this.passengerTwo.moveToTop();
  this.passengerOne.moveToTop();


  this.group.add(this.rectangle);
  this.group.add(this.passengerOne);
  this.group.add(this.passengerTwo);
  //this.group.add(this.front);
  //this.group.add(this.back);
  this.group.add(this.sideRight);
  this.group.add(this.sideLeft);

  carsLayer.add(this.group);
  //carsLayer.add(this.rectangle);
  //carsLayer.draw();

  // Create DOM element 
  /*this.element = document.createElement("IMG");
  this.element.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png";
  this.element.classList.add("car");
  this.element.id = 'car' + id;
  mapContainer.appendChild(this.element);
*/
  // Set functions: draw, rotate
  this.draw = function () {
    /*
    this.element.style.left = this.currentPath.x2 + "px";
    this.element.style.top = this.currentPath.y2 + "px";
    this.element.style.transform = "rotate(" + this.currentPath.rotation + "deg)";
*/
    if (this.currentPath != null){
      //this.circle.x(this.currentPath.x1+13);
      //this.circle.y(this.currentPath.y1+6);     


      //this.rectangle.x(this.currentPath.x1);
      //this.rectangle.y(this.currentPath.y1);

      this.group.x(this.currentPath.x1);
      this.group.y(this.currentPath.y1);

      var needToRotate = this.currentPath.rotation - this.currentRotation;
      //this.rectangle.rotate(needToRotate);
      //this.circle.rotate(needToRotate);
      this.group.rotate(needToRotate);
      this.currentRotation = this.currentPath.rotation;

      this.rectangle.fill(this.getCarColor());

      carsLayer.draw();
    }
  };

  //this.rotate = function (value) { this.element.style.transform = "rotate(" + value + "deg)"; }

  this.setAverageSpeed = function() {
    this.ticksSinceLastMove = 0;
    this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
    //console.log("average speed " + this.targetAverageSpeed);
  }

  this.getCarColor = function() {
    var index = Math.round(Math.max(carColors.length - Math.max(average(this.ticksSinceLastMoveHistory), this.ticksSinceLastMove)*1, 0));
    if(index < 27) {
      console.log("car " + this.id 
                + " ticksSinceLastMoveHistory " + this.ticksSinceLastMoveHistory 
                + " ticksSinceLastMove " + this.ticksSinceLastMove 
                + " index " + index);
    }
    return carColors[index];
  }

  this.setDone = function () { 
    //this.element.hidden = true; 
    //this.rectangle.hide();
    //this.circle.hide();
    this.group.hide();

    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); } 
    this.currentPath = null;
  }

  this.setPath = function (path) {
    //this.element.hidden = false;
    this.rectangle.show();
    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); }
    this.currentPath = path;
    path.currentCar = this;
    //this.draw();
    //this.currentPath.arrow.stroke('white');
    //pathsLayer.draw();
  }

  this.nextStep = function () {
    var beforePath = this.currentPath;
    var moved = false;
    // TODO select from openTransitions
    if (this.currentPath != null) {
      if (this.ticksSinceLastMove*4 >= -this.targetAverageSpeed+100) {
        var validPathTransitions = pathTransitions.filter(e => e.fromPath === this.currentPath && e.isAvailable());
        if(validPathTransitions.length > 0) {
            var random = getRandomInt(validPathTransitions.length);

            this.setPath(validPathTransitions[random].toPath);
            if (this.currentPath != beforePath) {
              this.draw();
              moved = true;
            }
        }
        //else {this.ticksSinceLastMove++}
        if (this.currentPath.types != null) {
          if (this.currentPath.types.includes("end")) {
          this.setDone();
          }
        }        
      }

    }
    if(moved) {
        //this.ticksSinceLastMovePrevious = this.ticksSinceLastMove;
        this.ticksSinceLastMoveHistory.push(this.ticksSinceLastMove);
        this.ticksSinceLastMoveHistory = this.ticksSinceLastMoveHistory.slice(-5);
        this.ticksSinceLastMove = 0;}
    else      {this.ticksSinceLastMove++; this.draw();};
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

    this.rotation = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    // this.rotation = Math.atan((y2 - y1)/(x2 - x1)) * 180 / Math.PI;

    this.rotationRadians = Math.atan2(y2 - y1, x2 - x1);
    //this.rotationRadians = Math.atan((y2 - y1)/(x2 - x1));


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
    var initialTheta = Math.PI / 4;

    this.arrowLabel = new Konva.Text({
      x: this.x1 + r * Math.cos(this.rotationRadians + initialTheta),
      y: this.y1 + r * Math.sin(this.rotationRadians + initialTheta),
      text: this.displayString,
      fontSize: 11,
      fontFamily: 'Roboto',
      fill: 'white',      
      //scaleY: scaleY      
    });
    this.arrowLabel.rotate(this.rotation);
    if(this.rotation >= 180) { 
      this.arrowLabel.rotate(180);
      //this.arrowLabel.scale({ x: -1, y: -1 });
    }

    pathsLayer.add(this.arrowLabel);
    // Types: Dropoff, Parking spot, Start, End, RightTurn, LeftTurn, ...

    // Draw function

  this.setDisplayStrings = function () {
    this.displayString = "";

    var newString = "";
    newString += this.id;
    newString += ": ";
    pathTransitions.filter(e => e.fromPath === this).forEach(e => newString += e.toPath.id + "|");
    if(this.name != null) newString += "\n" + this.name;
    // newString += " " +  this.rotationRadians.toPrecision(3);
    //newString += " " +  this.rotation.toPrecision(3);
    this.displayString = newString;
    this.arrowLabel.text(this.displayString);
    // To Do: Add displayStringLong when we have dependent paths
  }

  this.draw = function () {
    
    this.setDisplayStrings();
    pathsLayer.draw();
  }
  this.clearCurrentCar = function () {
    this.currentCar = null;
   //this.arrow.stroke('black');
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
// CAR GENERATOR   


var CarGenerator = function(){
  this.leftCarCount = 0;
  this.rightCarCount = 0;
  this.currentDirectionRatio = document.getElementById("sliderDirectionRatio").value;
  this.ticksSinceLastCar = 0;
  this.currentAmountOfCars = document.getElementById("sliderAmountOfCars").value;

  this.setRatio = function() {
    this.leftCarCount = 0;
    this.rightCarCount = 0;
    this.currentDirectionRatio = document.getElementById("sliderDirectionRatio").value;
    console.log("Current Direction Ratio: " + this.currentDirectionRatio);
  };

  this.setAmountOfCars = function() {
    this.leftCarCount = 0;
    this.rightCarCount = 0;
    this.ticksSinceLastCar = 0;
    this.currentAmountOfCars = document.getElementById("sliderAmountOfCars").value;
    console.log("Current Amount Of Cars: " + this.currentAmountOfCars);
  };

  this.generateCars = function() {
    // should we add cars on this tick?
    if (this.ticksSinceLastCar >= -this.currentAmountOfCars+100) {
      // generate car
      // should we put the cars on the left or right?
      
      if (this.currentDirectionRatio/100 < this.rightCarCount/(this.leftCarCount+ this.rightCarCount)) {
        var path = findPathByName("EStart");
        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length));
          carFleet[carFleet.length-1].setPath(path);
          this.leftCarCount++;
        }
      }
      else {
        var path = findPathByName("WStart");

        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length));  
          carFleet[carFleet.length-1].setPath(path);
          this.rightCarCount++;
        }
      }
      //reset ticks
      this.ticksSinceLastCar = 0;
    }
    else {
      this.ticksSinceLastCar++;
    }
  };
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
var carGenerator = new CarGenerator();

var pathsStage = new Konva.Stage({
  container: 'pathsCanvasDiv',
  width: 1400,
  height: 500
});
var pathsLayer = new Konva.Layer();

// add the layer to the stage
pathsStage.add(pathsLayer);

/*var carsStage = new Konva.Stage({
  container: 'carsCanvasDiv',
  width: 1400,
  height: 500
});*/
var carsLayer = new Konva.Layer();

// add the layer to the stage
pathsStage.add(carsLayer);

setupSliders();
createPaths();

createPathTransitions();
createCarFleet();
resetSimulation();
runSimulation();
//createCarFleetFillAllPaths();
//createCarFleetRandom();

// Call Debug functions

consoleLogAllPaths();
consoleLogAllPathTransitions();


var setAverageSpeed = function() {
  carFleet.forEach(e => e.setAverageSpeed());
}


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
    paths.push(new Path(currentIndex, x1+i*xIncrement, y1+i*yIncrement, x1+(i+1)*xIncrement, y1+(i+1)*yIncrement, types.slice(0)));
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
  createPathLine(0,    70, 450,  70,  9, [], null, "EStart", "ETurnInStart");  // Across Portola

  createPathLine(450,  70, 450, 170,  2, [], paths.length-1, "EEnter", null);  // Into parking lot
  createPathLine(450, 170, 450, 270,  2, [], paths.length-1, "ExitFirstParkingLine", null);  // Into parking lot

  createPathLine(450, 270, 500, 320,  1, [], paths.length-1, null, "AngleIntoSecondParkingLine");  // Angle along curb
  createPathLine(500, 320, 600, 420,  2, [], paths.length-1);  // Angle along curb
  createPathLine(600, 420, 850, 420,  5, [], paths.length-1);  // Dropoff Curb
  
  createPathLine(850, 420, 860, 320,  2, [], paths.length-1, null, null);  // Exit parking lot
  createPathLine(860, 320, 875, 170,  3, [], paths.length-1, "ExitSecondParkingLine", "EnterFirstParkingLine");  // Exit parking lot
  createPathLine(875, 170, 885,  70,  2, [], paths.length-1, null, "Exit");  // Exit parking lot

  createPathLine(885,  70, 890,  20,  1, [], paths.length-1, null, "ExitCrossPortola");  // Exit parking lot
  createPathLine(890,  20, 440,  20,  9, [], paths.length-1, "WAfterExit", "WTurnInStart");  // West bound Portola
  createPathLine(440,  20, -10,  20,  9, [], paths.length-1, null, "WEnd");  // West bound Portola
  createPathLine(450,  20, 450,  70,  1, [], null, null, "WTurnInActive");  // West bound Portola turn into parking lot
  createPathLine(1190, 70,  890,   20, 6, [], null, "WStart", "WBeforeExit");  // Enter west bound Portola
  createPathLine( 885, 80, 1185,  110, 6, [], null, "EAfterExit", "EEnd");  // Exit east bound Portola
  createPathLine( 450, 70,  885,   80, 9, [], null, "EAfterTurnIn", "EBeforeExit");  // East bound Portola

  createPathLine( 500, 320,  860,   320, 7, [], null, "StartSecondParkingLine", "EndSecondParkingLine");  // East bound Portola
  createPathLine( 875, 170,  450,   170, 7, [], null, "StartFirstParkingLine", "EndFirstParkingLine");  // East bound Portola


  pathTransitions.push(new PathTransition(findPathByName("WTurnInStart"), findPathByName("WTurnInActive"), []));
  pathTransitions.push(new PathTransition(findPathByName("WBeforeExit"), findPathByName("WAfterExit"), []));
  pathTransitions.push(new PathTransition(findPathByName("WTurnInActive"), findPathByName("EEnter"), []));
  pathTransitions.push(new PathTransition(findPathByName("EBeforeExit"), findPathByName("EAfterExit"), []));
  pathTransitions.push(new PathTransition(findPathByName("ETurnInStart"), findPathByName("EAfterTurnIn"), []));
  pathTransitions.push(new PathTransition(findPathByName("Exit"), findPathByName("EAfterExit"), []));
  pathTransitions.push(new PathTransition(findPathByName("AngleIntoSecondParkingLine"), findPathByName("StartSecondParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EndSecondParkingLine"), findPathByName("ExitSecondParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EnterFirstParkingLine"), findPathByName("StartFirstParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EndFirstParkingLine"), findPathByName("ExitFirstParkingLine"), []));


  var wEndPath = findPathByName("WEnd");  wEndPath.types.push("end");
  var eEndPath = findPathByName("EEnd");  eEndPath.types.push("end");


  paths.forEach(function (elem) { elem.draw(); });
}

function createPathTransitions() {
  
}

function createCarFleet() {
  console.log("create car fleet");
  var numberOfCars = document.getElementById("sliderAmountOfCars").value;
  numberOfCars = 0;
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

var timer;

function runSimulation() {
  var timeScale = (100-document.getElementById("sliderTimeWarp").value)*0.5;

  console.log("time scale: " + timeScale);

  window.clearInterval(timer);
  timer = window.setInterval(nextStep, timeScale);
/*
  timer = window.clearTimeout()
  for (var i = 0; i < 2000; i++) {
    timer = window.setTimeout(nextStep, timeScale/30*i, 20);
  }
  */
}

function pauseSimulation() {
  window.clearInterval(timer);
}

function resetSimulation() {
    carFleetAssignRandomPaths();
}

function nextStep() {
  carGenerator.generateCars();
  carFleet.forEach(function (elem) {
    elem.nextStep()
  })
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