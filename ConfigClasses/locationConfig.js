class LocationConfig {
  constructor() {
    // Image Values
    this.mapImage = "";
    this.mapImageSatellite = "";

    // DOM references
    this.baseImageDOM = document.getElementById("baseimage");
    this.sliderGroupCarSetup = document.getElementById("sliderGroupCarSetup");
    this.sliderGroupLocationPreference = document.getElementById("sliderGroupLocationPreference");
    this.sliderGroupPoliteness = document.getElementById("sliderGroupPoliteness");

    this.parkingLotToolbar = document.getElementById("parkingLotToolbar");
    this.parkingSetupToolbar = document.getElementById("parkingSetupToolbar");
    //this.sliders =[];
  }

  setup() {
    // Setup mapImage
    this.toggleImage();
    this.clearSliderOptions();
    this.clearConfigOptions();



  };


  toggleImage() {
    if(document.getElementById("checkboxShowSatelliteImage").checked === true) 
      this.baseImageDOM.src = this.mapImageSatellite;
    else
      this.baseImageDOM.src = this.mapImage;
  }

  addSliderOption(sliderGroup, id, min, max, value, onInput, label) {
    var newSlider = document.createElement("input");
    newSlider.classList.add("slider"); 
    newSlider.type = "range";
    newSlider.id = id;
    newSlider.min = min;
    newSlider.max = max;                 
    newSlider.value = value;  
    //newSlider.onInput = onInput;  
    if (onInput != null) newSlider.addEventListener("input", onInput);

    var newSpan = document.createElement('span');
    newSpan.classList.add("sliderLabel");
    var newSliderLabel = document.createTextNode(label);
    newSpan.appendChild(newSliderLabel);    

    sliderGroup.appendChild(newSlider);     
    sliderGroup.appendChild(newSpan);

    //this.sliders.push(newSlider);                            
  }

  addConfigOption(type, value, onClick, isChecked) {
    var newConfig = document.createElement("input");
    newConfig.type = "radio";
    newConfig.id = value;
    newConfig.name = type === "run" ? "radioParkingLotSetup":"radioParkingLotSetupSecond";
    newConfig.value = value;

    if (onClick != null) newConfig.addEventListener("click", onClick);
    //if (onClick != null) newConfig.setAttribute("onclick", onClick);

    newConfig.checked = isChecked;

    var newLabel = document.createElement("label");
    newLabel.htmlFor = value;
    newLabel.innerHTML = value;

    var toolbar = type === "run" ? this.parkingLotToolbar:this.parkingSetupToolbar;
    toolbar.appendChild(newConfig); 
    toolbar.appendChild(newLabel); 
  }

  clearSliderOptions() {
    //this.sliders = [];
    $("#trafficSettingsPanel .slider").remove();
    $("#trafficSettingsPanel .sliderLabel").remove();
  }

  clearConfigOptions() {
    $("#parkingLotSetup input").remove();
    $("#parkingLotSetup label").remove();
  }

  

}