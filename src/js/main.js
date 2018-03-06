require('bootstrap');
require('../less/main.less');

var hello = require('./sample/hello');
var loadGoogleMapsApi = require('load-google-maps-api-2');


loadGoogleMapsApi.key = 'AIzaSyDmSxIrhoC4OAiGOtO6ddcFCwSMRbgfPGs';
loadGoogleMapsApi.language = 'ko';
loadGoogleMapsApi.version = '3';

var googleMaps;

loadGoogleMapsApi().then(function(_googleMaps) {
    googleMaps = _googleMaps;
    initMap();
}).catch(function(error) {
    console.error(error);
});

var latLng = {
    lat : 37.552331,
    lng : 126.937588
};

function initMap() {
    var map = new googleMaps.Map($('#google-map')[0], {
        center: latLng,
        zoom: 15
    });
    var infoWindow = new googleMaps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    map.addListener('click', function (e) {
        mapClickEvent(e.latLng, map);
    });
}

function mapClickEvent(latLng, map) {
    var marker = new googleMaps.Marker({
        position: latLng,
        map: map
    });

    markers.push(marker);
    flightPlanCoordinates.push(latLng);
    addLine(map);
}

var markers = [];
var flightPlanCoordinates = [];
var travelPathArray = [];
function addLine(map) {
    for (var i in travelPathArray){
        travelPathArray[i].setMap(null);
    }

    var flightPath = new googleMaps.Polyline({
        path: flightPlanCoordinates,
        strokeColor: "#FF0000",
        strokeOpacity: 0.3,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    travelPathArray.push(flightPath);
}


$('.say-hello').on('click', function() {
    alert(hello.hello($('#txt-hello').val()));
});

$('.goto-sub').on('click', function() {
    location.href = 'sub.html';
});
