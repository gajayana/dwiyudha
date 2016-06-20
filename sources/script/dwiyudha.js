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
                locationName    : 'Rumah Bpk Minardjo, Turusan RT 45/RW 21, Pendoworejo, Girimulyo',
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
                var getUserPosition,
                    map,
                    mapData,
                    mapOptions,
                    markerLocation,
                    populateMapInfo,
                    selectedMap = 'sakramen';
                    
                getUserPosition = function (mapData) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var directionsDisplay   =   new google.maps.DirectionsRenderer,
                            directionsService   =   new google.maps.DirectionsService,
                            userLat             =   position.coords.latitude,
                            userLng             =   position.coords.longitude,
                            userMarker          =   new google.maps.Marker({
                                                        icon        :   {
                                                                            path : 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
                                                                            fillColor : '#8e44ad',
                                                                            fillOpacity : 1,
                                                                            strokeWeight : 0
                                                                        },
                                                        map         :   map,
                                                        position    :   {
                                                                            lat : userLat,
                                                                            lng : userLng
                                                                        }
                                                    });
                        
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
                    $('.link-external').attr('href', 'https://maps.google.com/?q=' + mapData.coords.lat + ',' + mapData.coords.lng)
                                       .attr('target', '_blank');
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
                                
                                $(this).addClass('secondary');
                                
                                mapData = data[index];
                                
                                map.setOptions({
                                    center  : mapData.coords,
                                    zoom    : mapData.zoom
                                })
                                
                                markerLocation.setOptions({
                                    icon        : '../img/' + mapData.icon,
                                    position    : mapData.coords,
                                    title       : mapData.locationName
                                });
                                
                                getUserPosition(mapData);
                                populateMapInfo(mapData);
                                
                            } else {
                                $(this).removeClass('secondary');
                            }
                            
                        });
                        
                        
                    });
                });
                
                $('#refresh').on('click', function () {
                    getUserPosition(mapData);
                });
                
                // var coordsChurch    = { lat : -7.757304, lng : 110.210794 },
                //     coordsHome      = { lat : -7.748422, lng : 110.183863 },
                //     mapChurch,
                //     mapHome,
                //     markerChurch,
                //     markerHome,
                //     optionsChurch,
                //     optionsHome,
                //     guideUser;
                    
                // optionsChurch = {
                //     center              :   coordsChurch,
                //     mapTypeControl      :   false,
                //     rotateControl       :   false,
                //     scaleControl        :   false,
                //     scrollwheel         :   false,
                //     streetViewControl   :   false,
                //     zoom                :   18,
                //     zoomControl         :   false
                // };
                
                // optionsHome = {
                //     center          : coordsHome,
                //     mapTypeControl  : false,
                //     zoom            : 16
                // };
                
                // mapChurch = new google.maps.Map(document.getElementById('map-church'), optionsChurch);
                // mapHome = new google.maps.Map(document.getElementById('map-home'), optionsHome);
                
                // markerChurch = new google.maps.Marker({
                //     // animation   : google.maps.Animation.DROP,
                //     icon        : '../img/ico_church_red.png',
                //     map         : mapChurch,
                //     position    : coordsChurch,
                //     title       : 'Gereja Katolik St Maria Tak Bernoda'
                // });
                
                // markerChurch = new google.maps.Marker({
                //     // animation   : google.maps.Animation.DROP,
                //     icon        : '../img/ico_home_red.png',
                //     map         : mapHome,
                //     position    : coordsHome,
                //     title       : 'Rumah Bpk Minardjo'
                // });
                
                // get user current position
                // if (navigator.geolocation) {
                //     navigator.geolocation.getCurrentPosition(function (position) {
                //         // console.log(position);
                //         var userLat = position.coords.latitude,
                //             userLng = position.coords.longitude,
                //             userIcon = {
                //                 path : 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
                //                 fillColor : '#8e44ad',
                //                 fillOpacity : 1,
                //                 strokeWeight : 0
                //             },
                //             userMarkerToChurch = new google.maps.Marker({
                //                 icon : userIcon,
                //                 map : mapChurch,
                //                 position : {
                //                     lat : userLat,
                //                     lng : userLng
                //                 }
                //             }),
                //             // userMarkerToHome = new google.maps.Marker({
                //             //     icon : userIcon,
                //             //     map : mapHome,
                //             //     position : {
                //             //         lat : userLat,
                //             //         lng : userLng
                //             //     }
                //             // }),
                //             directionsServiceChurch = new google.maps.DirectionsService,
                //             // directionsServiceHome = new google.maps.DirectionsService,
                //             directionsDisplayChurch = new google.maps.DirectionsRenderer;
                //             // directionsDisplayHome = new google.maps.DirectionsRenderer;
                            
                //         directionsDisplayChurch.setMap(mapChurch);
                //         directionsDisplayChurch.setOptions({
                //             suppressMarkers: true
                //         });
                //         directionsServiceChurch.route({
                //             origin : { lat : userLat, lng : userLng },
                //             destination : coordsChurch,
                            
                //             travelMode : google.maps.TravelMode.DRIVING
                //         }, function (response, status) {
                //             if (status === google.maps.DirectionsStatus.OK) {
                //                 directionsDisplayChurch.setDirections(response);
                //             } else {
                //                 window.alert('Permohonan arah gagal. Alasan: ' + status);
                //             }
                //         });
                            
                //         // directionsDisplayHome.setMap(mapHome);
                //         // directionsDisplayHome.setOptions({
                //         //     suppressMarkers: true
                //         // });
                //         // directionsServiceChurch.route({
                //         //     origin : { lat : userLat, lng : userLng },
                //         //     destination : coordsHome,
                            
                //         //     travelMode : google.maps.TravelMode.DRIVING
                //         // }, function (response, status) {
                //         //     if (status === google.maps.DirectionsStatus.OK) {
                //         //         directionsDisplayHome.setDirections(response);
                //         //     } else {
                //         //         window.alert('Permohonan arah gagal. Alasan: ' + status);
                //         //     }
                //         // });
                //     });
                // }
                
            },
            other_params : 'libraries=geometry&key=AIzaSyAFFk-GUknDy4bz4IwyqAziT7zZRPNFNiU&language=id&region=ID' 
        });
         
        console.info('Church icon made by http://www.flaticon.com/authors/simpleicon and home icon made by http://www.freepik.com from http://www.flaticon.com are licensed by CC 3.0 BY');
     })
     .fail(function(){
        console.log(arguments[2].toString());
     });
    
}());