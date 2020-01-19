//////////////////////////////////////////////////////////////////////////////////////////
//
// CAR GENERATOR   


var CarGenerator = function(){
  this.leftCarCount = 0;
  this.rightCarCount = 0;
  this.currentDirectionRatio = document.getElementById("sliderDirectionRatio").value;
  this.ticksSinceLastCar = 0;
  this.currentAmountOfCars = document.getElementById("sliderAmountOfCars").value;

  this.setRatio = function() {
    this.leftCarCount = 0;
    this.rightCarCount = 0;
    this.currentDirectionRatio = document.getElementById("sliderDirectionRatio").value;
    console.log("Current Direction Ratio: " + this.currentDirectionRatio);
  };

  this.setAmountOfCars = function() {
    this.leftCarCount = 0;
    this.rightCarCount = 0;
    this.ticksSinceLastCar = 0;
    this.currentAmountOfCars = document.getElementById("sliderAmountOfCars").value;
    console.log("Current Amount Of Cars: " + this.currentAmountOfCars);
  };

  this.generateCars = function() {
    // should we add cars on this tick?
    if (this.ticksSinceLastCar >= -this.currentAmountOfCars+100) {
      // generate car
      // should we put the cars on the left or right?
      
      if (this.currentDirectionRatio/100 < this.rightCarCount/(this.leftCarCount+ this.rightCarCount)) {
        var path = findPathByName("EStart");
        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length));
          carFleet[carFleet.length-1].setPath(path);
          this.leftCarCount++;
        }
      }
      else {
        var path = findPathByName("WStart");

        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length));  
          carFleet[carFleet.length-1].setPath(path);
          this.rightCarCount++;
        }
      }
      //reset ticks
      this.ticksSinceLastCar = 0;
    }
    else {
      this.ticksSinceLastCar++;
    }
  };
};
