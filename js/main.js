
//http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=0ba8db6a-edcf-4738-bdc5-56c2bb678f20&LineRef=MTA%20NYCT_B62&DirectionRef=0

//http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=0ba8db6a-edcf-4738-bdc5-56c2bb678f20&LineRef=MTA%20NYCT_B62&DirectionRef=1&VehicleMonitoringDetailLevel=calls

//some data: 

//CallDistanceAlongRoute": 2963.22 Manhattan and Greenpoint Av

//TO DO LIST: 
//1. Maybe integrate the GTDF, or OneBusAwayAPI info to be able to search for PublishedLineName
//2. Is there a way to get the total length of a route in meters? 
//3. Drill into data
//4. Figure out what the farthest stop's callDistanceAlongRoute is, set that as the scale
//5. Sort the objects by CallDistanceAlongRoute
// Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity.length

// 


var BusInfo = {

  locationArray: [],
  stopNamesArray: [],
  parsedData: [],
  distanceFromCall: [],
  callDistanceAlongRoute: [],
  globalBusInfo: [],
}; 


function getBusInfo(searchTerm, direction) {
  var bustimeURL = "http://bustime.mta.info/api/siri/vehicle-monitoring.json?"; 
  var busLineSearchTerm = "MTA NYCT_" + searchTerm;
  var busTimeKey = "key=0ba8db6a-edcf-4738-bdc5-56c2bb678f20";


  $.ajax({
      url: bustimeURL + busTimeKey + "&LineRef=" + busLineSearchTerm + 
      "&DirectionRef=" + direction,     
      type: 'GET',
      dataType: "jsonp",

      error: function(data){
        console.log("oops");
        console.log(data);
      },  

      success: function (data) {
        //console.log("got the buses");
        //console.log(data);
        
        //getBusInfoTheEasyWay(data);
        getParsedBusInfo(data);
        
      }
    }); 
}

function getParsedBusInfo(siriObject){

  BusInfoInit();

  for (var i = 0; i < siriObject.Siri.ServiceDelivery.VehicleMonitoringDelivery[0]
    .VehicleActivity.length; i++) {

    BusInfo.locationArray.push(_.pick(siriObject.Siri.ServiceDelivery.
    VehicleMonitoringDelivery[0].VehicleActivity[i].
    MonitoredVehicleJourney.MonitoredCall.Extensions.Distances, 
    'CallDistanceAlongRoute', 'DistanceFromCall'));

    BusInfo.stopNamesArray.push(_.pick(siriObject.Siri.ServiceDelivery.
    VehicleMonitoringDelivery[0].VehicleActivity[i].
    MonitoredVehicleJourney.MonitoredCall, 'StopPointName'));

}

for (var j = 0; j < BusInfo.locationArray.length; j++) {

    BusInfo.parsedData.push(_.extend(BusInfo.stopNamesArray[j], BusInfo.locationArray[j]));
      
    }
  

  //console.log(BusInfo.locationArray); 
  //console.log(BusInfo.stopNamesArray); 
    BusInfo.parsedData = _.sortBy(BusInfo.parsedData, 'CallDistanceAlongRoute');  
    console.log(BusInfo.parsedData);
}

function getBusInfoTheEasyWay(siriObject){

  BusInfoInit();
  BusInfo.distanceFromCall = getJSONValues(siriObject, "DistanceFromCall"); 
  BusInfo.callDistanceAlongRoute = getJSONValues(siriObject, "CallDistanceAlongRoute");
  BusInfo.stopNamesArray = getJSONValues(siriObject, "StopPointName");

  console.log(BusInfo);
}


function BusInfoInit (){  
      BusInfo.locationArray = [];
      BusInfo.stopNamesArray = [];
      BusInfo.parsedData = []; 
      BusInfo.distanceFromCall = [];
      BusInfo.callDistanceAlongRoute = [];
      BusInfo.stopNamesArray = [];
}



$('#info_button').click(function(){
    getBusInfo("B62", 0);
});


























// var booyahBuffer = null;
// var url = 'sounds/booyah.mp3';

// window.AudioContext = window.AudioContext || window.webkitAudioContext;
// var context = new AudioContext();

// function loadDogSound(url) {
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';

//   // Decode asynchronously
//   request.onload = function() {
//     context.decodeAudioData(request.response, function(buffer) {
//       booyahBuffer = buffer;
//     }, onError);
//   };
//   request.send();
// }

// loadDogSound(url);


// function playSound(buffer) {
//   var source = context.createBufferSource(); // creates a sound source
//   source.buffer = buffer;                    // tell the source which sound to play
//   source.connect(context.destination);       // connect the source to the context's destination (the speakers)
//   source.start(0);                           // play the source now                                            // note: on older systems, may have to use deprecated noteOn(time);
// }


// $('button').click(function(){
// 	playSound(booyahBuffer); 
// 	console.log(booyahBuffer);
// });



// function onError() {
// 	console.log("you fucked up!"); 
// }


