                //////////////////////////////////////////////////////////////////////////////////////////
// 
// SETUP FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function clearMap() {
  pauseSimulation();
  pathsLayer.destroy();
  pathNamesLayer.destroy();
  carsLayer.destroy();
 
  pathsLayer = new Konva.Layer();
  pathNamesLayer = new Konva.Layer();
  carsLayer = new Konva.Layer();

  showPathLines();

  pathsStage.add(pathsLayer);
  pathsStage.add(pathNamesLayer);
  pathsStage.add(carsLayer);

  paths.length = 0;
  carFleet.length = 0;
  pathTransitions.length = 0;
}


function setupSlidersFormatting() {
  let elementsArray = document.querySelectorAll(".slider");

  elementsArray.forEach(function (elem) {
    elem.addEventListener("input", function () {
      this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #C6C6C6 ' + this.value + '%, #C6C6C6 ' + elem.max + '%)'
      //this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #C6C6C6 ' + this.value + '%, #C6C6C6 100%)'
    });

    elem.dispatchEvent(new Event('input'));
  });


}


function createPathLineBetweenPaths(fromPath, toPath, numberOfSegments, types, incomingPathNames, pathLineName, startIndex, includeStart, includeEnd) {
  var newPathEndName = createPathLine(fromPath.x2, fromPath.y2, toPath.x1, toPath.y1, numberOfSegments, types, incomingPathNames, pathLineName, startIndex, includeStart, includeEnd)

  pathTransitions.push(new PathTransition(fromPath,                        findPathByName(newPathEndName), []));  
  pathTransitions.push(new PathTransition(findPathByName(newPathEndName),  toPath, []));  
}

function createPathLine(x1, y1, x2, y2, numberOfSegments, types, incomingPathNames, pathLineName, startIndex, includeStart, includeEnd) {

  var xIncrement = (x2 - x1) / numberOfSegments;
  var yIncrement = (y2 - y1) / numberOfSegments;
  var currentIndexInPathsArray = paths.length;
  var isFirstSegment = true;
  var indexInPathLine = startIndex;

  for (var i = 0; i < numberOfSegments; i++) {
    var pathName = pathLineName + " " + indexInPathLine;

    paths.push(new Path(currentIndexInPathsArray, x1 + i * xIncrement, y1 + i * yIncrement, x1 + (i + 1) * xIncrement, y1 + (i + 1) * yIncrement, [...types], pathName));
    if (isFirstSegment === true) {
      if (incomingPathNames != null) 
        pathTransitions.push(new PathTransition(findPathByNames(incomingPathNames), paths[currentIndexInPathsArray], []));
      if (includeStart === true) paths[currentIndexInPathsArray].name += " Start";
      
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

function createParkingSpot (x, y, angle, incomingPathName,outgoingPathName, parkingSpotName) {
  var parkingSpotSpacer = 20;
  var parkingSpotLength = 30;
  var x1 = x  + parkingSpotSpacer * Math.cos(angle);
  var y1 = y  + parkingSpotSpacer * Math.sin(angle);
  var x2 = x1 + parkingSpotLength * Math.cos(angle);
  var y2 = y1 + parkingSpotLength * Math.sin(angle);

  paths.push(new Path(paths.length, x1, y1, x2, y2, ["spotEnter", "dropoff"], parkingSpotName + " Enter" ));
  paths.push(new Path(paths.length, x2, y2, x1, y1, ["spotExit"], parkingSpotName + " Exit"));

  pathTransitions.push(new PathTransition(findPathByName(incomingPathName), paths[paths.length-2], [{ "path": paths[paths.length-1], "priority": 0 },]));
  pathTransitions.push(new PathTransition(paths[paths.length-2], paths[paths.length-1], [{ "path": findPathByName(outgoingPathName), "priority": 0 }]));
  pathTransitions.push(new PathTransition(paths[paths.length-1], findPathByName(outgoingPathName), []));
}

function createParkingLine (x1, y1, x2, y2, numberOfSegments, types, incomingPathNames, pathLineName, startIndex, includeStart, includeEnd, angle1, angle2, startIgnore1, startIgnore2, endIgnore1, endIgnore2) {

  var xIncrement = (x2 - x1) / numberOfSegments;
  var yIncrement = (y2 - y1) / numberOfSegments;
  var currentIndexInPathsArray = paths.length;
  var isFirstSegment = true;
  var indexInPathLine = startIndex;

  var beforeSpotPath = findPathByNames(incomingPathNames);
  var afterSpotPath;

  for (var i = 0; i < numberOfSegments; i++) {
    var pathName = pathLineName + " " + indexInPathLine;
    var spotName1 = pathLineName + " Spot " + indexInPathLine + " (a)";
    var spotName2 = pathLineName + " Spot " + indexInPathLine + " (b)";

    paths.push(new Path(currentIndexInPathsArray, x1 + i * xIncrement, y1 + i * yIncrement, x1 + (i + 1) * xIncrement, y1 + (i + 1) * yIncrement, [...types], pathName));
    afterSpotPath = paths[paths.length-1];

    if (isFirstSegment === true) {
      if (incomingPathNames != null) 
        pathTransitions.push(new PathTransition(findPathByNames(incomingPathNames), paths[currentIndexInPathsArray], []));
      if (includeStart === true) paths[currentIndexInPathsArray].name += " Start";
      
      isFirstSegment = false;
    }
    else {
      //pathTransitions.push(new PathTransition(paths[currentIndexInPathsArray - 1], paths[currentIndexInPathsArray], []));
      pathTransitions.push(new PathTransition(beforeSpotPath, afterSpotPath, []));
      //createParkingSpot(x1 + (i) * xIncrement, y1 + (i) * yIncrement, angle, paths[currentIndexInPathsArray-3].name, paths[currentIndexInPathsArray].name, spotName);
      if (startIgnore1 > 0) {startIgnore1--;}
      else {
        if (i < numberOfSegments - endIgnore1) {
         if(angle1 != null) createParkingSpot(x1 + i*xIncrement, y1 + i * yIncrement, angle1, beforeSpotPath.name, afterSpotPath.name, spotName1);
        }
      }

      if (startIgnore2 > 0) {startIgnore2--;}
      else {
        if (i < numberOfSegments - endIgnore2) {
          if(angle2 != null) createParkingSpot(x1 + i*xIncrement, y1 + i * yIncrement, angle2, beforeSpotPath.name, afterSpotPath.name, spotName2);
        }
      }
    }

    beforeSpotPath = afterSpotPath;
    currentIndexInPathsArray = paths.length;
    indexInPathLine++;  
  }
  if (includeEnd === true) afterSpotPath.name += " End";
    //paths[paths.length-1].name += " End";

  //return paths[paths.length-1].name;
  return afterSpotPath.name;
}

function findPathByName(name) {
  var validPaths = paths.filter(e => e.name === name);
  if (validPaths.length === 1) return validPaths[0];
  return null;
}

function findPathByNames(names) {
  if(names.length != 2) return null;

  var validPaths = paths.filter(
    p => (p.name.startsWith(names[0]) && p.name.search(names[1])!=-1)
      /*function(p) {
        var isMatched = true;
        if(p.name === null) return false;

        
        for (i = 0; i < names.length; i++)
         if(p.name.search(names[i]) === -1){ isMatched = false;} 
        
        
        return isMatched;
      }*/
    );
  if (validPaths.length === 1) return validPaths[0];
  return null;
}

function findPathsByNamePrefix(name) {
  return paths.filter(p => (p.name.startsWith(name) ));
}

function findPathTransitionByFromAndToPaths (fromPath, toPath) {
  return pathTransitions.filter(p => p.fromPath === fromPath && p.toPath === toPath)[0];
}

//TODO: Path Config Specific
/* function createPaths() {
  clearMap(); 
  var currentPathSetup = document.querySelector('input[name="radioParkingLotSetup"]:checked').value;
  switch (currentPathSetup) {
      case "Simple":
        createPathsSimple();
        runSimulation(); break;
      case "Today":
        createPathsToday(); 
        runSimulation(); break;
      case "All Left":
        createPathsAllLeft(); 
        runSimulation(); break;
      case "Exit Right":
        createPathsExitRight(); 
        runSimulation(); break;
      default:
        createPathsSimple(); 
        runSimulation(); break;
    }
}

function createPathsSimple() {
  
}

function createPathsToday() {
  createPathsSimple();
}

function createPathsAllLeft() {
  createPathsSimple();
}

function createPathsExitRight() {
  createPathsSimple();
}

function createPathTransitions() {

}
*/
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