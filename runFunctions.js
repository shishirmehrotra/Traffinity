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

function runSimulation() {
  var timeScale = (100-document.getElementById("sliderTimeWarp").value)*0.5;

  console.log("time scale: " + timeScale);

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
    carFleetAssignRandomPaths();
}

function nextStep() {
  carGenerator.generateCars();
  carFleet.forEach(function (elem) {
    elem.nextStep()
  })
}