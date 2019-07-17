import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';
import React, { Component } from 'react';
import InitGeoQuery from '../functions/InitGeoQuery';
import firebase from 'react-native-firebase';

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      position: { latitude: 0, longitude: 0 },
      geoQuery: null
    };
    this.UpdateMyMarker = this.UpdateMyMarker.bind(this);
    this.UpdateCriteria = this.UpdateCriteria.bind(this);

    this.myName = "maps";
    console.log("Maps ", props.position);
  };

  componentWillReceiveProps(props) {
    if(props.firstTimeLoaded){
      console.log("componentWillReceiveProps");
      this.UpdateMyMarker(props.position);
      this.setState({ position: props.position });
      this.SetGeoQueryEvents();
    }

    // if (props.position != null) {
    //   this.setState({ position: props.position });
    //   console.log("Postion updated via component update");
    //   this.SetGeoQueryEvents();
    // } else {
    // }
  }

  SetGeoQueryEvents = () => {
    var firebaseRef = firebase.database().ref('geofire');
    this.initGeoQuery = new InitGeoQuery();

    this.initGeoQuery.on('update_marker', marker => {
      this.UpdateMarker(marker);
    });

    this.initGeoQuery.StartUp(firebaseRef, this.state.position, this);
  }

  UpdateCriteria(component, latitude, longitude) {
    console.log("position updated with moving");
    this.UpdateMyMarker({latitude, longitude});
    _geoQuery.updateCriteria({ center: [latitude, longitude] })
  }

  UpdateMarker = (marker) => {
    var markers = this.state.markers;
    var index = markers.findIndex((x)=>{return x.key == marker.key});
    if (index < 0){
      markers.push(marker);
    } else {
      markers[index] = marker;
    }
    this.setState({markers});
  };

  UpdateMyMarker(myLocation){
    //let's Map handle markers
    var markers = this.state.markers;
    // var markers = this.markers;
    
    var index = markers.findIndex((x)=>{return x.key == "Yourself"});
    var latestMarker = {
      coordinate:{latitude: myLocation.latitude,
                  longitude: myLocation.longitude},
      title: "Yourself",
      description: "Your position",
      key: "Yourself",
      timestamp: new Date().getTime()
    }
    if (index < 0){
      markers.push(latestMarker);
    } else {
      markers[index] = latestMarker;
      console.log("latest marker ",latestMarker)
    }

    console.log("markers ",markers);
    this.setState({markers});
  };

  SetWatchPosition() {
    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.watchPosition(success, error, options);
  }

  render() {
    var markers = [];
    this.state.markers.map(marker => {
      markers.push(<Marker
        key={marker.key}
        coordinate={marker.coordinate}
        title={marker.title}
        description={marker.description}
        pinColor={marker.pinColor}
      />);
    })
    console.log("Position in map", this.state.position);
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.position.latitude,
            longitude: this.state.position.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {markers}
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});