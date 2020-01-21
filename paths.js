//////////////////////////////////////////////////////////////////////////////////////////
//
// PATH

var Path = function (id, x1, y1, x2, y2, types, name) {
// Define properties
  this.name = name;
  this.id = id;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.types = types;
  this.currentCar = null;
  this.displayString = "";
  this.displayStringLong = "";
  var thisPath = this;
  this.rotation = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  // this.rotation = Math.atan((y2 - y1)/(x2 - x1)) * 180 / Math.PI;
  this.rotationRadians = Math.atan2(y2 - y1, x2 - x1);
  //this.rotationRadians = Math.atan((y2 - y1)/(x2 - x1));
  this.centerX = (x2 + x1) / 2;
  this.centerY = (y2 + y1) / 2;


// Define drawing components
  this.arrow = new Konva.Arrow({
    x: 0,
    y: 0,
    points: [this.x1, this.y1, this.x2, this.y2],
    pointerLength: 5,
    pointerWidth: 5,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4,
    hitStrokeWidth: 20
  });
  pathsLayer.add(this.arrow);

  var r = 10;
  var initialTheta = Math.PI / 4;

  this.arrowLabelGroup = new Konva.Group({
     x: this.centerX - (45 / 2),
     y: this.y1 + 10,   
  });

  var marginAroundLabel = 2;

  this.arrowLabelBackground = new Konva.Rect({
    //x: this.centerX - (45 / 2),
    //y: this.centerY - thisPath.arrowLabel.height() / 2,
    x: 0,
    y: 0,
    fill: 'white',
    width: 50,
    height: 10,
    cornerRadius: 5, 
    opacity: 0.5
  });
  this.arrowLabelGroup.add(this.arrowLabelBackground);
  
  this.arrowLabel = new Konva.Text({
    //x: this.centerX - (45 / 2),
    //y: this.y1 + 10,
    x: marginAroundLabel,
    y: marginAroundLabel,
    text: this.displayString,
    fontSize: 7,
    lineHeight: 1.4,
    //fontFamily: 'Roboto',
    fontFamily: 'Yanone+Kaffeesatz',
    fill: 'black',
    //scaleY: scaleY      
  });
  this.arrowLabelGroup.add(this.arrowLabel);


  //this.arrowLabel.x(this.arrowLabelBackground.x()+marginAroundLabel);
  //this.arrowLabel.y(this.arrowLabelBackground.y()+marginAroundLabel);

  this.arrowLabel.width(this.arrowLabelBackground.width()-marginAroundLabel*2);
  this.arrowLabelBackground.height(thisPath.arrowLabel.height() + marginAroundLabel*2);
  this.arrowLabelGroup.y(this.centerY - thisPath.arrowLabel.height() / 2);



  //this.arrowLabelGroup.rotate(this.rotation);
  /*if (this.rotation >= 180) {
    this.arrowLabelGroup.rotate(180);
    //this.arrowLabel.scale({ x: -1, y: -1 });
  }
  */
  
  

  //pathNamesLayer.add(this.arrowLabelBackground);
  //pathNamesLayer.add(this.arrowLabel);
  pathNamesLayer.add(this.arrowLabelGroup);
  //this.arrowLabel.hide();
  //this.arrowLabelBackground.hide();
  this.arrowLabelGroup.hide();

// Define functions for drawing and selection
  this.selectPath = function () {
    if (selectedPath != null) {
      selectedPath.unselectPath();
    }
    else {
      selectedPath = this;
      //console.log("mousedown on " + thisPath.id);
      thisPath.arrow.stroke('white');
      //thisPath.arrowLabel.show();
      thisPath.arrowLabelGroup.show();

      //thisPath.arrowLabelBackground.show();
      thisPath.arrowLabelBackground.fill('white');
      thisPath.getPathTransitions().forEach(e => e.toPath.highlightAsNextPathOptions());

      pathNamesLayer.batchDraw();
    }
  };

  this.unselectPath = function () {
    selectedPath = null;
    //console.log("mouseleave on " + thisPath.id);
    thisPath.arrow.stroke('black');
    //thisPath.arrowLabel.hide();
    //thisPath.arrowLabelBackground.hide();
    thisPath.arrowLabelGroup.hide();
    thisPath.getPathTransitions().forEach(e => e.toPath.unhighlightAsNextPathOptions());

    pathNamesLayer.batchDraw();
  };

  this.highlightAsNextPathOptions = function () {
    thisPath.arrow.stroke('green');
    thisPath.arrowLabelBackground.fill('lightgreen');
    //thisPath.arrowLabel.show();
    //thisPath.arrowLabelBackground.show();
    thisPath.arrowLabelGroup.show();

    pathNamesLayer.batchDraw();
  }

  this.unhighlightAsNextPathOptions = function () {
    thisPath.arrow.stroke('black');
    thisPath.arrowLabelGroup.hide();
    //thisPath.arrowLabel.hide();
    //thisPath.arrowLabelBackground.hide();
    pathNamesLayer.batchDraw();
  }

  this.highlightAsDependentPathOptions = function (priority) {
    switch (priority) {
      case 1:
        thisPath.arrow.stroke('red'); break;
      case 2:
        thisPath.arrow.stroke('orange'); break;
      case 3:
        thisPath.arrow.stroke('yellow'); break;
      default:
        thisPath.arrow.stroke('blue');
    }
    pathNamesLayer.batchDraw();
  }

  this.unhighlightAsDependentPathOptions = function () {
    thisPath.arrow.stroke('black');
    pathNamesLayer.batchDraw();
  }

  this.arrowLabelGroup.on('mousedown', function () {
    thisPath.selectPath();
  });

  this.arrow.on('mousedown', function () {
    thisPath.selectPath();
  });
  /*
  this.arrowLabelBackground.on('mousedown', function () {
    thisPath.unselectPath();
  });
  */

  this.arrowLabelGroup.on('mouseenter', function () {
    if (selectedPath != null) {
      // Am I a next path option?
      // Method 1: Check color (am I green)
      //console.log("my color is " + thisPath.arrow.stroke());
      // Method 2: check if selectedPath.getPathTransitions() includes me as a to path
      //if(selectedPath.getPathTransitions().some(e => e.ToPath === thisPath))

      if (thisPath.arrow.stroke() === "green") {
        // Find the relevant path transition
        var selectedPathTransition;

        pathTransitions.forEach(function (e) {
          if (e.fromPath === selectedPath && e.toPath === thisPath) selectedPathTransition = e;
        });

        selectedPathTransition.dependentPaths.forEach(e => e["path"].highlightAsDependentPathOptions(e["priority"]));
      }
    }
  });

  this.arrowLabelGroup.on('mouseleave', function () {
    if (selectedPath != null) {
      // Am I a next path option?
      // Method 1: Check color (am I green)
      //console.log("my color is " + thisPath.arrow.stroke());
      // Method 2: check if selectedPath.getPathTransitions() includes me as a to path
      //if(selectedPath.getPathTransitions().some(e => e.ToPath === thisPath))

      if (thisPath.arrow.stroke() === "green") {
        // Find the relevant path transition
        var selectedPathTransition;

        pathTransitions.forEach(function (e) {
          if (e.fromPath === selectedPath && e.toPath === thisPath) selectedPathTransition = e;
        });

        selectedPathTransition.dependentPaths.forEach(e => e["path"].unhighlightAsDependentPathOptions());
      }
    }
  });


  /*this.arrow.on('mouseleave', function() {

  });*/

  // Types: Dropoff, Parking spot, Start, End, RightTurn, LeftTurn, ...

  // Draw function

  this.setDisplayStrings = function () {
    this.displayString = "";

    var newString = "";
    if (this.name != null) newString +=  this.name + " ";
    newString += this.id;
    newString += " " + types.join(" ");
    //newString += ": ";
    //pathTransitions.filter(e => e.fromPath === this).forEach(e => newString += e.toPath.id + "|");
    // newString += " " +  this.rotationRadians.toPrecision(3);
    //newString += " " +  this.rotation.toPrecision(3);
    this.displayString = newString;
    this.arrowLabel.text(this.displayString);
    // To Do: Add displayStringLong when we have dependent paths
    this.reformatLabel();
  }


  this.reformatLabel = function () {
    this.arrowLabelBackground.height(thisPath.arrowLabel.height() + marginAroundLabel*2);
    this.arrowLabelGroup.y(this.centerY - thisPath.arrowLabel.height() / 2);

    //        0000this.arrowLabelGroup.rotate(this.rotation);
    /*if (this.rotation >= 180) {
      this.arrowLabelGroup.rotate(180);
      //this.arrowLabel.scale({ x: -1, y: -1 });
    }
    */
  }

  this.draw = function () {

    this.setDisplayStrings();
    pathsLayer.draw();
    pathNamesLayer.draw();
  }

  // Define functions for execution
  this.clearCurrentCar = function () {
    this.currentCar = null;
    //this.arrow.stroke('black');
    pathsLayer.draw();
    pathNamesLayer.draw();
  };



  this.getOpenPathTransitions = function (priority) {
    var openTransitions = [];

    pathTransitions.forEach(function (e) {
      if (e.fromPath === thisPath && e.isAvailable(priority)) openTransitions.push(e);
    });

    return openTransitions;
  }

  this.getPathTransitions = function () {
    var transitions = [];

    pathTransitions.forEach(function (e) {
      if (e.fromPath === thisPath) transitions.push(e);
    });

    return transitions;
  }

  this.getNextPathOptions = function () {
    var returnPaths = [];
    this.getPathTransitions().forEach(p => returnPaths.push(p.toPath));
    return returnPaths;
  }


};