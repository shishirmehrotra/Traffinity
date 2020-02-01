//////////////////////////////////////////////////////////////////////////////////////////
// 
// RUN FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function handleConfigureClick(myRadio) {
  //alert('New value: ' + myRadio.value);
  if (myRadio.value === "Run") {
    document.getElementById("runPanels").hidden = false;
    document.getElementById("configurePanels").hidden = true;
  }
  if (myRadio.value === "Configure") {
    document.getElementById("runPanels").hidden = true;
    document.getElementById("configurePanels").hidden = false;
  }
}

function setSliderCurbPreferred() {
  var sliderCurbPreferredValue = document.getElementById("sliderCurbPreferred").value;
  document.getElementById("sliderParkingSpotPreferred").value = 100 - sliderCurbPreferredValue;
}
function setSliderParkingSpotPreferred() {
  var sliderParkingSpotPreferredValue = document.getElementById("sliderParkingSpotPreferred").value;
  document.getElementById("sliderCurbPreferred").value = 100 - sliderParkingSpotPreferredValue;
}

function setExtraParkedCars(value) {var e = document.getElementById("sliderExtraParkedCars"); e.value = value; fireOnChangeForElement(e);}
function setAmountOfCars(value)    {var e = document.getElementById("sliderAmountOfCars");    e.value = value; fireOnChangeForElement(e);}
function setDropoffDuration(value) {var e = document.getElementById("sliderTaskTime");        e.value = value; fireOnChangeForElement(e);}

function fireOnChangeForElement(e) {
  var event = new Event('input', { bubbles: true });
  e.dispatchEvent(event); 
  //e.fireEvent("oninput");
}


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

function showPathNames() {
  if (document.getElementById("checkboxShowPathNames").checked === true) {
   pathNamesLayer.show();
  }
  else {
    pathNamesLayer.hide();
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
  /*
  timer = window.clearTimeout()
  for (var i = 0; i < 2000; i++) {
    timer = window.setTimeout(nextStep, timeScale/30*i, 20);
  }
  */
}

function pauseSimulation() {
  window.clearInterval(timer);
}

function resetSimulation() {
  resultsTracker.clearResults();
  createPaths();
    //carFleetAssignRandomPaths();
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