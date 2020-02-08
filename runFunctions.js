//////////////////////////////////////////////////////////////////////////////////////////
// 
// RUN FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////


function chooseLocation(value) {
  switch(value) {
    case "BCS":
      currentLocationConfig = new BCSLocationConfig();
      currentPathConfig = new BCSPathConfigToday();
      resetSimulation();
      break;
    case "SFO":
      currentLocationConfig = new SFOLocationConfig();
      currentPathConfig = new SFOPathConfigToday(); resetSimulation();
      break;
    default:
      currentLocationConfig = new BCSLocationConfig();
      break;
  }
  
  currentLocationConfig.setup();
}

//TODO: Get ride of separate curb/parking sliders
function setSliderCurbPreferred() {
 /*
  var sliderCurbPreferredValue = document.getElementById("sliderCurbPreferred").value;
  document.getElementById("sliderParkingSpotPreferred").value = 100 - sliderCurbPreferredValue;
  */
}
function setSliderParkingSpotPreferred() {
/*
  var sliderParkingSpotPreferredValue = document.getElementById("sliderParkingSpotPreferred").value;
  document.getElementById("sliderCurbPreferred").value = 100 - sliderParkingSpotPreferredValue;
*/
}


// TODO: Location Specific Slider implementations
function setExtraParkedCars(x) {var e = document.getElementById("sliderExtraParkedCars"); e.value = x === null ? 25 : x; fireOnChangeForElement(e);}
function setCustomAmountOfCars(x)    {var e = document.getElementById("sliderAmountOfCars");    e.value = x === null ? 25 : x; fireOnChangeForElement(e);}
function setDropoffDuration(x) {var e = document.getElementById("sliderTaskTime");        e.value = x === null ? 10 : x; fireOnChangeForElement(e);}
function setRatio() {carGenerator.setRatio();}
function setAmountOfCars() {carGenerator.setAmountOfCars();}


var setAverageSpeed = function() {
  carFleet.forEach(e => e.setAverageSpeed());
}

function showPathLines() {
  if (document.getElementById("checkboxShowPathLines").checked === true) {
   pathsLayer.show();
  }
  else {
    pathsLayer.hide();
  }
};


var timer;
var lastTime = +new Date;

function runSimulation() {
  var timeScale = Math.max((100-document.getElementById("sliderTimeWarp").value*2)*10,1);

  console.log("time scale: " + timeScale);

  carGenerator.generateExtraParkedCars();


  window.clearInterval(timer);
  timer = window.setInterval(nextStep, timeScale);

}

function pauseSimulation() {
  window.clearInterval(timer);
}

function resetSimulation() {
  resultsTracker.clearResults();
  //createPaths();
  currentPathConfig.setup();
}

function nextStep() {
  carGenerator.generateCars();
  carFleet.forEach(function (elem) {
    elem.nextStep()
  })

  // DEBUG
  /*
  time = +new Date;
  console.log("Time elapsed = " + (time-lastTime));
  lastTime = time;
  */
}