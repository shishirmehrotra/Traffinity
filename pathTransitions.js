//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH TRANSITIONS

var PathTransition = function(fromPath, toPath, dependentPaths) {
// Define properties
  this.fromPath = fromPath;
  this.toPath = toPath;
  this.dependentPaths = dependentPaths;

// Define functions
  this.isAvailable = function(priority) {
    var available = true;
    
    if(this.toPath.currentCar != null) return false;

    this.dependentPaths.forEach(function (e) {
      if(e["priority"] <= priority && e["path"].currentCar != null) 
          available = false; 
    });

    return available;

  }

  this.addImplicitPathTransitions = function () {
    var level1Paths = this.toPath.getNextPathOptions();

    var level2Paths = [];
    level1Paths.forEach(function(p){
      p.getNextPathOptions().forEach(function(e) {
        if(!level2Paths.includes(e)) {level2Paths.push(e)}})
    });

    var level3Paths = [];
    level2Paths.forEach(function(p){
      p.getNextPathOptions().forEach(function(e) {
        if(!level3Paths.includes(e)) {level3Paths.push(e)}})
    });

    level1Paths.forEach(p => this.dependentPaths.push({"path": p, "priority": 1}));
    level2Paths.forEach(p => this.dependentPaths.push({"path": p, "priority": 2}));
    level3Paths.forEach(p => this.dependentPaths.push({"path": p, "priority": 3}));



  }


  this.consoleLog = function () {
    var string = "From: " + this.fromPath.id;
    if(this.fromPath.name != null) string += " " + this.fromPath.name + " ";
    string += " To: " + this.toPath.id 
    if(this.toPath.name != null) string += " " + this.toPath.name + " "; 
    string += " [";
    this.dependentPaths.forEach(function(e)
      { 
        string += e["path"].id + e["priority"];
        });
    string += "]";
    console.log(string);
  }
};
