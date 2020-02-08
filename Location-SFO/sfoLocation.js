//////////////////////////////////////////////////////////////////////////////////////////
//
// SFO   
//
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//
// LocationConfig Object

class SFOLocationConfig extends LocationConfig {
  constructor() {
    super();

    this.mapImage          = "Location-SFO/sfoMap.png";
    this.mapImageSatellite = "Location-SFO/sfoMapSatellite.png";
  }

  setup() {
    super.setup();
    
    // Setup Sliders (and put into Slider Groups)

    
    // Setup Sliders (and put into Slider Groups)
    this.addSliderOption(this.sliderGroupCarSetup, "sliderAmountOfCars",    "0", "100",  "75", setAmountOfCars, "Amount of Cars");
    //this.addSliderOption(this.sliderGroupCarSetup, "sliderDirectionRatio",  "0",  "99",  "75", setRatio,        "Direction Ratio");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderAverageSpeed",    "0",  "99", "100", setAverageSpeed,              "Average Speed");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderExtraCars",       "0",  "99",   "5", null,                           "Extra Cars");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderExtraParkedCars", "0",  "99",  "50", carGenerator.generateExtraParkedCars, "Extra Parked Cars");

    //this.addSliderOption(this.sliderGroupLocationPreference, "sliderCurbPreferred",        "0", "100", "50", setSliderCurbPreferred,        "Curb Preferred");
    //this.addSliderOption(this.sliderGroupLocationPreference, "sliderParkingSpotPreferred", "0", "100", "50", setSliderParkingSpotPreferred, "Parking Spot Preferred");
    //this.addSliderOption(this.sliderGroupLocationPreference, "sliderStreetPreferred",      "0", "100", "0", null,                             "Street Preferred");
    
    this.addSliderOption(this.sliderGroupPoliteness, "sliderCarSpacing",   "0",  "99", "20", null, "Car Spacing");
    this.addSliderOption(this.sliderGroupPoliteness, "sliderTaskTime",     "0", "100",   "", null, "Drop off/Pick up Duration");
    this.addSliderOption(this.sliderGroupPoliteness, "sliderPullForward",  "0",  "99", "99", null, "Pull Forward SFO");

    setupSlidersFormatting();

    // Setup Path Config List
    this.addConfigOption("run", "Base",          function() {currentPathConfig = new SFOPathConfigToday(); resetSimulation();},    true);

    // Setup Run Config List

    // Configure carGenerator to have correct carSize 
    // Configure carGenerator to have correct entrance list and decideEntrance()
    // Setup Path Config List

    // Setup Run Config List

    // Configure carGenerator to have correct carSize 
    // Configure carGenerator to have correct entrance list and decideEntrance()

  }


}



