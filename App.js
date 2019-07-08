/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import Map from './components/Map';
// import ListItem from './components/ListItem';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


class App extends Component {

  constructor() {
    super();
    this.state = {
      test: '',
      token: '',
      location: null,
      deviceLocation: '',
      distance: 0,
      placeName: '',
      places: [],
      locationNow: '',
      statusText: '',
      firstTimeLoaded: false
    };
    this.watchId = 0;
    this.watchLocation = this.watchLocation.bind(this);
    // this.findCoordinates = this.findCoordinates.bind(this);
  }

  watchLocation() {
    this.setState({ statusText: "watchLocation called." });

    var appComponent = this;
    var myMap = this.myMap;
    //console.log("mymap:", component);

    if (!appComponent.state.firstTimeLoaded) {
      this.setState({ statusText: "getCurrentPosition called." });

      navigator.geolocation.getCurrentPosition(
        pos => {
          this.setState({ statusText: `getCurrentPosition: ${pos.coords.longitude}, ${pos.coords.latitude} ` });
          appComponent.setState({ firstTimeLoaded: true, location: Object.assign({}, this.state.location, pos.coords) });
          this.setState({ statusText: "watchPosition called." });

          appComponent.watchId = navigator.geolocation.watchPosition(
            (pos) => {
              var today = new Date();
              var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
              appComponent.setState({ statusText: `Time: ${time} : ${pos.coords.latitude}, ${pos.coords.longitude}` });
              myMap.UpdateCriteria(myMap, pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
              console.log("watchPosition failed", error);
              appComponent.setState({ statusText: "watchPosition failed" });
            },
            {
              enableHighAccuracy: true,
              timeout: 2000,
              maximumAge: 3600000
            });
        },
        error => {
          console.log("getCurrentPosition failed", error);
        },
        { enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000 }
      );
      return;
    }
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
    firebase.messaging().requestPermission();
    setTimeout(() => {
      firebase.messaging().getToken()
        .then(token => {

          firebase.database().ref("Token").push({
            token: token
          }).then((data) => {
          }).catch((error) => {
            //error callback
            alert("can't save " + error);
          })

          this.setState({ token });
        })
        .catch(err => {
          alert(err);
        });
    }, 3000);

    this.doThings;
  }


  render() {
    console.log("Rerender app.js", this.state.location);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{this.state.token}</Text>
        {/* <Text>{this.state.location}</Text> */}
        {/* <Button title="Press here" onPress={this.findCoordinates}>Press me</Button> */}
        <Text style={styles.instructions}>Location = {this.state.distance} km away from here</Text>
        <Text style={styles.instructions}>Test value : {this.state.test}</Text>
        <View style={styles.mapContainer}>
          <Map firstTimeLoaded={this.state.firstTimeLoaded} position={this.state.location} ref={(abc) => { this.myMap = abc }} />
        </View>
        <Button title="Alert watch id" onPress={this.watchLocation}>Press me</Button>
        <Text style={styles.instructions}>{this.state.locationNow}</Text>
        <Text style={styles.instructions}>{this.state.statusText}</Text>
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
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
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

export default App