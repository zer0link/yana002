import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Platform, StyleSheet, Text, View,Alert,Button } from 'react-native';
import React, { Component } from 'react';
import InitGeoQuery from '../functions/InitGeoQuery';
import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });

   export default class Map extends Component{
     
     constructor(props){
       super(props);
       this.state = {
         markers: [],
         position: {latitude:0,longitude:0},
         geoQuery: null
       };
       this.myName = "maps";
       console.log("Maps ", props.position);
     };
    
    componentWillReceiveProps(props){
      if (props.position!=null){
        this.setState({position:props.position});
        console.log("Postion updated via component update");
        this.SetGeoQueryEvents();
      }else{
      }
    }

    testfn() {
      console.log("get in this function");
    }
    
    SetGeoQueryEvents  = () =>{
      var firebaseRef = firebase.database().ref('geofire') ;
      this.initGeoQuery = new InitGeoQuery();
      
      this.initGeoQuery.on('update_markers', markers => {
        this.setState(markers);
      });

      this.initGeoQuery.StartUp(firebaseRef, this.state.position, this); 
    }


    success(component,latitude,longitude) {
      console.log("position updated with moving");
      component._geoQuery.updateCriteria({center: [latitude,longitude]})
    }

    error(){
      console.log("failed to watch position");
    }


    SetWatchPosition(){
      
      options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.watchPosition(success, error, options);
    }

     render(){
       var markers = [];
       this.state.markers.map(marker =>{
         markers.push(<Marker
         key={marker.key}
         coordinate = {marker.coordinate}
         title = {marker.title}
         description = {marker.description}
         pinColor = {marker.pinColor}
         />);
       })
       console.log("Position in map",this.state.position);
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