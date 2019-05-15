import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Platform, StyleSheet, Text, View,Alert,Button } from 'react-native';
import React, { Component } from 'react';


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
     render(){
       var markers = [];
       this.props.markers.map(marker =>{
         markers.push(<Marker
         key={marker.key}
         coordinate = {marker.coordinate}
         title = {marker.title}
         description = {marker.description}
         pinColor = {marker.pinColor}
         />);
       })
       console.log(markers);
       return (
        <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.props.position.latitude,
            longitude: this.props.position.longitude,
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