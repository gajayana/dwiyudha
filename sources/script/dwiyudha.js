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
        }),
        data = [
            {
                id              : 'sakramen',
                start           : '2016-07-13T09:00:00+07:00',
                end             : '2016-07-13T11:00:00+07:00',
                icon            : 'ico_church_red.png',
                coords          : { lat : -7.757304, lng : 110.210794 },
                title           : 'Sakramen Pernikahan',
                locationName    : 'Gereja Katolik St. Maria Tak Bernoda, Karang, Jatisarono, Nanggulan, Kulon Progo',
                zoom            : 18
            },
            {
                id              : 'syukuran',
                start           : '2016-07-13T12:00:00+07:00',
                end             : '2016-07-13T14:00:00+07:00',
                icon            : 'ico_home_red.png',
                coords          : { lat : -7.748422, lng : 110.183863 },
                title           : 'Syukuran',
                locationName    : 'Rumah Bpk Minarjo, Turusan RT 45/RW 21, Pendoworejo, Girimulyo',
                zoom            : 16
            },
        ];
    
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
                
                // define variables
                var directionsDisplay = new google.maps.DirectionsRenderer,
                    directionsService = new google.maps.DirectionsService,
                    getUserPosition,
                    map,
                    mapData,
                    mapOptions,
                    markerInfowindow,
                    markerLocation,
                    populateMapInfo,
                    selectedMap = 'sakramen',
                    userMarker;
                    
                getUserPosition = function (mapData) {
                    // get user current location, need user's permission
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var userLat             =   position.coords.latitude,
                            userLng             =   position.coords.longitude;
                        
                        // set user marker position
                        userMarker  =   new google.maps.Marker({
                                            icon        :   {
                                                                path            : 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
                                                                fillColor       : '#8e44ad',
                                                                fillOpacity     : 1,
                                                                strokeWeight    : 0
                                                            },
                                            map         :   map,
                                            position    :   {
                                                                lat : userLat,
                                                                lng : userLng
                                                            }
                                        });
                                        
                        // directionsDisplay = new google.maps.DirectionsRenderer;
                        // directionsService = new google.maps.DirectionsService;
                            
                        
                        directionsDisplay.setMap(map);
                        directionsDisplay.setOptions({
                            suppressMarkers: true
                        });
                        
                        directionsService.route({
                            origin : { lat : userLat, lng : userLng },
                            destination : mapData.coords,
                            
                            travelMode : google.maps.TravelMode.DRIVING
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            } else {
                                window.alert('Permohonan arah gagal. Alasan: ' + status);
                            }
                        });
                            
                        // console.log(userLat, userLng);
                    });
                };
                
                populateMapInfo = function (mapData) {
                    var dt = new Date(mapData.start),
                        h = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours(),
                        m = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes(),
                        t = h + ':' + m;
                    
                    $('.txt-emphasize').text(t + ' WIB ');
                    $('.txt-title').text(mapData.title);
                    $('.txt-location-name').text(mapData.locationName);
                    // $('.link-external').attr('href', 'https://maps.google.com/?q=' + mapData.coords.lat + ',' + mapData.coords.lng)
                    //                   .attr('target', '_blank');
                };
                    
                // get initial data
                $.each(data, function () {
                    if (this.id === selectedMap) {
                        mapData = this;
                    }
                });
                
                // console.log(mapData);
                
                // set initial options for map
                mapOptions = {
                    center              :   mapData.coords,
                    mapTypeControl      :   false,
                    rotateControl       :   false,
                    scaleControl        :   false,
                    scrollwheel         :   false,
                    streetViewControl   :   false,
                    zoom                :   mapData.zoom,
                    zoomControl         :   false
                }
                
                // set map
                map = new google.maps.Map(document.getElementById('map'), mapOptions);
                
                // set initial location marker position
                markerLocation = new google.maps.Marker({
                    icon        : '../img/' + mapData.icon,
                    map         : map,
                    position    : mapData.coords,
                    title       : mapData.locationName
                });
                
                // set initial marker infoWindow
                markerInfowindow = new google.maps.InfoWindow({
                    content : '<a href="https://maps.google.com/?q=' + mapData.coords.lat + ',' + mapData.coords.lng + '" target="_blank">Buka di peta Google</a>'
                });
                
                markerInfowindow.open(map, markerLocation);
                
                // set initial map info
                populateMapInfo(mapData);
                
                if (navigator.geolocation) {
                    getUserPosition(mapData);
                }
                
                $('.map-selection').each(function () {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        var obj = $(this);
                        
                        $('.map-selection').each(function (index) {
                            if ( obj.data('id') === $(this).data('id') ) {
                                
                                markerInfowindow.close();
                                 
                                $(this).addClass('secondary');
                                
                                mapData = data[index];
                                
                                map.setOptions({
                                    center  : mapData.coords,
                                    zoom    : mapData.zoom
                                });
                                
                                markerLocation.setOptions({
                                    icon        : '../img/' + mapData.icon,
                                    position    : mapData.coords,
                                    title       : mapData.locationName
                                });
                                
                                // remove any visible user marker                            
                                if (userMarker.getVisible()) {
                                    userMarker.setMap(null);
                                    userMarker = null;
                                    directionsDisplay.setMap(null);
                                }
                                
                                markerInfowindow.open(map, markerLocation);
                                markerInfowindow.setContent('<a href="https://maps.google.com/?q=' + mapData.coords.lat + ',' + mapData.coords.lng + '" target="_blank">Buka di peta Google</a>');
                                populateMapInfo(mapData);
                                getUserPosition(mapData);
                                
                                
                            } else {
                                $(this).removeClass('secondary');
                            }
                            
                        });
                        
                        
                    });
                });
                
                $('#refresh').on('click', function () {
                    // remove any visible user marker                            
                    if (userMarker.getVisible()) {
                        userMarker.setMap(null);
                        userMarker = null;
                        directionsDisplay.setMap(null);
                    }
                    getUserPosition(mapData);
                });
                
                
                
            },
            other_params : 'libraries=geometry&key=AIzaSyAFFk-GUknDy4bz4IwyqAziT7zZRPNFNiU&language=id&region=ID' 
        });
         
        console.info('Church icon made by http://www.flaticon.com/authors/simpleicon and home icon made by http://www.freepik.com from http://www.flaticon.com are licensed by CC 3.0 BY');
     })
     .fail(function(){
        console.log(arguments[2].toString());
     });
    
}());