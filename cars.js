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

var Car = function (id) {

  this.currentPath = null;
  this.id = id;
  this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
  this.ticksSinceLastMove = 0;
  //this.ticksSinceLastMovePrevious = 0;
  this.ticksSinceLastMoveHistory = [];
  //this.color = carColors[carColors.length];
  this.currentRotation = 0;

  this.group = new Konva.Group({
    x: 0,
    y: 0
  })

  this.passengerOne = new Konva.Rect({
    x: 4,
    y: 4,
    width: 4,
    height: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 7
  });
  /*= new Konva.Circle({
    x: 8,
    y: 6,
    radius: 5,
    fill: 'black',
    stroke: 'white',
    strokeWidth: 1
  });*/

  this.passengerTwo = new Konva.Rect({
    x: 10,
    y: 4,
    width: 4,
    height: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 7
  });

  /*= new Konva.Circle({
    x: 15,
    y: 6,
    radius: 5,
    fill: 'black',
    stroke: 'white',
    strokeWidth: 1
  });*/

  this.rectangle = new Konva.Rect({
     x: 0,
     y: 0,
    width: 26,
    height: 12,
    fill:'red',
    cornerRadius: 3
  });
  this.front = new Konva.Rect({
    x:20, 
    y:5,
    width: 4,
    height: 10,
    fill: 'black'
  })

  this.back = new Konva.Rect({
    x:11, 
    y:1,
    width: 3,
    height: 10,
    fill: 'black'
  })

  this.sideRight = new Konva.Rect({
    x:2,
    y:1,
    width:22,
    height:1,
    fill: 'black'
  })
  this.sideLeft = new Konva.Rect({
    x:2,
    y:10,
    width:22,
    height:1,
    fill: 'black'
  })
  /*this.front.moveToTop();
  this.back.moveToTop();
  this.sideRight.moveToTop();
  this.sideLeft.moveToTop();
  this.passengerTwo.moveToTop();
  this.passengerOne.moveToTop();*/


  this.group.add(this.rectangle);
  this.group.add(this.passengerOne);
  this.group.add(this.passengerTwo);
  this.group.add(this.front);
  this.group.add(this.back);
  this.group.add(this.sideRight);
  this.group.add(this.sideLeft);

  carsLayer.add(this.group);
  //carsLayer.add(this.rectangle);
  //carsLayer.draw();

  // Create DOM element 
  /*this.element = document.createElement("IMG");
  this.element.src = "https://cl.ly/80cb71d6061a/Car_%20Red.png";
  this.element.classList.add("car");
  this.element.id = 'car' + id;
  mapContainer.appendChild(this.element);
*/
  // Set functions: draw, rotate
  this.draw = function () {
    /*
    this.element.style.left = this.currentPath.x2 + "px";
    this.element.style.top = this.currentPath.y2 + "px";
    this.element.style.transform = "rotate(" + this.currentPath.rotation + "deg)";
*/
    if (this.currentPath != null){
      //this.circle.x(this.currentPath.x1+13);
      //this.circle.y(this.currentPath.y1+6);     


      //this.rectangle.x(this.currentPath.x1);
      //this.rectangle.y(this.currentPath.y1);

      this.group.x(this.currentPath.x1);
      this.group.y(this.currentPath.y1);

      var needToRotate = this.currentPath.rotation - this.currentRotation;
      //this.rectangle.rotate(needToRotate);
      //this.circle.rotate(needToRotate);
      this.group.rotate(needToRotate);
      this.currentRotation = this.currentPath.rotation;

      this.rectangle.fill(this.getCarColor());

      carsLayer.batchDraw();
    }
  };

  //this.rotate = function (value) { this.element.style.transform = "rotate(" + value + "deg)"; }

  this.setAverageSpeed = function() {
    this.ticksSinceLastMove = 0;
    this.targetAverageSpeed = document.getElementById("sliderAverageSpeed").value;
    //console.log("average speed " + this.targetAverageSpeed);
  }

  this.getCarColor = function() {
    var index = Math.round(Math.max(carColors.length - Math.max(average(this.ticksSinceLastMoveHistory), this.ticksSinceLastMove)*1, 0));
    /*if(index < 27) {
      console.log("car " + this.id 
                + " ticksSinceLastMoveHistory " + this.ticksSinceLastMoveHistory 
                + " ticksSinceLastMove " + this.ticksSinceLastMove 
                + " index " + index);
    }*/
    return carColors[index];
  }

  this.setDone = function () { 
    //this.element.hidden = true; 
    //this.rectangle.hide();
    //this.circle.hide();
    this.group.hide();

    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); } 
    this.currentPath = null;
  }

  this.setPath = function (path) {
    //this.element.hidden = false;
    this.rectangle.show();
    if (this.currentPath != null) { this.currentPath.clearCurrentCar(); }
    this.currentPath = path;
    path.currentCar = this;
    //this.draw();
    //this.currentPath.arrow.stroke('white');
    //pathsLayer.draw();
  }

  this.nextStep = function () {
    var beforePath = this.currentPath;
    var moved = false;
    // TODO select from openTransitions
    if (this.currentPath != null) {
      if (this.ticksSinceLastMove*4 >= -this.targetAverageSpeed+100) {
        var validPathTransitions = pathTransitions.filter(e => e.fromPath === this.currentPath && e.isAvailable());
        if(validPathTransitions.length > 0) {
            var random = getRandomInt(validPathTransitions.length);

            this.setPath(validPathTransitions[random].toPath);
            if (this.currentPath != beforePath) {
              this.draw();
              moved = true;
            }
        }
        //else {this.ticksSinceLastMove++}
        if (this.currentPath.types != null) {
          if (this.currentPath.types.includes("end")) {
          this.setDone();
          }
        }        
      }

    }
    if(moved) {
        //this.ticksSinceLastMovePrevious = this.ticksSinceLastMove;
        this.ticksSinceLastMoveHistory.push(this.ticksSinceLastMove);
        this.ticksSinceLastMoveHistory = this.ticksSinceLastMoveHistory.slice(-5);
        this.ticksSinceLastMove = 0;}
    else      {this.ticksSinceLastMove++; this.draw();};
  }

};