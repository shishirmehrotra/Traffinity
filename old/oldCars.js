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
  this.carDoor.moveToTop();
  this.carDoor.hide();
  this.group.add(this.carDoor);



/*
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
  this.front.moveToTop();
  this.back.moveToTop();
  this.sideRight.moveToTop();
  this.sideLeft.moveToTop();
  this.passengerTwo.moveToTop();
  this.passengerOne.moveToTop();

  this.group.add(this.rectangle);
  this.group.add(this.passengerOne);
  this.group.add(this.passengerTwo);
  this.group.add(this.front);
  this.group.add(this.back);
  this.group.add(this.sideRight);
  this.group.add(this.sideLeft);
  */
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

      this..fill(this.getCarColor());

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
    this.group.show();
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