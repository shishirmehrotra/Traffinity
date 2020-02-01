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
    this.resultsCountCars.innerHTML   =      this.doneTimes.length;
    this.resultsCountKids.innerHTML   = 2 * (this.doneTimes.length);    
    this.resultsPreAverage.innerHTML  = Math.round(arr.mean(this.dropTimes));
    this.resultsPreMedian.innerHTML   = arr.median(this.dropTimes);
    this.resultsPreMax.innerHTML      = arr.max(this.dropTimes);
    this.resultsPostAverage.innerHTML = Math.round(arr.mean(this.doneTimes));
    this.resultsPostMedian.innerHTML  = arr.median(this.doneTimes);
    this.resultsPostMax.innerHTML     = arr.max(this.doneTimes);
  }

}

