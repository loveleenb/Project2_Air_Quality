//setting a map location and zoom level
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});
  
// Adding tile layer

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  // set maximum zoom level
	  maxZoom: 15,
	  id: "mapbox.streets",
	  accessToken: API_KEY
  }).addTo(map);
  
co_value = [];
date = [];
city = [];

var url = "https://api.openaq.org/v1/latest?country=US&date_from=2016-01-01&parameter=co&limit=10000";

d3.json(url, function(data){

  var feature = data.results;

  //console.log(feature);

  feature.forEach(function(d){
    var value_co = d.measurements[0].value;
    //console.log(d.measurements[0].value);
    var latitude = d.coordinates.latitude;
    //console.log(d.measurements.parameter)
    var longitude = d.coordinates.longitude;

    date.push(d.measurements[0].lastUpdated);

    city.push(d.city);

    units = d.measurements[0].unit;
    //console.log('old: ' + units)
    
    if (units == "ppm"){
      value_co = value_co * 1000
      units = "µg/m³"

     };
     co_value.push(value_co);


    console.log(value_co + units) ;
    var fillcolor = "greenyellow";

    if (value_co > 0) {
      fillcolor = "Yellow";
    };

    if (value_co > 200) {
      fillcolor = "Gold";
    };

    if (value_co > 400) {
      fillcolor = "Coral";
    };

    if (value_co > 600) {
      fillcolor = "orange";
    };

    if (value_co > 800) {
      fillcolor = "Red";
    };

    L.circle([latitude, longitude], {
      color: "Blue",
      fillColor: fillcolor,
      fillOpacity: 0.75,
      weight: 1,
      radius: value_co*100 // multiplying by a bigger value to ensure different circle size
    }).bindPopup("<h3> City: " + d.city +
      "</h3><hr><p> SO2 Value: " + value_co + " µg/m³" + "</p>").addTo(map);

  });

  newDate = []
  date.forEach(function(element){
    newDate.push(element.slice(0, 10));
  });

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: newDate.slice(0, 100),
      datasets: [{
        label: 'CO',
        data: co_value.slice(0, 100),
        backgroundColor: "rgba(153,255,51,0.4)"
      }, ]
    },
    
  });

});
  //setting the ledgend 

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  //set various colors
      var div = L.DomUtil.create('div', 'legend'),
          grades = [0, 200, 400, 600, 800, 1000],
          c_palette = ["greenyellow", "Yellow", "Gold", "Coral", "orange", "Red"],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + c_palette[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' 
                         + grades[i + 1] + '<br>' : '+');
        }
        return div;

  };
  
  legend.addTo(map);












