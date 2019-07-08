import GeoFire from 'geofire';
const EventEmitter = require('events');

export default class InitGeoQuery extends EventEmitter {

  // constructor(){
  //   this.UpdateMarker = this.UpdateMarker.bind(this);
  // }

    StartUp(firebaseRef,location, component){
      component.geoFire = new GeoFire(firebaseRef);
      var component2 = this;

      component.geoFire.set("wyangListener", [location.latitude, location.longitude]).then(function() {
        console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
      });

      component._geoQuery = component.geoFire.query({center:[location.latitude, location.longitude], radius: 100});

      component._geoQuery.on("ready", function () {
        console.log("GeoQuery has loaded and fired all other events for initial data");
      });

      component._geoQuery.on("key_entered", function (key, location, distance) {
        console.log("location : " ,location);
        var marker = {
            coordinate:{latitude: location[0],
                        longitude: location[1]},
            title: key,
            description: ' ' + distance,
            key
          };
        component2.UpdateMarker(marker,component);
      });

      component._geoQuery.on("key_exited", function (key, location, distance) {
        console.log("exited");
        component.setState({distance});
      });

      component._geoQuery.on("key_moved", function (key, location, distance) {
        console.log("moved");
        var marker = {
            coordinate:{latitude: location[0],
                        longitude: location[1]},
            title: key,
            description: ' ' + distance,
            key
          };
        component2.UpdateMarker(marker,component);
      });
    }

    UpdateMarker = (marker,component) => {
      var markers = component.state.markers;
      var index = markers.findIndex((x)=>{return x.key == marker.key});
      if (index < 0){
        markers.push(marker);
      } else {
        markers[index] = marker;
        console.log("latest marker ",marker)
      }
      
      // console.log("markers ",markers);
      // component.setState({markers});
      this.emit('update_markers',markers);
    };
}