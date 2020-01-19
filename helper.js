//////////////////////////////////////////////////////////////////////////////////////////
// 
// HELPER FUNCTIONS
//
//////////////////////////////////////////////////////////////////////////////////////////


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const average = function(list) { 
  var sum = 0;
  list.forEach(e => sum = sum + e);
  return sum / list.length;
/*
  if(list.length ===0) return 0; 

  list.reduce((prev, curr) => prev + curr) / list.length;*/
}