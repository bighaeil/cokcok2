require('bootstrap');
require('../less/main.less');

var hello = require('./sample/hello');
var loadGoogleMapsApi = require('load-google-maps-api-2');


loadGoogleMapsApi.key = 'AIzaSyAhyUYucbXxTTww6TrL4OifnmVZFBh1oOY';
loadGoogleMapsApi.language = 'ko';
loadGoogleMapsApi.version = '3';

var googleMaps;
var map;
var infoWindow;

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
    map = new googleMaps.Map($('#google-map')[0], {
        center: latLng,
        zoom: 15
    });

    infoWindow = new googleMaps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
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


var thumnailImg = [];
var markers = [];
function mapClickEvent(latLng, map) {
    // marker 입력
    var marker = new googleMaps.Marker({
        position: latLng,
        map: map
    });

    // 파노라마 섬네일 infowindow에 입력
    var metadata = 'https://maps.googleapis.com/maps/api/streetview/metadata?';
    var thumbnail = 'https://maps.googleapis.com/maps/api/streetview?';
    var parameters = 'size=600x300&location=' + latLng.lat() + ',' + latLng.lng() +
        '&heading=165&pitch=-0' +
        '&key=' + loadGoogleMapsApi.key;

    $.getJSON(metadata + parameters, function (json) {
        var content = '';
        if(json.status === 'OK') {
            content = '<img src="'+ thumbnail + parameters + '" style="width:200px;height:100px">';
            content += '<button class="cc2-gmap-btn-delete" lat="' + latLng.lat() + '" lng="' + latLng.lng() + '">삭제</button>';
            infoWindow.close();
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        } else {
            content += content += '<button class="cc2-gmap-btn-delete" lat="' + latLng.lat() + '" lng="' + latLng.lng() + '">삭제</button>';
            infoWindow.close();
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        }
        thumnailImg.push(content);

        markerRemove();
    });

    marker.addListener('click', function () {
        var index = $.inArray(this, markers);
        infoWindow.close();
        infoWindow.setContent(thumnailImg[index]);
        infoWindow.open(map, marker);

        markerRemove();
    });

    markers.push(marker);
    flightPlanCoordinates.push(latLng);
    drawLine(map);
}

function markerRemove() {
    $('.cc2-gmap-btn-delete').off();
    $('.cc2-gmap-btn-delete').on('click', function () {
        var _latLng = {
            lat: $(this).attr('lat').toString(),
            lng: $(this).attr('lng').toString()
        };

        var index = 0;
        $.each(markers, function (i, e) {
            var lat = e.getPosition().lat().toString();
            var lng = e.getPosition().lng().toString();

            if (_latLng.lat === lat && _latLng.lng === lng) {
                index = i;
                return false;
            }
        });

        markers[index].setMap(null);
        markers.splice(index, 1);
        thumnailImg.splice(index, 1);

        flightPlanCoordinates.splice(index, 1);
        drawLine(map);
    });
}

var flightPlanCoordinates = [];
var travelPathArray = [];
function drawLine(map) {
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
