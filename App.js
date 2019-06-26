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
      places: []
    };
    this.setDistanceToState = this.setDistanceToState.bind(this);
  }
 

  findCoordinates = () => {
    // this.setState({ location: Object.assign( {} , this.state.location, {latitude:1,longitude:1}) });
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
  
        this.setState({ location: Object.assign( {} , this.state.location, position.coords) });
        console.log(this.state.location);
        console.log("position", this.state.location);
        firebase.database().ref('DeviceLocation').push({
          token: this.state.token,
          location: location.coords
        }).then((data) => {

          alert("save:" + location);
        }).catch((error) => {
          //error callback
          alert("can't save " + error);
        })
        // setMarkerState();
      },
      error =>
      {
        Alert.alert(error.message);
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
    );

   
    var setMarkerState = () =>{
      var markers = this.state.markers;
      var index = markers.findIndex((x)=>{return x.key == "Yourself"});
      var latestMarker = {
        coordinate:{latitude: this.state.location.latitude,
                    longitude: this.state.location.longitude},
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
        <Button title="Press here" onPress={this.findCoordinates}>Press me</Button>
        <Text style={styles.instructions}>Location = {this.state.distance} km away from here</Text>
        <Text style={styles.instructions}>Test value : {this.state.test}</Text>
        <Map position={this.state.location} />
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

export default App