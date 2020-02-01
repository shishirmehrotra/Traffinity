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

  pathTransitions.push(new PathTransition(findPathByName(incomingPathName), paths[paths.length-2], []));
  pathTransitions.push(new PathTransition(paths[paths.length-2], paths[paths.length-1], []));
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

function findPathTransitionByFromAndToPaths (fromPath, toPath) {
  return pathTransitions.filter(p => p.fromPath === fromPath && p.toPath === toPath)[0];
}

function createPaths() {
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
  var previousPath;
  // createPathLine(x1, y1, x2, y2, numberOfSegments, types, incomingPathName, pathLineName, startIndex, includeStart, includeEnd);

  createPathLine(   0,  70,  450,  70, 9, [],          null,                                      "E Begin",                        0, true, true)
  createPathLine( 450,  70,  450, 185, 3, [],          ["E Begin",  "End"],                       "E Enter",                        0, true, true)
  createPathLine( 450, 185,  450, 270, 3, [],          ["E Enter", "End"],                        "Exit First Parking Line",        0, true, true)
  createPathLine( 450, 270,  470, 290, 1, [],          ["Exit First Parking Line", "End"],        "Angle Into Second Parking Line", 0, false, true)
  createPathLine( 470, 290,  580, 400, 4, [],          ["Angle Into Second Parking Line", "End"], "Angle Into Inner Curb Lane",     0, true, true)
  
  createParkingLine( 580, 400,  850, 400, 15, [],          ["Angle Into Inner Curb Lane", "End"],     "Inner Curb Lane",                0, true, true, -1.5*Math.PI/4, null, 3, null, 1, null);
  //createPathLine( 580, 400,  850, 400, 5, [],          ["Angle Into Inner Curb Lane", "End"],     "Inner Curb Lane",                0, true, true);
  createPathLine( 580, 400,  620, 440, 2, [],          ["Angle Into Inner Curb Lane", "End"],     "Angle Between Curb Lanes",       0, true, true);
  createPathLine( 620, 440,  850, 440, 5, ["dropoff", "curb"], ["Angle Between Curb Lanes", "End"],       "Outer Curb Lane",                0, true, true);
  createPathLine( 850, 440,  850, 400, 2, [],          ["Outer Curb Lane", "End"],                "First Exit Inner Lane",          0, true, true);
  createPathLine( 850, 400,  860, 290, 3, [],          ["First Exit Inner Lane", "End"],          "Second Exit Inner Lane",         0, true, true);
  createPathLine( 860, 290,  875, 185, 2, [],          ["Second Exit Inner Lane", "End"],         "Third Exit Inner Lane",          0, true, true);
  createPathLine( 875, 185,  885,  80, 2, [],          ["Third Exit Inner Lane", "End"],          "Fourth Exit Inner Lane",         0, true, true);
  createPathLine( 885,  80,  890,  20, 1, [],          ["Fourth Exit Inner Lane", "End"],         "Exit Cross Portola",             0, false, true);
  createPathLine( 890,  20,  440,  20, 9, [],          ["Exit Cross Portola", "End"],             "Second Outer West Portola",      0, true, true);
  createPathLine( 440,  20,  -10,  20, 9, [],          ["Second Outer West Portola", "End"],      "Third Outer West Portola",       0, true, true);
  createPathLine( 450,  20,  450,  70, 1, [],          ["Second Outer West Portola", "End"],      "Outer Entrance",                 0, false, true);
  createPathLine(1190,  70,  890,  20, 6, [],          null,                                      "W Begin",                        0, true, true);
  createPathLine( 885,  80, 1185, 110, 7, [],          null,                                      "Right Exit",                     0, true, true);
  createPathLine( 450,  70,  885,  80, 9, [],          ["E Begin", "End"],                        "Second Inner East Portola",      0, true, true);

  createParkingLine( 470, 290,  860, 290, 21, [],       ["Angle Into Second Parking Line", "End"], "2nd Parking Line",               0, true, true, 1.5*Math.PI/4, -1.5*Math.PI/4, 6, 1, 1, 2);
  //createPathLine( 470, 290,  860, 290, 7, [],          ["Angle Into Second Parking Line", "End"], "2nd Parking Line",               0, true, true);

  createParkingLine(885, 185,  450, 185, 21, [],          ["Third Exit Inner Lane", "End"],        "1st Parking Line",               0, true, true, -2.5*Math.PI/4, 2.5*Math.PI/4, 0, 1, 2, 3)
  //createPathLine( 875, 185,  450, 185, 7, [],          ["Third Exit Inner Lane", "End"],        "1st Parking Line",               0, true, true);
  createPathLine( 850, 440,  885, 400, 2, [],          ["Outer Curb Lane", "End"],                "First Exit Outer Lane",          0, true, true);
  createPathLine( 885, 400,  905, 185, 6, ["dropoff", "curb"],          ["First Exit Outer Lane", "End"],          "Second Exit Outer Lane",         0, true, true);
  createPathLine( 905, 185, 925, 85, 3, [],          ["Second Exit Outer Lane", "End"],          "Third Exit Outer Lane",         0, true, true);
/*
  for (var i = 0; i < 3; i++) { 
    createPathLineBetweenPaths(findPathByNames(["Outer Curb Lane", i]), findPathByNames(["Inner Curb Lane", i+2]), 1, [], null, "From Inner to Outer Curb One" + i, 0, false, false)
  }*/ 


  pathTransitions.push(new PathTransition(findPathByNames(["Second Outer West Portola", "End"]),      findPathByNames(["Outer Entrance", "End"]), 
                  [{ "path": findPathByNames(["E Begin", "End"]),                     "priority": 1 },
                   { "path": findPathByNames(["E Begin", "7"]),                       "priority": 2 },
                   { "path": findPathByNames(["E Begin", "6"]),                       "priority": 3 },
                   { "path": findPathByNames(["E Enter", "Start"]),                   "priority": 1 },
                   { "path": findPathByNames(["E Enter", "1"]),                       "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "Start"]), "priority": 2 },
                   { "path": findPathByNames(["Third Outer West Portola", "Start"]),  "priority": 3 } 
                  ]));  
  pathTransitions.push(new PathTransition(findPathByNames(["W Begin", "End"]),                        findPathByNames(["Second Outer West Portola", "Start"]), [])); 
  pathTransitions.push(new PathTransition(findPathByNames(["Outer Entrance", "End"]),                 findPathByNames(["E Enter", "Start"]), 
                  [{ "path": findPathByNames(["E Begin", "End"]),                     "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "Start"]), "priority": 1 },
                   { "path": findPathByNames(["E Begin", "7"]),                       "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "1"]),     "priority": 3 }
                  ]));
  pathTransitions.push(new PathTransition(findPathByNames(["Second Inner East Portola", "End"]),      findPathByNames(["Right Exit", "Start"]), []));
  pathTransitions.push(new PathTransition(findPathByNames(["Fourth Exit Inner Lane", "End"]),         findPathByNames(["Right Exit", "Start"]), 
                  [{ "path": findPathByNames(["Second Inner East Portola", "End"]),   "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "7"]),     "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "6"]),     "priority": 3 },
                   { "path": findPathByNames(["Right Exit", "1"]),                    "priority": 3 }]));
    pathTransitions.push(new PathTransition(findPathByNames(["Fourth Exit Inner Lane", "End"]),         findPathByNames(["Exit Cross Portola", "End"]), 
                  [{ "path": findPathByNames(["Second Inner East Portola", "End"]),   "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "7"]),     "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "6"]),     "priority": 3 },
                   { "path": findPathByNames(["Right Exit", "1"]),                    "priority": 3 },
                   { "path": findPathByNames(["W Begin", "End"]),                     "priority": 1 },
                   { "path": findPathByNames(["W Begin", "4"]),                       "priority": 2 },
                   { "path": findPathByNames(["W Begin", "3"]),                       "priority": 3 }
                   ]));
  pathTransitions.push(new PathTransition(findPathByNames(["Third Exit Outer Lane", "End"]),         findPathByNames(["Right Exit", "1"]), 
                  [{ "path": findPathByNames(["Right Exit", "Start"]),   "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "End"]),     "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "7"]),     "priority": 3 },]));


  // findPathTransitionByFromAndToPaths(findPathByNames(["Fourth Exit Inner Lane", "End"]),findPathByNames(["Right Exit", "Start"])).dependentPaths.push({ "path": findPathByNames(["Second Inner East Portola", "End"]), "priority": 1 });
  // pathTransitions[pathTransitions.length - 1].dependentPaths.push({ "path": findPathByNames(["Second Inner East Portola", "End"]), "priority": 1 });

  pathTransitions.push(new PathTransition(findPathByNames(["Angle Into Second Parking Line", "End"]), findPathByNames(["2nd Parking Line", "Start"]), [])); 
  pathTransitions.push(new PathTransition(findPathByNames(["2nd Parking Line", "End"]),               findPathByNames(["Third Exit Inner Lane", "Start"]), 
                  [{ "path": findPathByNames(["Second Exit Inner Lane", "End"]),       "priority": 3 }]));
  pathTransitions.push(new PathTransition(findPathByNames(["Third Exit Inner Lane", "End"]),          findPathByNames(["1st Parking Line", "Start"]), []));
  pathTransitions.push(new PathTransition(findPathByNames(["1st Parking Line", "End"]),               findPathByNames(["Exit First Parking Line", "Start"]), []));
  pathTransitions.push(new PathTransition(findPathByNames(["Angle Into Inner Curb Lane", "End"]),     findPathByNames(["Inner Curb Lane", "Start"]), []));
  pathTransitions.push(new PathTransition(findPathByNames(["Inner Curb Lane", "End"]),                findPathByNames(["Second Exit Inner Lane", "Start"]), []));
  
  var wEndPath = findPathByNames(["Third Outer West Portola", "End"]); wEndPath.types.push("end");
  var eEndPath = findPathByNames(["Right Exit", "End"]); eEndPath.types.push("end");

  pathTransitions.forEach(p => p.addImplicitPathTransitions());
  paths.forEach(function (elem) { elem.draw(); });
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