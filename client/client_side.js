//Susbscribe to desired collection
dataSubscription = Meteor.subscribe("data");
ButtonClicks = Meteor.subscribe("buttonClicks");
Clicks = Meteor.subscribe("clicks");


/*--------------MAP-------------*/

// When the map DOM is rendered, initialize google maps
Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();
}

// Avoids reloading of map on every meteor update
Template.map.destroyed = function() {
    Session.set('map', false);
}

function showMessage(message) {
  $("#messageRequestPhoto").text(message);
  $("#messageRequestPhoto").addClass("showMessageRequest");
  setTimeout(function () {
    $("#messageRequestPhoto").removeClass("showMessageRequest");
  }, 8000);
}

function setBusy(busy) {
  Session.set("busy", busy);
}

Template.map.events = {
  "click .buttonRequest" : function() {

    var ret = Meteor.call("insertLastClick", function(error, result) {
      console.log('result: ' + result);
    });
    //console.log(ButtonClicks);

    if(!Session.get('busy')) {
      setBusy(true);
      var lastPhotoId = null;
      var list = Data.find({}, {sort:{createdAt:1}});
      list.forEach(function(entry) {
        if(entry.extra.type == 1) {
          lastPhotoId = entry;
        }
      });

      setTimeout(function () {

        var lastPhotoId2 = null;
        var list = Data.find({}, {sort:{createdAt:1}});
        list.forEach(function(entry) {
          if(entry.extra.type == 1) {
            lastPhotoId2 = entry;
          }
        });

        if (lastPhotoId2._id == lastPhotoId._id) {
          showMessage("Sorry, the camera is not available right now.");
        }
        setBusy(false);
      }, 20000);
    }
  }
}

//Helper functions for the map template
Template.map.helpers({
  data: function () {
    return Data.find({}, {sort: {createdAt: 1}});
  },
  buttonClicks: function () {
    return ButtonClicks.find();
  },
  addMapMarker: function () {
    //console.log(lastMarker);

    var icon_type = 'images/gps.svg';
    if (Session.get('map')) {
      if (this.extra.type == 1) {
          icon_type = 'images/photo.svg';
      } else if (this.extra.type != 0) {
          throw '[ERROR] Not a valid data type!';
          return;
      }

      var marker = {
        createdAt: this.createdAt,
        lat: this.geo_lat,
        lng: this.geo_lng,
        icon: icon_type,
        data: this.extra,
      }

      gmaps.addMarker(marker);
      


      //console.log (marker);
      //new google.maps.event.trigger(maker, 'click');
    }
  }
});

/*--------------BODY--------------*/

// Helper functions used inside body
Template.body.helpers({
  // Check if data have been loaded
  dataReady: function() {

    return dataSubscription.ready();
  }
});
