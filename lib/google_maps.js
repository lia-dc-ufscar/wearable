var infoWindow = null;
var oms = null;
var poly = null;
var waiting = false;

// map object
var map = null;
 
// google markers objects
var markers = [];
 
// google lat lng objects
var latLngs = [];

lastMarker = null;
lastDegree = 0;

 
// formatted marker data objects
// marker {
//	createdAt: Date
//	lat: float
//	lng: float
 //  icon: string
//	data {
// 		type: int (0: no_data, 1: photo)
//		path: string
//	}
// }
var markerData = [];

gmaps = {
    // add a marker given our formatted marker data object
    addMarker: function(marker) {

        var wContent = '';
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker;
        if (marker.data.type == 0) {
          
          if(lastMarker != null) {
            
	    /*console.log("Marker.lat: " + marker.lat);
	    console.log("lastMarker.lat: " + lastMarker.position.lat());
	    console.log("Markert.lng: " + marker.lng);
	    console.log("lastMarker.lng: " + lastMarker.position.lng());*/

            var b = (marker.lat - lastMarker.position.lat());
            var c = (marker.lng - lastMarker.position.lng());
            var a = Math.sqrt((b * b) + (c * c));
            var sin = b / a;
            var asin = Math.asin(sin);
            var degree = asin * (180 / Math.PI);

            var angle = degree;
            var virado = null;

	    console.log("b: " + b);
	    console.log("c: " + c);

            //se a nova imagem está no 1 quadrante
                 if (b > 0 && c > 0) {
              virado = 1;
	      angle = 90 - angle;
            }
            //se a nova imagem está no 2 quadrante
            else if (b < 0 && c > 0) {
              virado = 2;
	      angle *= -1;
	      angle += 90;
            }
            //se a nova imagem está no 3 quadrante
            else if (b < 0 && c < 0) {
              virado = 3;
	      angle *= -1;
	      angle = 180 - 90 - angle;
	      angle += 180;
            }
            //se a nova imagem está no 4 quadrante
            else if (b > 0 && c < 0) {
              virado = 4;
	      angle = 180 - 90 - angle;
	      angle *= -1;
            }

            else if (b > 0 && c == 0) {
              virado = 5;
	      angle = 0;
            }
	    else if (b == 0 && c > 0) {
	      virado = 6;
	      angle = 90;
            }
	    else if (b < 0 && c == 0) {
	      virado = 7;
	      angle = 180;
	    }
	    else if (b == 0 && c < 0) {
	      virado = 8;
	      angle = 270;
	    }
	    else {
	      virado = 9;
	    }

            //console.log("Angle: " + angle);
            //console.log("Virado: " + virado);
            /*console.log(degree + ", virado para:" + virado);
            console.log(marker.lat + " - " + lastMarker.position.k + " | " + marker.lng + " - " + lastMarker.position.D);
            console.log("*******************");*/

            lastMarker.icon.rotation = angle;
            //lastMarker.icon.fillColor = '#935252';
            lastMarker.icon.fillColor = '#b25853';
            lastMarker.setMap(null);
            lastMarker.setMap(map);

            lastDegree = angle * 1;
          }
          var icon = {
            path: "M61.397,35.36c0.006,26.363-20.467,47.736-45.725,47.742c-25.26,0.005-45.741-21.362-45.744-47.726 c0-0.012,0-0.012,0-0.017c-0.005-26.367,20.47-47.742,45.728-47.745C40.92-12.391,61.397,8.98,61.397,35.344 C61.397,35.35,61.397,35.354,61.397,35.36z M-25.646-2.565c0,10.812-6.588,19.58-14.717,19.58 c-8.128,0.003-14.719-8.762-14.719-19.572c0-0.003,0-0.005,0-0.008c-0.003-10.811,6.585-19.578,14.713-19.581 c8.131,0,14.719,8.763,14.722,19.575C-25.646-2.568-25.646-2.565-25.646-2.565z M8.388-34.678c0,10.19-6.467,18.452-14.447,18.455 c-7.977,0-14.447-8.26-14.45-18.449c0,0,0-0.003,0-0.006c0-10.189,6.468-18.449,14.447-18.45 c7.98,0,14.447,8.257,14.45,18.447 C8.388-34.681,8.388-34.678,8.388-34.678z M52.219-34.678c0,10.19-6.6,18.45-14.73,18.45c-8.137,0.002-14.73-8.254-14.73-18.444 c0,0,0-0.003,0-0.006c-0.005-10.187,6.589-18.447,14.725-18.449c8.137,0,14.736,8.257,14.736,18.444 C52.219-34.681,52.219-34.678,52.219-34.678z M87.103-1.231c0,10.039-6.215,18.178-13.879,18.178 c-7.675,0.003-13.89-8.134-13.89-18.172c0,0,0-0.003,0-0.005c-0.006-10.036,6.215-18.175,13.879-18.178 c7.675,0,13.89,8.136,13.89,18.172C87.103-1.234,87.103-1.231,87.103-1.231z",
            fillOpacity: 0.8,
            fillColor: '#FF0000',
            anchor: new google.maps.Point(0, 0),
            strokeWeight: 0,
            scale: .10,
            rotation: lastDegree
          }

          gMarker = new google.maps.Marker({
              position: gLatLng,
              map: map,
              icon: icon,
              clickable: false,
              zIndex: 0,
              rotation: lastDegree,
              optimized: false
          });

          lastMarker = gMarker;
        }
        else {
          var icon = {
            url: marker.icon,
            scaledSize: new google.maps.Size(14, 14),
            size: new google.maps.Size(14, 14)
          };

          gMarker = new google.maps.Marker({
              position: gLatLng,
              map: map,
              icon: icon,
              zIndex: 5,
              optimized: false
          });
        }

        //console.log("zIndex: " + gMarker.zIndex);

        switch(marker.data.type) {
          case 0:
            wContent = '<div id="content" style="white-space: nowrap;">Was here on: ' + marker.createdAt.toLocaleString() + '</div>'
            break;
          case 1:
            wContent = '<div id="content"><p>Saw this on: ' + marker.createdAt.toLocaleString() + '</p><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + marker.data.path + '"width="320" height="240"/></div>'
            break;
          default:
            throw('[ERROR] Not a valid data type');
        }

        gMarker.content = wContent;
        

        /*var path = poly.getPath();
        path.push(gLatLng);*/

        if(marker.data.type == 1) {
          oms.addMarker(gMarker);  
          /*google.maps.event.addListener(gMarker, 'click', function() {
            if (!waiting) {
              waiting = true;
              createdAt = markerData[markers.indexOf(gMarker)].createdAt; 
              infoWindow.setContent('<div id="content" style="text-align: center;">Waiting for permission to view information</br><img src="images/loading.gif" width="64" height="64"/></div>');
              infoWindow.open(this.map, gMarker);
              Meteor.call('addClick', createdAt, 2, 
                function(error, result) {
                  if (error) {
                    console.log("[ERROR] addClick: ", error.reason);
                  }
                  else {
                    setTimeout(function(){
                      Meteor.call('getClickStatus', result, 
                        function(error, result){
                          if(error){
                            console.log("[ERROR] getClickStatus", error.reason);
                          }
                          else{
                            switch (result) {
                              case 0:
                                infoWindow.setContent('<div id="content">Your request for permission was denied</div>');
                                break;
                              case 1:
                                infoWindow.setContent(gMarker.content);
                                break;
                              default:
                                infoWindow.setContent('<div id="content">Your request for permission was not viewed</br>Try again later</div>');
                            }
                            infoWindow.open(gMarker.map, gMarker);
                            waiting = false;
                          }
                      });
                    }, 10000);
                  }
              });
            }  
          });*/
          
          

          infoWindow.setContent(gMarker.content);
            

          google.maps.event.addListener(gMarker, 'click', function() {
            createdAt = markerData[markers.indexOf(gMarker)].createdAt; 
            infoWindow.setContent(gMarker.content);
            infoWindow.open(this.map, gMarker);
            setTimeout(function () {
              infoWindow.close();
            }, 20000);
            Meteor.call('addClick', createdAt, 1, 
              function(error, result) {
                if (error) {
                  //console.log("[ERROR] addClick: ", error.reason);
                }
                else {
                  //console.log("result: " + result);
                }
              }); 
            //console.log(this.map);
          });

          infoWindow.open(map, gMarker);

          setTimeout(function () {
            infoWindow.close();
          }, 30000);

        }

        markerData.push(marker);
        latLngs.push(gLatLng);
        markers.push(gMarker);
        //this.calcBounds();
        /*map.setCenter(49.2626503, -123.2452913);
        map.setZoom(15);*/
        return gMarker;
    },


    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = latLngs.length; i < latLngLength; i++) {
            bounds.extend(latLngs[i]);
        }
        map.fitBounds(bounds);
    },
 
    
 
    // intialize the map
    initialize: function() {
        //console.log("[+] Intializing Google Maps...");
        
        var myStyles =[
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                      { visibility: "off" }
                ]
            }
        ];

        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(49.2603819, -123.2476312),
            mapTypeId: google.maps.MapTypeId.HYBRID,
						disableDefaultUI: true,
            draggable: false,
            disableDoubleClickZoom: true,
            zoomControl: false,
            scrollwheel: false,
            scaleControl: false,
            rotateControl: false,
            panControl: false,
            styles: myStyles
        };
 
        map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );
 
        infoWindow = new google.maps.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true});

        /*var polyOptions = {
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        };
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);*/

        // global flag saying we intialized already
        Session.set('map', true);
    }
}
