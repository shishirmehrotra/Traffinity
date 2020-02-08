//////////////////////////////////////////////////////////////////////////////////////////
//
// BCS-Simple
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// BCSPathConfigSimple Object

class BCSPathConfigExitRight extends PathConfig {
  constructor() {
    super();

  }

  setup() {
    super.setup();
    BCSCreatePathsBase();

    createParkingLine(450, 185,  885, 185, 21, [],          ["E Enter", "End"],        "1st Parking Line",               0, true, true, 1.5*Math.PI/4, -1.5*Math.PI/4, 2, 0, 2, 2)
    pathTransitions.push(new PathTransition(findPathByNames(["1st Parking Line", "End"]),          findPathByNames(["Fourth Exit Inner Lane", "Start"]), []));
    

    runSimulation();
  // Setup math for this path
    currentLocationConfig.mapImage          = "Location-BCS/bcsMap.png";
    currentLocationConfig.mapImageSatellite = "Location-BCS/bcsMapSatellite.png";
    currentLocationConfig.toggleImage();  
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
          return currentCar.canIGoToPathName("Right Exit", validPathTransitions);
      }

    // Check 3: If we didn't find anything special, just do the base checks for this route and return that

    return BCSSelectFromNextPathOptionsBase(currentCar, validPathTransitions);
  }
  
}



