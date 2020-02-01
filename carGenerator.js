//////////////////////////////////////////////////////////////////////////////////////////
//
// CAR GENERATOR   


var CarGenerator = function(){
// Define properties of CarGenerator
  this.leftCarCount = 0;
  this.rightCarCount = 0;
  this.currentDirectionRatio = document.getElementById("sliderDirectionRatio").value;
  this.ticksSinceLastCar = 0;
  this.currentAmountOfCars = document.getElementById("sliderAmountOfCars").value;



// Define functions
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

  this.generateExtraParkedCars = function() {
    var extraCarsValue = document.getElementById("sliderExtraParkedCars").value;

    // Clear current parked cars
    var currentParkedCars = carFleet.filter(c => c.type === "extraParked");
    currentParkedCars.forEach(c => c.setDone());

    // How many parking spots are there?
    var availableParkingSpots = paths.filter(p => p.types.includes("spotEnter") && p.types.includes("dropoff") && p.currentCar===null);

    // Fill x% of them with parked cars with no passengers
    var parkingSpotsToFill = availableParkingSpots.length * extraCarsValue / 100;
    


    while (parkingSpotsToFill > 0) {
      // Pick a random spot and try to fill it with a car
      var r = getRandomInt(availableParkingSpots.length);
      if(availableParkingSpots[r].currentCar === null) {
        carFleet.push(new Car(carFleet.length, 0, "extraParked"));
        carFleet[carFleet.length-1].setPath(availableParkingSpots[r]);
        availableParkingSpots = paths.filter(p => p.types.includes("spotEnter") && p.types.includes("dropoff") && p.currentCar===null);
        parkingSpotsToFill--;
      }
    }
  }

  this.generateCars = function() {
    var type = null;   

    // should we add cars on this tick?
    if (this.ticksSinceLastCar >= -this.currentAmountOfCars+100) {
      // generate car

      // how many passengers will this car have
      var extraCarsValue = document.getElementById("sliderExtraCars").value;
      var passengerCount = 2; 
      if (getRandomInt(100) < extraCarsValue) { passengerCount = 0; type = "extraDriving"}

      // should we put the cars on the left or right?
      
      if (this.currentDirectionRatio/100 < this.rightCarCount/(this.leftCarCount+ this.rightCarCount)) {
        var path = findPathByNames(["E Begin", "Start"]);
        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length, passengerCount, type));
          carFleet[carFleet.length-1].setPath(path);
          this.leftCarCount++;
        }
      }
      else {
        var path = findPathByNames(["W Begin", "Start"]);

        if(path.currentCar === null) {
          carFleet.push(new Car(carFleet.length, passengerCount, type));  
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
