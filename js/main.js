
//http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=0ba8db6a-edcf-4738-bdc5-56c2bb678f20&LineRef=MTA%20NYCT_B62&DirectionRef=0

//http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=0ba8db6a-edcf-4738-bdc5-56c2bb678f20&LineRef=MTA%20NYCT_B62&DirectionRef=1&VehicleMonitoringDetailLevel=calls

//2. Is there a way to get the total length of a route in meters? 
//3. Drill into data
//4. Figure out what the farthest stop's callDistanceAlongRoute is, set that as the scale

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
  
    BusInfo.parsedData = _.sortBy(BusInfo.parsedData, 'CallDistanceAlongRoute');  
    console.log(BusInfo.parsedData);
    
    testbc = new BusSynth(BusInfo.parsedData);
    //console.log(testbc.getdifferenceArray()); 
    testbc.play();
    getStopPointNames(BusInfo.parsedData);
}

// function getBusInfoTheEasyWay(siriObject){

//   BusInfoInit();
//   BusInfo.distanceFromCall = getJSONValues(siriObject, "DistanceFromCall"); 
//   BusInfo.callDistanceAlongRoute = getJSONValues(siriObject, "CallDistanceAlongRoute");
//   BusInfo.stopNamesArray = getJSONValues(siriObject, "StopPointName");

//   console.log(BusInfo);
// }


function BusInfoInit (){  
      BusInfo.locationArray = [];
      BusInfo.stopNamesArray = [];
      BusInfo.parsedData = []; 
      BusInfo.distanceFromCall = [];
      BusInfo.callDistanceAlongRoute = [];
      BusInfo.stopNamesArray = [];
}


function getStopPointNames(parsedData) {
  BusInfo.stopNamesArray = getJSONValues(parsedData, "StopPointName");
  console.log(BusInfo.stopNamesArray);
}


$(document).ready(function()
{
  
  interval.start();
  env.play();

  $(".defaultText").focus(function(srcc)
  {
    if ($(this).val() == $(this)[0].title)
    {
      $(this).removeClass("defaultTextActive");
      $(this).val("");
    }
  });

  $(".defaultText").blur(function()
  {
    if ($(this).val() == "")
    {
      $(this).addClass("defaultTextActive");
      $(this).val($(this)[0].title);
    }
  });

  $(".defaultText").blur();        


  $('#left_button').click(function(){
    var busNumber = $('#searchBox').val();
    getBusInfo(busNumber, 0);
  });

  $('#right_button').click(function(){
    var busNumber = $('#searchBox').val();
    getBusInfo(busNumber, 1);
  });


  $( "#left_button" ).hover(
    function() {
      $(this).attr("src", "img/arrow_left_hover.png");
    }, function() {
      $(this).attr("src", "img/arrow_left.png");
    });

  $( "#right_button" ).hover(
    function() {
      $(this).attr("src", "img/arrow_right_hover.png");
    }, function() {
      $(this).attr("src", "img/arrow_right.png");
    }); 
});

$(document).keydown(function(e) {
  // console.log(e);
  //console.log(e.keyCode);
  var curKey = e.keyCode;

  switch(curKey){
    //reference tone toggle
    case 82:
      if(playing) {
        interval.stop();
        }
    else {
      interval.start();  
      env.play();
    } 
    playing = !playing; 
    console.log(playing);
    break;
    
    //play sequence 
    case 83:
    playSequence();

    function playSequence(){
      var mInterval = setInterval(playit, 1000);
      function playit(){
        if(seqIndex < testbc.gettimbreNotesArray().length){
          testbc.play(seqIndex);  
          console.log(BusInfo.stopNamesArray[seqIndex]);
          $('#input_container').append("<p class='stopName'>" + 
            BusInfo.stopNamesArray[seqIndex] + "</p>");
           $('.stopName').fadeOut(750);
          seqIndex++;
        }
        else {
          clearInterval(mInterval);
          seqIndex = 0;
        }
      }
    }

    break;
  }
});


