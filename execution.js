//////////////////////////////////////////////////////////////////////////////////////////
// 
// EXECUTION
//
//////////////////////////////////////////////////////////////////////////////////////////

// Setup Global Variables
var mapContainer = document.getElementById("mapContainer");
var pathsCanvas = document.getElementById("pathsCanvas");
var carFleet = [];
var paths = [];
var pathTransitions = [];
var carGenerator = new CarGenerator();
var resultsTracker = new ResultsTracker();


// Setup Konva components for drawing
var pathsStage = new Konva.Stage({
  container: 'pathsCanvasDiv',
  width: 1400,
  height: 500
});
var pathsLayer = new Konva.Layer();
var pathNamesLayer = new Konva.Layer();

// add the layer to the stage
pathsStage.add(pathsLayer);
pathsStage.add(pathNamesLayer);

/*var carsStage = new Konva.Stage({
  container: 'carsCanvasDiv',
  width: 1400,
  height: 500
});*/
var carsLayer = new Konva.Layer();

pathsStage.add(carsLayer);

var selectedPath = null;

/*
pathsLayer.on('click', function(e) {
  //if (selectedPath != null) selectedPath.unselectPath();
  //console.log("clicked on " + e.target);
}
*/

setupSliders();
createPaths();

createPathTransitions();
//createCarFleet();
//resetSimulation();
runSimulation();
//createCarFleetFillAllPaths();
//createCarFleetRandom();

// Call Debug functions

consoleLogAllPaths();
consoleLogAllPathTransitions();

