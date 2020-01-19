//////////////////////////////////////////////////////////////////////////////////////////
// 
// EXECUTION
//
//////////////////////////////////////////////////////////////////////////////////////////



setupSliders();
createPaths();

createPathTransitions();
createCarFleet();
resetSimulation();
runSimulation();
//createCarFleetFillAllPaths();
//createCarFleetRandom();

// Call Debug functions

consoleLogAllPaths();
consoleLogAllPathTransitions();


var setAverageSpeed = function() {
  carFleet.forEach(e => e.setAverageSpeed());
}