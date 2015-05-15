Meteor.publish("data", function () {
  return Data.find({});
});

Meteor.publish("buttonClicks", function() {
  return ButtonClicks.find();
});

Meteor.publish("clicks", function() {
  return Clicks.find();
});

Meteor.publish("camera", function() {
  return Camera.find();
});

// Authentication token
var auth = 'jQ5a6odf3qJfhjyZG8M73C3A8JQyHk6w7R';

// Last request
var rTime = new Date(1990, 06, 12, 8, 25, 0, 0);

Meteor.methods({
  'addClick': function(createdAt, status) {
    click = Data.find({"createdAt": new Date(createdAt)}).fetch();
    
    return Clicks.insert({
            createdAt: new Date(),
            clicked: click[0]._id,
            status: status
          });
  },
  'getClickStatus': function(id) {
    click = Clicks.find({"_id": id}).fetch();
    return click[0].status;
  },
  'insertLastClick': function() {
    var date = new Date();
    ButtonClicks.insert({dateTime: date});
    return date;
  },
  'insertCameraNotAvailable': function() {
    var date = new Date();
    Camera.insert({dateTime: date});
    return date;
  }

});

HTTP.methods({
  // Data: auth
  'getNewClicks': function(data) {
    //if (auth == data.auth) {
      clicks = Clicks.find({"createdAt": { $gt : rTime }}).fetch();
      var response = '';
      if (clicks.length > 0) {
        rTime = new Date();
        clicks.forEach(function(click){
          response += click._id + '|';
        });
        return response.substr(0, response.length -1);
      }
      this.setStatusCode(204); // No response
      return 'No new clicks';
    //}
    //this.setStatusCode(401);
    //return 'Unauthorized';
  },
  // Data: auth, id, status
  'updateClickPermission': function(data) {
    if (auth == data.auth) {
      Clicks.update({_id: data.id}, {$set: {status: data.status}});
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }  
  },
  // Data: auth, lat, lng, display, extra (type [, path])
  'addDatum': function(data) {
    if (auth == data.auth) {

      var lastMarker = null;
      var all = Data.find({}, {sort: {createdAt: -1}});

      if(lastMarker != null) {
        var b = (marker.lat - lastMarker.position.k);
        if (b < 0) {
          b = b * -1;
        }

        var c = (marker.lng - lastMarker.position.D);
        if (c < 0) {
          c = c * -1;
        }

        var a = Math.sqrt((b * b) + (c * c));

        var sin = b / a;
        var asin = Math.asin(sin);
        var degree = asin * (180 / Math.PI);

        var virado = null;

        //se a nova imagem está no 3 quadrante
        if (marker.lat < lastMarker.position.k && marker.lng > lastMarker.position.D) {
          degree = 180 - degree;
          virado = 3;
        }
        //se a nova imagem está no 2 quadrante
        else if (marker.lat > lastMarker.position.k && marker.lng > lastMarker.position.D) {
          virado = 2;
        }
        //se a nova imagem está no 1 quadrante
        else if (marker.lat > lastMarker.position.k && marker.lng < lastMarker.position.D) {
          degree = (90 - degree) * -1;
          virado = 1;
        }
        //se a nova imagem está no 4 quadrante
        else if (marker.lat < lastMarker.position.k && marker.lng < lastMarker.position.D) {
          degree = (degree * -1) - 90;
          virado = 4;
        }

        /*console.log(degree + ", virado para:" + virado);
        console.log(marker.lat + " - " + lastMarker.position.k + " | " + marker.lng + " - " + lastMarker.position.D);
        console.log("*******************");*/

        lastMarker.icon.rotation = degree;

        lastDegree = degree;
      }

      var id = Data.insert({
        createdAt: new Date(),
        geo_lat: data.lat,
        geo_lng: data.lng,
        display: data.display,
        extra: data.extra
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  },
  /* Clean DB functions */
  // Data: auth
  //'cleanData': function(data) {
    /*if (auth == data.auth) {
      Data.find().fetch().forEach(function(item){
        Data.remove({_id: item._id});
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }*/
    //Data.find().fetch().forEach(function(item){
      //Data.remove({_id: item._id});
    //});
  //},
  // Data: auth
  //'cleanClicks': function(data) {
    //if (auth == data.auth) {
      //Clicks.find().fetch().forEach(function(item){
        //Clicks.remove({_id: item._id});
      //});
    //} else {
      //this.setstatusCode(401);
      //return 'Unauthorized';
    //}
  //},
  // Data: auth
  //'cleanRequests': function(data) {
    //if (auth == data.auth) {
      //ButtonClicks.find().fetch().forEach(function(item){
        //ButtonClicks.remove({_id: item._id});
      //});
    //} else {
      //this.setstatusCode(401);
      //return 'Unauthorized';
    //}
  //},
  'getLastClick': function() {
    //if (auth == data.auth) {
      lastClick = ButtonClicks.findOne({}, {sort:{dateTime:-1}});
      if (lastClick != undefined) {
        last = lastClick.dateTime.getTime();
        now = new Date().getTime();
        result = (now - last) / 1000;

        var string = ButtonClicks.findOne({}, {sort:{dateTime:-1}}).dateTime + "|" + new Date() + "=" + result;

        if (result < 2)
          return 'clicked';
        else
          return 'not clicked';
      }
      else
        return 'not clicked';
    //}
  },
  'experimentSummary': function() {
    var html = '<html><body>';

    html += '<h1>Data (photos and paws)</h1>';
    html += '<table border="1">';
    html += '<tr><td align="center"><b>Document id</b></td><td align="center"><b>Created at</b></td><td align="center"><b>Latitude</b></td><td align="center"><b>Longitide</b></td><td align="center"><b>Object</b></td></tr>';
    Data.find().fetch().forEach(function(item) {
      html += '<tr><td align="center">' + item._id + '</td><td align="center">' + item.createdAt + '</td><td align="center">' + item.geo_lat + '</td><td align="center">' + item.geo_lng + '</td>';
      if(item.extra.type == 1) {
        html += '<td align="center"><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + item.extra.path + '"width="320" height="240"/></td>';
      }
      else {
        html += '<td align="center"><img src="images/gps.svg" width="14" height="14"/></td>';
      }
      html += '</tr>';
    });
    html += '</table><br /><br />';

    html += '<h1>Photos visualized</h1>';
    html += '<table border="1">';
    html += '<tr><td align="center"><b>Document id</b><td align="center"><b>Clicked time</b></td><td align="center"><b>Photo id</b></td><td align="center"><b>Visualized photo</b></td></tr>';
    Clicks.find().fetch().forEach(function(item) {
      html += '<tr><td align="center">' + item._id + '</td><td align="center">' + item.createdAt + '</td><td>' + item.clicked + '</td><td align="center"><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + Data.findOne({_id: item.clicked}).extra.path + '"width="320" height="240"/></td>';
      html += '</tr>';
    });
    html += '</table><br /><br />';

    html += '<h1>Photo request</h1>';
    html += '<table border="1">';
    html += '<tr><td align="center"><b>Document id</b><td align="center"><b>Request time</b></td></tr>';
    ButtonClicks.find().fetch().forEach(function(item) {
      html += '<tr><td align="center">' + item._id + '</td><td align="center">' + item.dateTime + '</td>';
      html += '</tr>';
    });
    html += '</table><br /><br />'; 

    html += '</html>';

    return html;
  },
  'insertData': function(data) {
    if (auth == data.auth) {
      var datetime = new Date(data.timestamp.year, data.timestamp.month, data.timestamp.day, data.timestamp.hours, data.timestamp.minutes, data.timestamp.seconds, data.timestamp.milliseconds);
      var id = Data.insert({
        createdAt: datetime,
        geo_lat: data.lat,
        geo_lng: data.lng,
        display: data.display,
        extra: data.extra
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  }
});
