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

  createPathLine(450,  70, 450, 185,  3, [], paths.length-1, "EEnter", null);  // Into parking lot
  createPathLine(450, 185, 450, 270,  3, [], paths.length-1, "ExitFirstParkingLine", null);  // Into parking lot

  //createPathLine(450, 270, 500, 320,  2, [], paths.length-1, null, "AngleIntoSecondParkingLine");  // Angle along curb
  createPathLine(450, 270, 470, 290,  1, [], paths.length-1, null, "AngleIntoSecondParkingLine");  // Angle along curb
  createPathLine(470, 290, 580, 400,  4, [], paths.length-1, null, "EnterSecondDropoffLane");  // Angle along curb 1 
  createPathLine(580, 400, 850, 400,  5, [], paths.length-1, "StartOuterDropoffLane","EndOuterDropoffLane" );  // Outer dropoff curb lane
  createPathLine(580, 400, 620, 440,  2, [], null, "ForkBetweenDropoffLanes");  // Angle along curb 2
  createPathLine(620, 440, 850, 440,  5, [], paths.length-1);  // Inner dropoff curb lane
  
  createPathLine(850, 440, 850, 400,  2, [], paths.length-1, null, null);  // Exit parking lot 1st leg
  createPathLine(850, 400, 860, 320,  2, [], paths.length-1, null, "ExitOuterDropoffLane");  // Exit parking lot 2nd leg
  createPathLine(860, 320, 875, 170,  3, [], paths.length-1, "ExitSecondParkingLine", "EnterFirstParkingLine");  // Exit parking lot
  createPathLine(875, 170, 885,  70,  2, [], paths.length-1, null, "Exit");  // Exit parking lot

  createPathLine(885,  70, 890,  20,  1, [], paths.length-1, null, "ExitCrossPortola");  // Exit parking lot
  createPathLine(890,  20, 440,  20,  9, [], paths.length-1, "WAfterExit", "WTurnInStart");  // West bound Portola
  createPathLine(440,  20, -10,  20,  9, [], paths.length-1, null, "WEnd");  // West bound Portola
  createPathLine(450,  20, 450,  70,  1, [], null, null, "WTurnInActive");  // West bound Portola turn into parking lot
  createPathLine(1190, 70,  890,   20, 6, [], null, "WStart", "WBeforeExit");  // Enter west bound Portola
  createPathLine( 885, 80, 1185,  110, 6, [], null, "EAfterExit", "EEnd");  // Exit east bound Portola
  createPathLine( 450, 70,  885,   80, 9, [], null, "EAfterTurnIn", "EBeforeExit");  // East bound Portola

  createPathLine( 470, 290,  860,   290, 7, [], null, "StartSecondParkingLine", "EndSecondParkingLine");  // East bound Portola
  createPathLine( 875, 185,  450,   185, 7, [], null, "StartFirstParkingLine", "EndFirstParkingLine");  // East bound Portola


  pathTransitions.push(new PathTransition(findPathByName("WTurnInStart"), findPathByName("WTurnInActive"), []));
  pathTransitions.push(new PathTransition(findPathByName("WBeforeExit"), findPathByName("WAfterExit"), []));
  pathTransitions.push(new PathTransition(findPathByName("WTurnInActive"), findPathByName("EEnter"), []));
  pathTransitions.push(new PathTransition(findPathByName("EBeforeExit"), findPathByName("EAfterExit"), []));
  pathTransitions.push(new PathTransition(findPathByName("ETurnInStart"), findPathByName("EAfterTurnIn"), []));
  pathTransitions.push(new PathTransition(findPathByName("Exit"), findPathByName("EAfterExit"), []));
  pathTransitions[pathTransitions.length-1].dependentPaths.push({"path": findPathByName("EBeforeExit"), "priority": 1});

  pathTransitions.push(new PathTransition(findPathByName("AngleIntoSecondParkingLine"), findPathByName("StartSecondParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EndSecondParkingLine"), findPathByName("ExitSecondParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EnterFirstParkingLine"), findPathByName("StartFirstParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EndFirstParkingLine"), findPathByName("ExitFirstParkingLine"), []));
  pathTransitions.push(new PathTransition(findPathByName("EnterSecondDroppoffLane"), findPathByName("StartOuterDropoffLane"), []));
  pathTransitions.push(new PathTransition(findPathByName("EndOuterDropoffLane"), findPathByName("ExitOuterDropoffLane"), []));
  pathTransitions.push(new PathTransition(findPathByName("EnterSecondDropoffLane"), findPathByName("ForkBetweenDropoffLanes"), []));

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