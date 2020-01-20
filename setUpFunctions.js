//////////////////////////////////////////////////////////////////////////////////////////
// 
// SETUP FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function clearMap() {
  pathsLayer.destroy();
  pathNamesLayer.destroy();
  carsLayer.destroy();
 
  pathsLayer = new Konva.Layer();
  pathNamesLayer = new Konva.Layer();
  carsLayer = new Konva.Layer();

  pathsStage.add(pathsLayer);
  pathsStage.add(pathNamesLayer);
  pathsStage.add(carsLayer);

  paths.length = 0;
  carFleet.length = 0;
  pathTransitions.length = 0;
}


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

  var xIncrement = (x2 - x1) / numberOfSegments;
  var yIncrement = (y2 - y1) / numberOfSegments;
  var currentIndex = paths.length;
  var isFirstSegment = true;

  for (var i = 0; i < numberOfSegments; i++) {
    paths.push(new Path(currentIndex, x1 + i * xIncrement, y1 + i * yIncrement, x1 + (i + 1) * xIncrement, y1 + (i + 1) * yIncrement, [...types]));
    if (isFirstSegment === true) {
      if (incomingPathIndex != null) {
        pathTransitions.push(new PathTransition(paths[incomingPathIndex], paths[currentIndex], []));
      }
      paths[currentIndex].name = firstPathName;
      isFirstSegment = false;
    }
    else {
      pathTransitions.push(new PathTransition(paths[currentIndex - 1], paths[currentIndex], []));
    }
    currentIndex = paths.length;
  }
  paths[currentIndex - 1].name = lastPathName;
}

function createPathLineNew(x1, y1, x2, y2, numberOfSegments, types, incomingPathName, pathLineName, startIndex, includeStart, includeEnd) {

  var xIncrement = (x2 - x1) / numberOfSegments;
  var yIncrement = (y2 - y1) / numberOfSegments;
  var currentIndexInPathsArray = paths.length;
  var isFirstSegment = true;
  var indexInPathLine = startIndex;

  for (var i = 0; i < numberOfSegments; i++) {
    var pathName = pathLineName + " " + indexInPathLine;

    paths.push(new Path(currentIndexInPathsArray, x1 + i * xIncrement, y1 + i * yIncrement, x1 + (i + 1) * xIncrement, y1 + (i + 1) * yIncrement, [...types], pathName));
    if (isFirstSegment === true) {
      if (incomingPathName != null) {
        pathTransitions.push(new PathTransition(findPathByName(incomingPathName), paths[currentIndexInPathsArray], []));
        if (includeStart === true) {
          paths[currentIndexInPathsArray].name += " Start";
        }
      }
      isFirstSegment = false;
    }
    else {
      pathTransitions.push(new PathTransition(paths[currentIndexInPathsArray - 1], paths[currentIndexInPathsArray], []));
    }
    currentIndexInPathsArray = paths.length;
    indexInPathLine++;  
  }
  if (includeEnd === true) paths[currentIndexInPathsArray - 1].name += " End";

  return paths[currentIndexInPathsArray - 1].name;
}

function findPathByName(name) {
  var validPaths = paths.filter(e => e.name === name);
  if (validPaths.length === 1) return validPaths[0];
  return false;
}


function createPaths() {
  clearMap(); 
  var currentPathSetup = document.querySelector('input[name="radioParkingLotSetup"]:checked').value;
  switch (currentPathSetup) {
      case "Simple":
        createPathsSimple(); break;
      case "Today":
        createPathsToday(); break;
      case "All Left":
        createPathsAllLeft(); break;
      case "Exit Right":
        createPathsExitRight(); break;
      default:
        createPathsSimple(); break;
    }
}

function createPathsSimple() {
  var previousPath;
  createPathLine(0, 70, 450, 70, 9, [], null, "E Start", "E Turn In Start");  // Across Portola
  createPathLine(450, 70, 450, 185, 3, [], paths.length - 1, "E Enter", null);  // Into parking lot
  createPathLine(450, 185, 450, 270, 3, [], paths.length - 1, "Exit First Parking Line", null);  // Into parking lot
  //createPathLine(450, 270, 500, 320,  2, [], paths.length-1, null, "AngleIntoSecondParkingLine");  // Angle along curb
  createPathLine(450, 270, 470, 290, 1, [], paths.length - 1, null, "Angle Into Second Parking Line");  // Angle along curb
  createPathLine(470, 290, 580, 400, 4, [], paths.length - 1, null, "Enter Second Dropoff Lane");  // Angle along curb 1 
  createPathLine(580, 400, 850, 400, 5, [], paths.length - 1, "Start Outer Dropoff Lane", "End Outer Dropoff Lane");  // Outer dropoff curb lane
  createPathLine(580, 400, 620, 440, 2, [], null, "Fork Between Dropoff Lanes");  // Angle along curb 2
  createPathLine(620, 440, 850, 440, 5, ["dropoff"], paths.length - 1, "Start Inner Dropoff Lane", "End Inner Dropoff Lane");  // Inner dropoff curb lane
  createPathLine(850, 440, 850, 400, 2, [], paths.length - 1, null, null);  // Exit parking lot 1st leg
  createPathLine(850, 400, 860, 320, 2, [], paths.length - 1, null, "Exit Outer Dropoff Lane");  // Exit parking lot 2nd leg
  createPathLine(860, 320, 875, 170, 3, [], paths.length - 1, "Exit Second Parking Line", "Enter First Parking Line");  // Exit parking lot
  createPathLine(875, 170, 885, 70, 2, [], paths.length - 1, null, "Exit");  // Exit parking lot
  createPathLine(885, 70, 890, 20, 1, [], paths.length - 1, null, "Exit Cross Portola");  // Exit parking lot
  createPathLine(890, 20, 440, 20, 9, [], paths.length - 1, "W After Exit", "W Turn In Start");  // West bound Portola
  createPathLine(440, 20, -10, 20, 9, [], paths.length - 1, null, "W End");  // West bound Portola
  createPathLine(450, 20, 450, 70, 1, [], null, null, "W Turn In Active");  // West bound Portola turn into parking lot
  createPathLine(1190, 70, 890, 20, 6, [], null, "W Start", "W Before Exit");  // Enter west bound Portola
  createPathLine(885, 80, 1185, 110, 6, [], null, "E After Exit", "E End");  // Exit east bound Portola
  createPathLine(450, 70, 885, 80, 9, [], null, "E After Turn In", "E Before Exit");  // East bound Portola
  createPathLine(470, 290, 860, 290, 7, [], null, "Start Second Parking Line", "End Second Parking Line");  // East bound Portola
  createPathLine(875, 185, 450, 185, 7, [], null, "Start First Parking Line", "End First Parking Line");  // East bound Portola

  pathTransitions.push(new PathTransition(findPathByName("W Turn In Start"), findPathByName("W Turn In Active"), []));
  pathTransitions.push(new PathTransition(findPathByName("W Before Exit"), findPathByName("W After Exit"), []));
  pathTransitions.push(new PathTransition(findPathByName("W Turn In Active"), findPathByName("E Enter"), []));
  pathTransitions.push(new PathTransition(findPathByName("E Before Exit"), findPathByName("E After Exit"), []));
  pathTransitions.push(new PathTransition(findPathByName("E Turn In Start"), findPathByName("E After Turn In"), []));
  pathTransitions.push(new PathTransition(findPathByName("Exit"), findPathByName("E After Exit"), []));
  pathTransitions[pathTransitions.length - 1].dependentPaths.push({ "path": findPathByName("E Before Exit"), "priority": 1 });
  pathTransitions.push(new PathTransition(findPathByName("Angle Into Second Parking Line"), findPathByName("Start Second Parking Line"), []));
  pathTransitions.push(new PathTransition(findPathByName("End Second Parking Line"), findPathByName("Exit Second Parking Line"), []));
  pathTransitions.push(new PathTransition(findPathByName("Enter First Parking Line"), findPathByName("Start First Parking Line"), []));
  pathTransitions.push(new PathTransition(findPathByName("End First Parking Line"), findPathByName("Exit First Parking Line"), []));
  pathTransitions.push(new PathTransition(findPathByName("Enter Second Droppoff Lane"), findPathByName("Start Outer Dropoff Lane"), []));
  pathTransitions.push(new PathTransition(findPathByName("End Outer Dropoff Lane"), findPathByName("Exit Outer Dropoff Lane"), []));
  pathTransitions.push(new PathTransition(findPathByName("Enter Second Dropoff Lane"), findPathByName("Fork Between Dropoff Lanes"), []));

  var wEndPath = findPathByName("W End"); wEndPath.types.push("end");
  var eEndPath = findPathByName("E End"); eEndPath.types.push("end");


  paths.forEach(function (elem) { elem.draw(); });
}

function createPathsToday() {
  

}

function createPathsAllLeft() {
  

}

function createPathsExitRight() {
  

}

function createPathTransitions() {

}

/*function createCarFleet() {
  console.log("create car fleet");
  var numberOfCars = document.getElementById("sliderAmountOfCars").value;
  numberOfCars = 0;
  for (var i = 0; i < numberOfCars; i++) {
    carFleet.push(new Car(i));
  }
}
*/
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
/*
function carFleetAssignRandomPaths() {
  carFleet.forEach(function (e) {
    var random = getRandomInt(paths.length);
    if (paths[random].currentCar === null) { e.setPath(paths[random]) }
    else (e.setPath(paths[0]));
    e.draw();
  });
}
*/