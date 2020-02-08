class BCSPathConfigAllLeft extends PathConfig {
  constructor() {  super();  }

  setup() {
    super.setup();

  // Setup map for this path
    currentLocationConfig.mapImage          = "Location-BCS/bcsMapAllLeft.png";
    currentLocationConfig.mapImageSatellite = "Location-BCS/bcsMapSatelliteAllLeft.png";
    currentLocationConfig.toggleImage();
    
  // First create base paths and then special paths
    BCSCreatePathsBase();
  
    createParkingLine(450, 185,  885, 185, 21, [], ["E Enter", "End"], "1st Parking Line", 0, true, true, 1.5*Math.PI/4, -1.5*Math.PI/4, 2, 0, 2, 2)
    pathTransitions.push(new PathTransition(findPathByNames(["1st Parking Line", "End"]),       findPathByNames(["Fourth Exit Inner Lane", "Start"]), []));
    pathTransitions.push(new PathTransition(findPathByNames(["Fourth Exit Inner Lane", "End"]), findPathByNames(["Exit Cross Portola", "End"]),
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
    // Where can I move to?
      var validPathTransitions = [];
      var currentPriority = Math.floor(document.getElementById("sliderCarSpacing").value/25);
      if (currentCar.currentPath != null) validPathTransitions = currentCar.currentPath.getOpenPathTransitions(currentPriority);

    // Check 1: Do I have ANY valid places to go?
      if(validPathTransitions.length === 0) return null;

    // Check 2: Do Special Checks for this PathConfig

      // 2.1: I'm at the exit? Which way should I turn?
      //      Factors: Am I still dropping off? If so, go left. Else, choose based on the direction ratio slider.
      if (currentCar.currentPath === findPathByNames(["Fourth Exit Inner Lane", "End"])) {
        var directionRatioSlider = document.getElementById("sliderDirectionRatio").value;
        if(currentCar.passengerCount > 0) return currentCar.canIGoToPathName("Exit Cross Portola", validPathTransitions);
        if (getRandomInt(100) < directionRatioSlider ) return currentCar.canIGoToPathName("Right Exit", validPathTransitions);
        else  return currentCar.canIGoToPathName("Exit Cross Portola", validPathTransitions);
      }

    // Check 3: If we didn't find anything special, just do the base checks for this route and return that
    return BCSSelectFromNextPathOptionsBase(currentCar, validPathTransitions);
  }
}



































      // 2.1: I'm at the first parking lot line. Should I turn in?
      //      Factors: Am I done dropping off? Do I want to park? Does the parking lot look full?
      /*if (currentCar.currentPath === findPathByNames(["Third Exit Inner Lane", "End"])) {
        var spotDropOffPathsInThisLine = paths.filter(p => p.types.includes("spotEnter") && p.types.includes("dropoff") && p.name.includes("1st Parking Line") && !p.isOccupiedByExtraParkedCar());

        var openSpotDropOffPathsInThisLine = spotDropOffPathsInThisLine.filter(p => p.currentCar === null);

        if (currentCar.passengerCount === 0 
            || openSpotDropOffPathsInThisLine.length / spotDropOffPathsInThisLine.length < .1)            
          return currentCar.canIGoToPathName("Fourth Exit Inner Lane", validPathTransitions);
        else
          return currentCar.canIGoToPathName("1st Parking Line", validPathTransitions);
      }
      */