//////////////////////////////////////////////////////////////////////////////////////////
//
// BCS-Expand Dropoff
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// BCSPathConfigExpandDropoff Object

class BCSPathConfigExpandDropoff extends PathConfig {
  constructor() {
    super();

  }

  setup() {
    super.setup();
  // Setup math for this path
    currentLocationConfig.mapImage          = "Location-BCS/bcsMap.png";
    currentLocationConfig.mapImageSatellite = "Location-BCS/bcsMapSatellite.png";
    currentLocationConfig.toggleImage();
  // First create base paths and then special paths
    BCSCreatePathsBase();
    findPathsByNamePrefix("Angle Between Curb Lanes").forEach( function(p) {p.types.push("dropoff"); p.types.push("curb"); p.setDisplayStrings();});
    findPathsByNamePrefix("Angle Into Inner Curb Lane").forEach( function(p) {p.types.push("dropoff"); p.types.push("curb"); p.setDisplayStrings();});
    createParkingLine(885, 185,  450, 185, 21, [],          ["Third Exit Inner Lane", "End"],        "1st Parking Line",               0, true, true, -2.5*Math.PI/4, 2.5*Math.PI/4, 0, 1, 2, 3)
    pathTransitions.push(new PathTransition(findPathByNames(["Third Exit Inner Lane", "End"]),          findPathByNames(["1st Parking Line", "Start"]), []));
    pathTransitions.push(new PathTransition(findPathByNames(["1st Parking Line", "End"]),               findPathByNames(["Exit First Parking Line", "Start"]), []));
    pathTransitions.push(new PathTransition(findPathByNames(["Fourth Exit Inner Lane", "End"]),         findPathByNames(["Exit Cross Portola", "End"]), 
                  [{ "path": findPathByNames(["Second Inner East Portola", "End"]),   "priority": 1 },
                   { "path": findPathByNames(["Second Inner East Portola", "7"]),     "priority": 2 },
                   { "path": findPathByNames(["Second Inner East Portola", "6"]),     "priority": 3 },
                   { "path": findPathByNames(["Right Exit", "1"]),                    "priority": 3 },
                   { "path": findPathByNames(["W Begin", "End"]),                     "priority": 1 },
                   { "path": findPathByNames(["W Begin", "4"]),                       "priority": 2 },
                   { "path": findPathByNames(["W Begin", "3"]),                       "priority": 3 }
                   ]));
  // Everything's setup now start running
    runSimulation();
  }

  selectFromNextPathOptions(currentCar) {
    
    // Goal: I've decided to move, yah! Where should I move to? Let's pick a path and return it!

    // Where can I move to?
      var validPathTransitions = [];
      var currentPriority = Math.floor(document.getElementById("sliderCarSpacing").value/25);
      if (currentCar.currentPath != null) validPathTransitions = currentCar.currentPath.getOpenPathTransitions(currentPriority);

    // Check 1: Do I have ANY valid places to go?
      if(validPathTransitions.length === 0) return null;

    // Check 2: Do Special Checks for this PathConfig

      // 2.1: I'm at the first parking lot line. Should I turn in?
      //      Factors: Am I done dropping off? Do I want to park? Does the parking lot look full?
      if (currentCar.currentPath === findPathByNames(["Third Exit Inner Lane", "End"])) {
        var spotDropOffPathsInThisLine = paths.filter(p => p.types.includes("spotEnter") && p.types.includes("dropoff") && p.name.includes("1st Parking Line") && !p.isOccupiedByExtraParkedCar());

        var openSpotDropOffPathsInThisLine = spotDropOffPathsInThisLine.filter(p => p.currentCar === null);

        if (currentCar.passengerCount === 0 
            || openSpotDropOffPathsInThisLine.length / spotDropOffPathsInThisLine.length < .1)            
          return currentCar.canIGoToPathName("Fourth Exit Inner Lane", validPathTransitions);
        else
          return currentCar.canIGoToPathName("1st Parking Line", validPathTransitions);
      }

      // 2.2: I'm at the exit? Which way should I turn?
      //      Factors: Am I still dropping off? If so, go left. Else, choose based on the direction ratio slider.
      if (currentCar.currentPath === findPathByNames(["Fourth Exit Inner Lane", "End"])) {
        //var directionRatioSlider = document.getElementById("sliderDirectionRatio").value;
        //if (getRandomInt(100) < directionRatioSlider ) return currentCar.canIGoToPathName("Right Exit", validPathTransitions);
        //else  
         return currentCar.canIGoToPathName("Exit Cross Portola", validPathTransitions);
      }

    // Check 3: If we didn't find anything special, just do the base checks for this route and return that

    return BCSSelectFromNextPathOptionsBase(currentCar, validPathTransitions);
  }
}



