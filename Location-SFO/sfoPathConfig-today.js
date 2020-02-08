//////////////////////////////////////////////////////////////////////////////////////////
//
// SFO-Today
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// AFOPathConfigSimple Object

class SFOPathConfigToday extends PathConfig {
  constructor() {
    super();

  }

  setup() {
    super.setup();
  // Set the correct map image
  // Setup math for this path
    currentLocationConfig.mapImage          = "Location-SFO/sfoMap.png";
    currentLocationConfig.mapImageSatellite = "Location-SFO/sfoMapSatellite.png";
    currentLocationConfig.toggleImage();


  // First create base paths and then special paths
    SFOCreatePathsBase();
    

  // Everything's setup now start running
    runSimulation();
  }

  selectFromNextPathOptions(currentCar) {
    
    // Goal: I've decided to move, yah! Where should I move to? Let's pick a path and return it!

    // Where can I move to?
      var validPathTransitions = [];
      validPathTransitions = currentCar.currentPath.getOpenPathTransitions(0);
   /*  
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

    */
    return SFOSelectFromNextPathOptionsBase(currentCar, validPathTransitions);
  }
}



