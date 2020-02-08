class BCSLocationConfig extends LocationConfig {
  constructor() {
    super();

    this.mapImage          = "Location-BCS/bcsMap.png";
    this.mapImageSatellite = "Location-BCS/bcsMapSatellite.png";
  }

  setup() {
    super.setup();

    // Setup Sliders (and put into Slider Groups)
    this.addSliderOption(this.sliderGroupCarSetup, "sliderAmountOfCars",    "0", "100",  "75", setAmountOfCars, "Amount of Cars");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderAverageSpeed",    "0",  "99", "100", setAverageSpeed,              "Average Speed");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderExtraCars",       "0",  "99",   "25", null,                           "Extra Cars");
    this.addSliderOption(this.sliderGroupCarSetup, "sliderExtraParkedCars", "0",  "99",  "75", carGenerator.generateExtraParkedCars, "Extra Parked Cars");

    this.addSliderOption(this.sliderGroupLocationPreference, "sliderParkingSpotPreferred", "0", "100", "50", setSliderParkingSpotPreferred, "Parking Spot Preferred");
    this.addSliderOption(this.sliderGroupLocationPreference, "sliderDirectionRatio",  "0",  "99",  "60", setRatio,        "Direction Ratio");
    
    this.addSliderOption(this.sliderGroupPoliteness, "sliderCarSpacing",   "0",  "99", "20", null, "Car Spacing");
    this.addSliderOption(this.sliderGroupPoliteness, "sliderTaskTime",     "0", "100",   "", null, "Drop off/Pick up Duration");
    this.addSliderOption(this.sliderGroupPoliteness, "sliderPullForward",  "0",  "99", "99", null, "Pull Forward");

    setupSlidersFormatting();

    // Setup Run Config List
    this.addConfigOption("run", "Today",          function() {currentPathConfig = new BCSPathConfigToday(); resetSimulation();},    true);
    this.addConfigOption("run", "All Left",       function() {currentPathConfig = new BCSPathConfigAllLeft(); resetSimulation();},    false);
    this.addConfigOption("run", "Exit Right",     function() {currentPathConfig = new BCSPathConfigExitRight(); resetSimulation();}, false);
    this.addConfigOption("run", "Expand Dropoff", function() {currentPathConfig = new BCSPathConfigExpandDropoff(); resetSimulation();},    false);

    // Setup Path Config List
    this.addConfigOption("Configure", "Less Reserved", function(){ setExtraParkedCars(25);},    false);
    this.addConfigOption("Configure", "Remote Lot",    function(){ setCustomAmountOfCars(25);}, false);
    this.addConfigOption("Configure", "School Bus",    function(){ setCustomAmountOfCars(25);}, false);
    this.addConfigOption("Configure", "Stagger Times", function(){ setCustomAmountOfCars(25);}, false);
    this.addConfigOption("Configure", "Active Curb",   function(){ setDropoffDuration(10);},    false);
  }

  decideNextCarPlacement() {
    
  }

}



    // TODO: Configure carGenerator to have correct carSize 
    // TODO: Configure carGenerator to have correct entrance list and decideEntrance()
