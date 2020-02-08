//////////////////////////////////////////////////////////////////////////////////////////
// 
// DEBUG FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////

function consoleLogAllPaths() {
  console.log("paths.displayString");
  paths.forEach(function (e) { console.log(e.displayString); });
}

function consoleLogAllPathTransitions() {
  console.log("pathsTransitions");
    //console.log(JSON.stringify(pathTransitions));
  pathTransitions.forEach(function (e) { 
    e.consoleLog();
    console.log(e.fromPath.id + " " + e.toPath.id); 
    });
}