/////////////////////////////////////////////////////////////////////////////////////////////////////
// CAR


var carColors = [
  "#FF0000",
  "#FF1100",
  "#FF2300",
  "#FF3400",
  "#FF4600",
  "#FF5700",
  "#FF6900",
  "#FF7B00",
  "#FF8C00",
  "#FF9E00",
  "#FFAF00",
  "#FFC100",
  "#FFD300",
  "#FFE400",
  //"#FFF600",
  //"#F7FF00",
  "#E5FF00",
  "#D4FF00",
  "#C2FF00",
  "#B0FF00",
  "#9FFF00",
  "#8DFF00",
  "#7CFF00",
  "#6AFF00",
  "#58FF00",
  "#47FF00",
  "#35FF00",
  "#24FF00",
  "#12FF00", 
  "#00FF00"]


var Car = function (id, passengerCountInitial, type) {

// Define properties of cars
  this.currentPath = null;
  this.id = id;
  this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
  this.ticksSinceLastMove = 0;
  //this.ticksSinceLastMovePrevious = 0;
  this.ticksSinceLastMoveHistory = [];
  //this.color = carColors[carColors.length];
  this.currentRotation = 0;
  this.ticksSinceStartDropoff = 0;
  this.isDroppingOff = false;
  this.passengerCount = passengerCountInitial;
  this.displayString = "";
  this.colorIndex = 0;
  this.showLabel = false;
  this.type = type;
  this.ticksTotal = 0;
  this.ticksWhenDropoffDone = 0;
  var thisCar = this;

// Define Car shapes
  this.group = new Konva.Group({
    x: 0,
    y: 0
  })

  this.carLabel = new Konva.Text({
    //x: this.centerX - (45 / 2),
    //y: this.y1 + 10,
    x: 0,
    y: 15,
    text: this.displayString,
    fontSize: 8,
    lineHeight: 1.4,
    //fontFamily: 'Roboto',
    fontFamily: 'Yanone+Kaffeesatz',
    fontStyle: 'bold',
    fill: 'black',
    //scaleY: scaleY      
  });
  this.group.add(this.carLabel);
  this.carLabel.hide();

  this.setDisplayString = function () {
    this.displayString = "Car ";
    this.displayString += id; 
    //this.displayString += "\nTicks " + this.ticksSinceLastMove 
    //this.displayString += " [" + this.ticksSinceLastMoveHistory + "]"; 
    this.getCarColor();
    //this.displayString += "\nColor " + this.colorIndex;
    //this.displayString += "\nPassengers " + this.passengerCount;
    
    this.displayString += "\nTotal Ticks " + this.ticksTotal;
    this.displayString += "\nTicks when dropoff done " + this.ticksWhenDropoffDone;
    if(this.isDroppingOff) 
      this.displayString += "\nTicks since start dropoff " + this.ticksSinceStartDropoff;
    
    this.carLabel.text(this.displayString);
    //carsLayer.draw();
    //console.log(this.displayString);
  }



  this.carOutline = new Konva.Line({
        points: [ 0,  0, 
                  0, 13, 
                 22, 13, 
                 25,  9,
                 26, 6.5, 
                 25,  4,
                 22, 0  ],
        fill: 'green', stroke: 'black',
        strokeWidth: 1, closed: true, tension: .2
      });
  this.group.add(this.carOutline);

  this.front = new Konva.Line({
        points: [ 15,  1.5, 
                  15, 11.5,
                  17.5, 10.5,
                  19,  6.5,
                  17.5, 2.5
                ],
        fill: 'black', stroke: 'black',
        strokeWidth: .5, closed: true, tension: 0.1
      })
  this.group.add(this.front)

  this.sides = new Konva.Rect({
        x: 1.5,
        y: 1.5,
        width: 14,
        height: 10,
        stroke: 'black',
        strokeWidth: .5,
        //cornerRadius: 1.5
      });
  this.group.add(this.sides);

  this.back = new Konva.Rect({
        x: 1.5,
        y: 1.5,
        width: 2,
        height: 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: .5,
        //cornerRadius: 1
      });
  this.group.add(this.back);

  this.headlightRight = new Konva.Line({
        points: [ 
                 21.5,  10.5, 
                 22.5,  8.5,
                ],
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
        closed: true,
        tension: 0.1
      })
  this.group.add(this.headlightRight)
      
  this.headlightLeft = new Konva.Line({
        points: [ 
                 21.5,  2.5, 
                 22.5,  4.5,
                ],
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
        closed: true,
        tension: 0.1
      })
  this.group.add(this.headlightLeft)

  this.passengerOne = new Konva.Rect({
          x: 4,
          y: 1.5,
          width: 5,
          height: 5,
          fill: 'white',
          stroke: 'black',
          strokeWidth: .5,
          cornerRadius: 7
        });

  this.group.add(this.passengerOne);

  this.passengerTwo = new Konva.Rect({
          x: 4,
          y: 6.5,
          width: 5,
          height: 5,
          fill: 'white',
          stroke: 'black',
          strokeWidth: .5,
          cornerRadius: 7
        });
  this.group.add(this.passengerTwo);

  if(this.passengerCount === 0) {
      this.passengerOne.hide();
      this.passengerTwo.hide();
  }
  if(this.passengerCount === 1) {
      this.passengerOne.hide();
  }
  this.driver = new Konva.Rect({
          x: 10,
          y: 1.5,
          width: 5,
          height: 5,
          fill: 'grey',
          stroke: 'black',
          strokeWidth: .5,
          cornerRadius: 7
        });
  this.group.add(this.driver);

  /*
      var carDoorSlot = new Konva.Rect({
          x: 5,
          y: 13,
          width: 10,
          height: 1,
          fill: 'green',
          stroke: 'green',
          strokeWidth: .5,
      });
      group.add(carDoorSlot);
  */

  this.carDoor = new Konva.Rect({
          x: 15,
          y: 13.5,
          width: 10,
          height: .5,
          fill: 'black',
          stroke: 'black',
          strokeWidth: .5,
          cornerRadius: 7
      });
  this.carDoor.rotate(135);
  this.carDoor.hide();
  this.group.add(this.carDoor);
  this.carDoor.moveToTop();




  carsLayer.add(this.group);
  this.group.on('mousedown', function () {
    if(thisCar.showLabel) {thisCar.carLabel.hide(); thisCar.showLabel = false;}
    else {thisCar.carLabel.show(); thisCar.showLabel = true;}
    carsLayer.batchDraw();
  })
  
// Define functions
  this.draw = function () {
    
    if (this.currentPath != null){

      this.group.x(this.currentPath.x1);
      this.group.y(this.currentPath.y1);

      var needToRotate = this.currentPath.rotation - this.currentRotation;
      
      this.group.rotate(needToRotate);
      this.currentRotation = this.currentPath.rotation;

      this.carOutline.fill(this.getCarColor());

      carsLayer.batchDraw();
    }
  };


  this.setAverageSpeed = function() {
    this.ticksSinceLastMove = 0;
    this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
    //console.log("average speed " + this.targetAverageSpeed);
  }

  this.getCarColor = function() {
    if(this.type==="extraParked" || this.type === "extraDriving") return "#AAAAAA";
    
    this.colorIndex = Math.round(Math.max(carColors.length - 1 - Math.max(average(this.ticksSinceLastMoveHistory), this.ticksSinceLastMove)*2, 0));
    /*if(this.colorIndex < 27) {
      console.log("car " + this.id 
                + " ticksSinceLastMoveHistory " + this.ticksSinceLastMoveHistory 
                + " ticksSinceLastMove " + this.ticksSinceLastMove 
                + " index " + this.colorIndex);
    }*/
    return carColors[this.colorIndex];
  }

  this.setDone = function () { 
    this.group.hide();

    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); } 
    this.currentPath = null;
    if(this.type!="extraParked" && this.type != "extraDriving") resultsTracker.logDone(this.ticksTotal - 
  this.ticksWhenDropoffDone);
  }

  this.setPath = function (path) {
    this.group.show();
    if (this.currentPath === false) {
      console.log("error: trying to set path to false")
    }
    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); }
    this.currentPath = path;
    path.currentCar = this;
  }

  // Functions for during dropoff
    this.startDropoff = function () {
      this.carDoor.show()
      this.isDroppingOff = true;
      this.ticksSinceStartDropoff = 0;
      resultsTracker.logDrop(this.ticksTotal);

    }

    this.checkIsDoneDroppingOff = function () {
      var targetDropOffTicks = document.getElementById("sliderTaskTime").value;
      if(this.ticksSinceStartDropoff > targetDropOffTicks) {
        this.stopDropoff();
        return true;
      }
      else {
        this.ticksSinceStartDropoff++;
      }
    }

    this.stopDropoff = function () {
      this.isDroppingOff = false;
      this.passengerCount = 0;
      this.carDoor.hide();
      this.passengerOne.hide();
      this.passengerTwo.hide();
      
      this.ticksWhenDropoffDone = this.ticksTotal;
    }

  // Next Step Execution
  this.nextStep = function () {
    // Goal: Decide if I should move, and if so, where to?
    
    var beforePath = this.currentPath;
    var moved = false;

    // Am I an extra parked car?
    if (this.type != "extraParked") {

      // Am I on a path?
      if (this.currentPath != null) {
        // Drop off: If I'm still dropping off, then don't move
        if(this.isDroppingOff === false || (this.isDroppingOff === true && this.checkIsDoneDroppingOff() )) {

          // If I haven't waited long enough for what the averageSpeed slider says, then I don't move either  
          if (this.ticksSinceLastMove*4 >= -this.targetAverageSpeed+99) {

            // whew, all the checks are done. Now I can move! Now where to?
            var targetPathToMoveTo = this.selectFromNextPathOptions();
            if (targetPathToMoveTo != beforePath && targetPathToMoveTo != null) {
              if(targetPathToMoveTo === false) {
                console.log("error: targetPathToMoveTo is false");
              }
              this.setPath(targetPathToMoveTo);
              this.draw();
              moved = true;
            }

            // Now that I have moved, let's check if we need to initiate another state: Dropoff, Pickup, or End
            if (this.currentPath != null) {
              if (this.currentPath.types.length > 0) {
                if (this.currentPath.types.includes("dropoff") && this.currentPath.types.includes("curb") && this.passengerCount>0) { 
                  if(this.shouldIcurbDropOffHere()) this.startDropoff();
                }
                if (this.currentPath.types.includes("dropoff") && this.currentPath.types.includes("spotEnter") && this.passengerCount>0) { 
                  this.startDropoff();
                }
                if (this.currentPath.types.includes("end")) this.setDone()
              }
            } 
          }       
        }
      }
    }

    if(moved) { this.ticksSinceLastMove = 0;}
    else      { this.ticksSinceLastMove++;  };

    this.ticksSinceLastMoveHistory.push(this.ticksSinceLastMove);
    this.ticksSinceLastMoveHistory = this.ticksSinceLastMoveHistory.slice(-5);
    this.ticksTotal++;

    this.setDisplayString();
    this.draw();
  }

  this.selectFromNextPathOptions = function() {
    return currentPathConfig.selectFromNextPathOptions(this);
  }

  this.canIGoToPathName = function(pathNamePrefix, validPathTransitions) {
    var selectedPathTransition;
    selectPathTransition = validPathTransitions.filter(p => p.toPath.name.startsWith(pathNamePrefix))[0];
    if(selectPathTransition != null) return selectPathTransition.toPath;
    else return null;
  }

  this.shouldIspotDropOffHere = function(path) {
    var pullForwardSlider = document.getElementById("sliderPullForward").value;

    // Which line am I in?
    var myPathLineName = path.name.substring(0, path.name.indexOf("Spot"));
    
    // How many open parking spots are there in this line?
    var spotDropOffPathsInThisLine = paths.filter(p => p.types.includes("spotEnter") && p.types.includes("dropoff") && p.name.includes(myPathLineName) && !p.isOccupiedByExtraParkedCar());
    var tolerateSpacesInFrontOfMe = spotDropOffPathsInThisLine.length * 2 * (1 - pullForwardSlider / 100) + 3;

    // Where am I in that line?
    var myPositionInSpotDropOffLine = spotDropOffPathsInThisLine.indexOf(path);

    // How many open parking spots are in front of me?
    var positionOfNextCar = spotDropOffPathsInThisLine.length;
    for (var i = myPositionInSpotDropOffLine+1; i < spotDropOffPathsInThisLine.length; i++) {
      if(spotDropOffPathsInThisLine[i].currentCar != null && spotDropOffPathsInThisLine[i].currentCar.isDroppingOff) positionOfNextCar = i;
      break;
    }

    var delta = Math.min(positionOfNextCar-myPositionInSpotDropOffLine, spotDropOffPathsInThisLine.length-myPositionInSpotDropOffLine);

    if(delta <= tolerateSpacesInFrontOfMe) return true;
    else                                   return false;
  }


  this.shouldIcurbDropOffHere = function() {
    var pullForwardSlider = document.getElementById("sliderPullForward").value;

    // What are all the curb drop off paths?
    var curbDropOffPaths = paths.filter(p => p.types.includes("dropoff") && p.types.includes("curb"));
    var tolerateSpacesInFrontOfMe = curbDropOffPaths.length * (1 - pullForwardSlider / 100) + 1;

    // Where am I in that line?
    var myPositionInCurbDropOffPaths = curbDropOffPaths.indexOf(this.currentPath);

    // How many open curb drop off paths are in front of me?
    var positionOfNextCar = 100;
    for (var i = myPositionInCurbDropOffPaths+1; i < curbDropOffPaths.length; i++) {
      if(curbDropOffPaths[i].currentCar != null && curbDropOffPaths[i].currentCar.isDroppingOff) positionOfNextCar = i;
      break;
    }

    //var availableCurbDropOffPaths = curbDropOffPaths.filter(p => p.currentCar === null);
    //var furtherestAvailableCurbDropOffPath = availableCurbDropOffPaths[availableCurbDropOffPaths.length - 1];
    //var positionOfFurthestAvailableCurbDropOffPath = curbDropOffPaths.indexOf(furtherestAvailableCurbDropOffPath);
    //var delta = positionOfFurthestAvailableCurbDropOffPath - myPositionInCurbDropOffPaths;

    var delta = Math.min(positionOfNextCar-myPositionInCurbDropOffPaths, curbDropOffPaths.length-myPositionInCurbDropOffPaths);

    if(delta <= tolerateSpacesInFrontOfMe) return true;
    else                                   return false;
  }

};