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
      deviceLocation: ''
    };
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
  
        this.setState({ location });
        console.log(location);
        firebase.database().ref('DeviceLocation').push({
          token: this.state.token,
          location: location
        }).then((data) => {

          alert("save:" + location);
        }).catch((error) => {
          //error callback
          alert("can't save " + error);
        })

      },
      error =>
      {
        Alert.alert(error.message);
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 }
    );
  }
  componentDidMount() {
    firebase.initializeApp({
      databaseURL: 'https://yana002-44365.firebaseio.com/'
    });
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
        <Text>{this.state.location}</Text>
        <Button title="Press here" onPress={this.findCoordinates}>Press me</Button>
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
