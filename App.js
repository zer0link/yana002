/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
      token: ''
    };
  }

  componentDidMount() {
    firebase.initializeApp({
      databaseURL: 'https://yana002-44365.firebaseio.com/'
    });
    console.log('Component did mount2');

    // firebase.messaging().hasPermission()
    //   .then(enabled => {
    //     if (!enabled) {
          firebase.messaging().requestPermission()
            .then(() => {
              console.log('Permission completed');
            });

          setTimeout(() => {
            firebase.messaging().getToken()
              .then(token => {

                firebase.database().ref().set({
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
    //     }
    //   }
    // );
    console.log('Component done mount');
    // firebase.auth()
    // .signInAnonymously()
    // .then(credential => {
    //   if (credential) {
    //     console.log('default app user ->', credential.user.toJSON());
    //   }
    // });


  }


//   notificationDisplayedListener() {firebase.notifications().onNotificationDisplayed((notification) => {
//     alert('onNotificationDisplayed');
//     // Process your notification as required
//     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
// })};
//   notificationListener() {firebase.notifications().onNotification((notification) => {
//   alert('notification');
//     // Process your notification as required
// })};

//   componentWillMount(){
//     this.notificationDisplayedListener();
//     this.notificationListener();
//   }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{this.state.token}</Text>
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
