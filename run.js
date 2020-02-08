//////////////////////////////////////////////////////////////////////////////////////////
// 
// EXECUTION
//
//////////////////////////////////////////////////////////////////////////////////////////

// Setup Global Variables
var mapContainer = document.getElementById("mapContainer");

var carFleet = [];
var paths = [];
var pathTransitions = [];
var entrancePaths = [];
var currentLocationConfig = new BCSLocationConfig();
var currentPathConfig = new BCSPathConfigToday();


// Setup Konva components for drawing
var pathsStage = new Konva.Stage({container: 'pathsCanvasDiv', width: 1400, height: 500});
var pathsLayer = new Konva.Layer();
var pathNamesLayer = new Konva.Layer();
pathsStage.add(pathsLayer);
pathsStage.add(pathNamesLayer);
var carsLayer = new Konva.Layer();
pathsStage.add(carsLayer);

var selectedPath = null;


//createCarFleet();
//resetSimulation();
//createCarFleetFillAllPaths();
//createCarFleetRandom();
// Call Debug functions

var carGenerator = new CarGenerator();
var resultsTracker = new ResultsTracker();
currentLocationConfig.setup();
currentPathConfig.setup();

//createPaths();
//createPathTransitions();

runSimulation();

consoleLogAllPaths();
consoleLogAllPathTransitions();