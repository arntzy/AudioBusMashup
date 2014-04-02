//TODO LIST:
//1. get reference pitch looping on the page
//2. play the notes as a whole chord and in sequence
//3. display the stop names as a transition 



var testbc;
var seqIndex = 0;
var playing = true; 
var osc = T("sin", {freq:220, mul:0.35});
var env = T("perc", {a:200, r:300}, osc).bang(); 
var interval = T("interval", {interval:1000}, env);
var maxRange = 20000; 

function BusSynth(_busObjectArray){

	var busObjectArray; 
	var differenceArray;  
	var timbreNotesArray = [];

	
	var mapRange = function(from, to, s) {
		return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
	};

	var makeFreqArray = function(){
		for (var i = 0; i < _busObjectArray.length; i++) {
			differenceArray[i] = Math.floor(_busObjectArray[i].CallDistanceAlongRoute - 
				_busObjectArray[i].DistanceFromCall);  
		}
	};

	var makeTimbreNotes = function(_differenceArray) {

		for (var i = 0; i < _differenceArray.length; i++) {
			
			_differenceArray[i] = mapRange([0, maxRange], [220, 880], 
											_differenceArray[i]);

			timbreNotesArray[i] = T("sin", {freq: _differenceArray[i], 
											mul:(1/_differenceArray.length)});
		}
		differenceArray = _differenceArray; 
		console.log(differenceArray);
	};


	this.constructor = function(){
		
		busObjectArray = _busObjectArray;
		differenceArray = [];
		makeFreqArray();
		console.log(differenceArray);
		makeTimbreNotes(differenceArray);
	}();


	this.getbusObjectArray = function(){
		return busObjectArray;
	};

	this.getdifferenceArray = function(){
		return differenceArray;
	};

	this.gettimbreNotesArray = function(){
		return timbreNotesArray;
	};

	this.gettimbreNotesArrayFreq = function(index){
		return timbreNotesArray[index].freq._.value;
	};

	this.play = function(index){	
		if(index || index === 0){
			T("perc", {r:1500}, timbreNotesArray[index]).on("ended", function() {
				this.pause();
			}).bang().play();
		}
		else {
			T("perc", {r:5000}, timbreNotesArray).on("ended", function() {
				this.pause();
			}).bang().play();
		}	
	};
}






	

	




