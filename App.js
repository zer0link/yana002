/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,Alert,Button } from 'react-native';
import firebase from 'react-native-firebase';
import GeoFire from 'geofire';
import Map from './components/Map';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      token: '',
      location: '',
      deviceLocation: '',
      distance: 0
    };
    this.setDistanceToState = this.setDistanceToState.bind(this);
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
  
        this.setState({ location:position });
        console.log(location);
        console.log("position", this.state.location);
        firebase.database().ref('DeviceLocation').push({
          token: this.state.token,
          location: location
        }).then((data) => {

          alert("save:" + location);
        }).catch((error) => {
          //error callback
          alert("can't save " + error);
        })
        
        testGeoFire();

      },
      error =>
      {
        Alert.alert(error.message);
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
    );

    var testGeoFire = () =>{
      var location = this.state.location.coords;
      var firebaseRef = firebase.database().ref('geofire') ;
      console.log(this);
      var component = this;
      var geoFire = new GeoFire(firebaseRef);
      console.log("location :" , location.latitude)
      geoFire.set("weiyangListener", [location.latitude, location.longitude]).then(function() {
        console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
      });

      var geoQuery = geoFire.query({center:[location.latitude, location.longitude], radius: 10});

      geoQuery.on("ready", function () {
        console.log("GeoQuery has loaded and fired all other events for initial data");
      });

      geoQuery.on("key_entered", function (key, location, distance) {
        console.log("entered");
        component.setState({distance});
      });

      geoQuery.on("key_exited", function (key, location, distance) {
        console.log("exited");
        component.setState({distance});

      });

      geoQuery.on("key_moved", function (key, location, distance) {
        console.log("moved");
        component.setState({distance});
      });
      
    }
    
  }

  setDistanceToState(distance) {
    this.setState({distance});
  }
  
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyBl-fHzZByHAT1t7l_axN-LoEK43HEcV-4",
      authDomain: "yana002-44365.firebaseapp.com",
      databaseURL: "https://yana002-44365.firebaseio.com",
      projectId: "yana002-44365",
      storageBucket: "yana002-44365.appspot.com",
      messagingSenderId: "458306088909"
    };
    firebase.initializeApp(config);

    console.log('Component did mount2');

          firebase.messaging().requestPermission()
            .then(() => {
              console.log('Permission completed');
            });

          setTimeout(() => {
            firebase.messaging().getToken()
              .then(token => {

                firebase.database().ref("Token").push({
                  token: token
                }).then((data) => {

                  alert("save:" + token);
                }).catch((error) => {
                  //error callback
                  alert("can't save " + error);
                })

                this.setState({ token });
                alert(token);
              })
              .catch(err => {
                alert(err);
              });
          }, 3000);

    this.doThings;
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{this.state.token}</Text>
        {/* <Text>{this.state.location}</Text> */}
        <Button title="Press here" onPress={this.findCoordinates}>Press me</Button>
        <Text style={styles.instructions}>Location = {this.state.distance} km away from here</Text>
        <Map />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
