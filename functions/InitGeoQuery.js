import GeoFire from 'geofire';
const EventEmitter = require('events');

export default class InitGeoQuery extends EventEmitter {

  _geoFire = null;
  _geoQuery = null;

  BuildMarker = (key, location, distance) => {
    return {
      coordinate: {
        latitude: location[0],
        longitude: location[1]
      },
      title: key,
      description: ' ' + distance,
      key
    };
  }

  StartUp(firebaseRef, location, component, myName) {
    _geoFire = new GeoFire(firebaseRef);
    var me = this;

    _geoFire.set(myName, [location.latitude, location.longitude]).then(function () {
    }, function (error) {
    });

    _geoQuery = _geoFire.query({ center: [location.latitude, location.longitude], radius: 100 });

    _geoQuery.on("ready", function () {
    });

    _geoQuery.on("key_entered", function (key, location, distance) {
      const marker = me.BuildMarker(key, location, distance);
      me.emit('update_marker', marker);
    });

    _geoQuery.on("key_exited", function (key, location, distance) {
      component.setState({ distance });
    });

    _geoQuery.on("key_moved", function (key, location, distance) {
      const marker = me.BuildMarker(key, location, distance);
      me.emit('update_marker', marker);
    });
  }
}