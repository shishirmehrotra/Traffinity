var BCSSelectFromNextPathOptionsBase = function(currentCar, validPathTransitions) {
  
    // Check 1: Am I in a special decision point?

      // 1.1: I'm coming from the East, and am at the parking lot entrance. Should I turn in?
      //      Factors: Am I trying to dropoff? And if I am, do I prefer to dropoff on the street? 

      if (currentCar.currentPath === findPathByNames(["E Begin", "End"])) {
        if (currentCar.passengerCount > 0) return currentCar.canIGoToPathName("E Enter", validPathTransitions);
        else                         return currentCar.canIGoToPathName("Second Inner East Portola", validPathTransitions);
      }

      // 1.2: I'm on the angle that leads into the second parking lot line. Should I turn in?
      //      Factors: Do I want to park?
      if (currentCar.currentPath === findPathByNames(["Angle Into Second Parking Line", "End"])) {
        var parkingSpotPrefSlider = document.getElementById("sliderParkingSpotPreferred").value;
        if (getRandomInt(100) < parkingSpotPrefSlider ) return currentCar.canIGoToPathName("2nd Parking Line", validPathTransitions);
        else                                            return currentCar.canIGoToPathName("Angle Into Inner Curb Lane", validPathTransitions);
      }

      // 1.3: I'm at the second dropoff line. Should I turn in?
      //      Factors: Am I done with dropping off or parking? Is all the dropoff spots full?
      if (currentCar.currentPath === findPathByNames(["Angle Into Inner Curb Lane", "End"])) {
        if (currentCar.passengerCount === 0) return currentCar.canIGoToPathName("Inner Curb Lane ", validPathTransitions);
        else                           return currentCar.canIGoToPathName("Angle Between Curb Lanes", validPathTransitions);
      }
      // 1.4: I'm at the first dropoff line. How far in should I go?
      //      Factors: Is the pull forward slider high? Should I go all the way down the line?


      // 1.5: I'm coming from the West, and am at the parking lot entrance. Should I turn in?
      //      Factors: Am I trying to dropoff? 
      if (currentCar.currentPath === findPathByNames(["Second Outer West Portola", "End"])) {
        if (currentCar.passengerCount > 0) return currentCar.canIGoToPathName("Outer Entrance", validPathTransitions);
        else                         return currentCar.canIGoToPathName("Third Outer West Portola", validPathTransitions);
      }
      
      // 1.6: I can turn into a parking spot, should I?
      //      Factors: Am I trying to dropoff?
      var validSpotTransitions    = validPathTransitions.filter(pt => pt.toPath.types.includes("spotEnter") && pt.toPath.types.includes("dropoff")); 

      if (validSpotTransitions.length > 0) {

        if(currentCar.passengerCount > 0) {
          for(var i = 0; i < validSpotTransitions.length; i++) 
            if(currentCar.shouldIspotDropOffHere(validSpotTransitions[i].toPath))
              return currentCar.canIGoToPathName(validSpotTransitions[i].toPath.name, validPathTransitions);
        }

        var validNonSpotTransitions = validPathTransitions.filter(pt => !(pt.toPath.types.includes("spotEnter") && pt.toPath.types.includes("dropoff")));
        if(validNonSpotTransitions.length > 0) return currentCar.canIGoToPathName(validNonSpotTransitions[0].toPath.name, validPathTransitions);
        else return null;
      }

      // Check 2: I guess I'm not at a special decision point, so let's just pick randomly?
      var random = getRandomInt(validPathTransitions.length);
      return validPathTransitions[random].toPath;

    // Guess we didn't find any valid paths, so we'll just return null (and stay put)
    return null;
}

var BCSCreatePathsBase = function() {
  var previousPath;
  // createPathLine(x1, y1, x2, y2, numberOfSegments, types, incomingPathName, pathLineName, startIndex, includeStart, includeEnd);

    clearMap(); 

  createPathLine(   0,  70,  450,  70, 9, [],          null,                                      "E Begin",                        0, true, true)
  createPathLine( 450,  70,  450, 185, 3, [],          ["E Begin",  "End"],                       "E Enter",                        0, true, true)
  createPathLine( 450, 185,  450, 270, 3, [],          ["E Enter", "End"],                        "Exit First Parking Line",        0, true, true)
  createPathLine( 450, 270,  470, 290, 1, [],          ["Exit First Parking Line", "End"],        "Angle Into Second Parking Line", 0, false, true)
  createPathLine( 470, 290,  580, 400, 4, [],          ["Angle Into Second Parking Line", "End"], "Angle Into Inner Curb Lane",     0, true, true)
  
  createParkingLine( 580, 400,  850, 400, 15, [],          ["Angle Into Inner Curb Lane", "End"],     "Inner Curb Lane",                0, true, true, -1.5*Math.PI/4, null, 3, null, 1, null);
  createPathLine( 580, 400,  620, 440, 2, [],          ["Angle Into Inner Curb Lane", "End"],     "Angle Between Curb Lanes",       0, true, true);
  createPathLine( 620, 440,  850, 440, 5, ["dropoff", "curb"], ["Angle Between Curb Lanes", "End"],       "Outer Curb Lane",                0, true, true);
  createPathLine( 850, 440,  850, 400, 2, [],          ["Outer Curb Lane", "End"],                "First Exit Inner Lane",          0, true, true);
  createPathLine( 850, 400,  860, 290, 3, [],          ["First Exit Inner Lane", "End"],          "Second Exit Inner Lane",         0, true, true);
  createPathLine( 860, 290,  875, 185, 2, [],          ["Second Exit Inner Lane", "End"],         "Third Exit Inner Lane",          0, true, true);
  createPathLine( 875, 185,  885,  80, 2, [],          ["Third Exit Inner Lane", "End"],          "Fourth Exit Inner Lane",         0, true, true);
  createPathLine( 885,  80,  890,  20, 1, [],          null,         "Exit Cross Portola",             0, false, true);
  createPathLine( 890,  20,  440,  20, 9, [],          ["Exit Cross Portola", "End"],             "Second Outer West Portola",      0, true, true);
  createPathLine( 440,  20,  -10,  20, 9, [],          ["Second Outer West Portola", "End"],      "Third Outer West Portola",       0, true, true);
  createPathLine( 450,  20,  450,  70, 1, [],          ["Second Outer West Portola", "End"],      "Outer Entrance",                 0, false, true);
  createPathLine(1190,  70,  890,  20, 6, [],          null,                                      "W Begin",                        0, true, true);
  createPathLine( 885,  80, 1185, 110, 7, [],          null,                                      "Right Exit",                     0, true, true);
  createPathLine( 450,  70,  885,  80, 9, [],          ["E Begin", "End"],                        "Second Inner East Portola",      0, true, true);

  createParkingLine( 470, 290,  860, 290, 21, [],       ["Angle Into Second Parking Line", "End"], "2nd Parking Line",               0, true, true, 1.5*Math.PI/4, -1.5*Math.PI/4, 6, 1, 1, 2);

  createPathLine( 850, 440,  885, 400, 2, [],          ["Outer Curb Lane", "End"],                "First Exit Outer Lane",          0, true, true);
  createPathLine( 885, 400,  905, 185, 6, ["dropoff", "curb"],          ["First Exit Outer Lane", "End"],          "Second Exit Outer Lane",         0, true, true);
  createPathLine( 905, 185, 925, 85, 3, [],          ["Second Exit Outer Lane", "End"],          "Third Exit Outer Lane",         0, true, true);

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
    
  pathTransitions.push(new PathTransition(findPathByNames(["Third Exit Outer Lane", "End"]),         findPathByNames(["Right Exit", "1"]), 
                  [{ "path": findPathByNames(["Right Exit", "Start"]),   "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "End"]),     "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "7"]),     "priority": 3 },]));


 
  pathTransitions.push(new PathTransition(findPathByNames(["Angle Into Second Parking Line", "End"]), findPathByNames(["2nd Parking Line", "Start"]), [])); 
  pathTransitions.push(new PathTransition(findPathByNames(["2nd Parking Line", "End"]),               findPathByNames(["Third Exit Inner Lane", "Start"]), 
                  [{ "path": findPathByNames(["Second Exit Inner Lane", "End"]),       "priority": 3 }]));
  
  pathTransitions.push(new PathTransition(findPathByNames(["Angle Into Inner Curb Lane", "End"]),     findPathByNames(["Inner Curb Lane", "Start"]), []));
  pathTransitions.push(new PathTransition(findPathByNames(["Inner Curb Lane", "End"]),                findPathByNames(["Second Exit Inner Lane", "Start"]), []));
  
  var wEndPath = findPathByNames(["Third Outer West Portola", "End"]); wEndPath.types.push("end");
  var eEndPath = findPathByNames(["Right Exit", "End"]); eEndPath.types.push("end");

  entrancePaths.push(findPathByNames(["W Begin", "Start"])); 
  entrancePaths.push(findPathByNames(["E Begin", "Start"])); 

  pathTransitions.forEach(p => p.addImplicitPathTransitions());
  paths.forEach(function (elem) { elem.draw(); });
}