/* global $, google, navigator, Swiper */
(function () {
    
     //initialize swiper when document ready  
    var mySwiper = new Swiper ('.swiper-container', {
        // parameters
        direction       : 'horizontal',
        loop            : false,
        // pagination circles
        pagination      : '.swiper-pagination',
        // navigation arrows
        nextButton      : '.swiper-button-next',
        prevButton      : '.swiper-button-prev',
        
        noSwipingClass  : 'map'
    });
    
    // initialize google maps
    $.when(
        $.getScript('https://www.google.com/jsapi'),
        $.Deferred(function ( deferred ) {
           $( deferred.resolve ); 
        })
     )
     .done(function () {
         
        google.load('maps', '3', {
            callback : function () {
                var coordsChurch = { lat : -7.757304, lng : 110.210794 },
                    coordsHome = { lat : -7.748422, lng : 110.183863 },
                    mapChurch,
                    mapHome,
                    markerChurch,
                    markerHome,
                    optionsChurch,
                    optionsHome;
                    
                optionsChurch = {
                    center : coordsChurch,
                    zoom    : 18
                };
                
                optionsHome = {
                    center : coordsHome,
                    zoom    : 16
                };
                
                mapChurch = new google.maps.Map(document.getElementById('map-church'), optionsChurch);
                mapHome = new google.maps.Map(document.getElementById('map-home'), optionsHome);
                
                markerChurch = new google.maps.Marker({
                    // animation   : google.maps.Animation.DROP,
                    icon        : '../img/ico_church_red.png',
                    // label       : 'G',
                    map         : mapChurch,
                    position    : coordsChurch,
                    title       : 'Gereja Katolik St Maria Tak Bernoda'
                });
                
                markerChurch = new google.maps.Marker({
                    // animation   : google.maps.Animation.DROP,
                    icon        : '../img/ico_home_red.png',
                    // label       : 'R',
                    map         : mapHome,
                    position    : coordsHome,
                    title       : 'Rumah Bpk Minardjo'
                });
                
                // get user current position
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        // console.log(position);
                        var userLat = position.coords.latitude,
                            userLng = position.coords.longitude,
                            userIcon = {
                                path : 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
                                fillColor : '#8e44ad',
                                fillOpacity : 1,
                                strokeWeight : 0
                            },
                            userMarkerToChurch = new google.maps.Marker({
                                icon : userIcon,
                                map : mapChurch,
                                position : {
                                    lat : userLat,
                                    lng : userLng
                                }
                            }),
                            userMarkerToHome = new google.maps.Marker({
                                icon : userIcon,
                                map : mapHome,
                                position : {
                                    lat : userLat,
                                    lng : userLng
                                }
                            }),
                            directionsServiceChurch = new google.maps.DirectionsService,
                            directionsServiceHome = new google.maps.DirectionsService,
                            directionsDisplayChurch = new google.maps.DirectionsRenderer,
                            directionsDisplayHome = new google.maps.DirectionsRenderer;
                            
                        directionsDisplayChurch.setMap(mapChurch);
                        directionsDisplayChurch.setOptions({
                            suppressMarkers: true
                        });
                        directionsServiceChurch.route({
                            origin : { lat : userLat, lng : userLng },
                            destination : coordsChurch,
                            
                            travelMode : google.maps.TravelMode.DRIVING
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplayChurch.setDirections(response);
                            } else {
                                window.alert('Permohonan arah gagal. Alasan: ' + status);
                            }
                        });
                            
                        directionsDisplayHome.setMap(mapHome);
                        directionsDisplayHome.setOptions({
                            suppressMarkers: true
                        });
                        directionsServiceChurch.route({
                            origin : { lat : userLat, lng : userLng },
                            destination : coordsHome,
                            
                            travelMode : google.maps.TravelMode.DRIVING
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplayHome.setDirections(response);
                            } else {
                                window.alert('Permohonan arah gagal. Alasan: ' + status);
                            }
                        });
                    });
                }
                
            },
            other_params : 'key=AIzaSyAFFk-GUknDy4bz4IwyqAziT7zZRPNFNiU' 
        });
         
        console.info('Church icon made by http://www.flaticon.com/authors/simpleicon and home icon made by http://www.freepik.com from http://www.flaticon.com are licensed by CC 3.0 BY');
     })
     .fail(function(){
        console.log(arguments[2].toString());
     });
    
}());