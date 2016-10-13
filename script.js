var markers = [
  [10, -14.2350040,-51.9252800],
	[20, -34.028249, 151.157507],
 	[123, 39.0119020,-98.4842460],
 	[50, 48.8566140,2.3522220],
	[62, 38.7755940,-9.1353670],
  [92, 12.0733335, 52.8234367],
];

function initializeMaps() {
	var myLatLng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    zoom: 4,
    center: myLatLng
  });
  
	var bounds = new google.maps.LatLngBounds();

	markers.forEach(function(point) {
	 	generateIcon(point[0], function(src) {
		  var pos = new google.maps.LatLng(point[1], point[2]);
		
	  	bounds.extend(pos);
	
		  new google.maps.Marker({
		  	position: pos,
			  map: map,
			  icon: src
		  });
		});
	});
	
	map.fitBounds(bounds);
}

var generateIconCache = {};

function generateIcon(number, callback) {
  if (generateIconCache[number] !== undefined) {
    callback(generateIconCache[number]);
  }

  var fontSize = 16,imageWidth = imageHeight = 40;

 

  var svg = d3.select(document.createElement('div')).append('svg')
    .attr('viewBox', '0 0 54.4 54.4')
    .append('g')

  

 var outerClr;
 if(number>70)
    outerClr = 'green'
  else
  if(number>30)
    outerClr = 'orange'
  else
    outerClr = 'red'
  
  var path = svg.append('path')
    .attr('d', 'M45.5 0h-43v43h16.2l5.9 5 5.8-5h15.1z')
    .attr('fill', outerClr);

  var text = svg.append('text')
    .attr('dx', 25)
    .attr('dy', 27)
    .attr('text-anchor', 'middle')
    .attr('style', 'font-size:' + fontSize + 'px; fill: #FFFFFF; font-family: Arial, Verdana; font-weight: bold')
    .text(number);

  var svgNode = svg.node().parentNode.cloneNode(true),
    image = new Image();

  d3.select(svgNode).select('clippath').remove();

  var xmlSource = (new XMLSerializer()).serializeToString(svgNode);

  image.onload = (function(imageWidth, imageHeight) {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      dataURL;

    d3.select(canvas)
      .attr('width', imageWidth)
      .attr('height', imageHeight);

    context.drawImage(image, 0, 0, imageWidth, imageHeight);

    dataURL = canvas.toDataURL();
    generateIconCache[number] = dataURL;

    callback(dataURL);
  }).bind(this, imageWidth, imageHeight);

  image.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

initializeMaps();
