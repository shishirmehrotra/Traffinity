//////////////////////////////////////////////////////////////////////////////////////////
//
// RESULTS TRACKER  


var ResultsTracker = function() {
// Define properties of ResultsTracker
  this.dropTimes = [];
  this.doneTimes = [];

  this.resultsCountKids   = document.getElementById("resultsCountKids");
  this.resultsCountCars   = document.getElementById("resultsCountCars");
  this.resultsPreAverage  = document.getElementById("resultsPreAverage");
  this.resultsPreMedian   = document.getElementById("resultsPreMedian");
  this.resultsPreMax      = document.getElementById("resultsPreMax");
  this.resultsPostAverage = document.getElementById("resultsPostAverage");
  this.resultsPostMedian  = document.getElementById("resultsPostMedian");
  this.resultsPostMax     = document.getElementById("resultsPostMax");
  

// Define functions of ResultsTracker

  this.logDrop = function(dropTime) {
    this.dropTimes.push(dropTime); this.refreshResults(); }
  this.logDone = function(doneTime) {
    this.doneTimes.push(doneTime); this.refreshResults(); }
  this.clearResults = function() { this.dropTimes = []; this.doneTimes = []; this.refreshResults();}
  this.refreshResults = function() { 
    var ticksPerMinute = 15; 

    this.resultsCountCars.innerHTML   =      this.doneTimes.length;
    this.resultsCountKids.innerHTML   = 2 * (this.doneTimes.length);    
    if (this.dropTimes.length != 0) {
      this.resultsPreAverage.innerHTML  = Math.round(arr.mean(   this.dropTimes.slice(-20)) / ticksPerMinute) + " min";
      this.resultsPreMedian.innerHTML   = Math.round(arr.median( this.dropTimes.slice(-20)) / ticksPerMinute) + " min";
      this.resultsPreMax.innerHTML      = Math.round(arr.max(    this.dropTimes.slice(-20)) / ticksPerMinute) + " min";
    } 
    else {
      this.resultsPreAverage.innerHTML  = "-";
      this.resultsPreMedian.innerHTML   = "-";
      this.resultsPreMax.innerHTML      = "-";
    }

    if (this.doneTimes.length != 0) {
      this.resultsPostAverage.innerHTML = Math.round(arr.mean(   this.doneTimes.slice(-20)) / ticksPerMinute) + " min";
      this.resultsPostMedian.innerHTML  = Math.round(arr.median( this.doneTimes.slice(-20)) / ticksPerMinute) + " min";
      this.resultsPostMax.innerHTML     = Math.round(arr.max(    this.doneTimes.slice(-20)) / ticksPerMinute) + " min";
    }
    else {
      this.resultsPostAverage.innerHTML = "-";
      this.resultsPostMedian.innerHTML  = "-";
      this.resultsPostMax.innerHTML     = "-";  
    }
  }

}

