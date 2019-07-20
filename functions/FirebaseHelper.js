import {Application as app} from './Share';
import firebase from 'react-native-firebase';

export function InitFirebaseApp(){
    let config = {
        apiKey: "AIzaSyBl-fHzZByHAT1t7l_axN-LoEK43HEcV-4",
        authDomain: "yana002-44365.firebaseapp.com",
        databaseURL: "https://yana002-44365.firebaseio.com",
        projectId: "yana002-44365",
        storageBucket: "yana002-44365.appspot.com",
        messagingSenderId: "458306088909"
    };

    if(!app.firebaseApp){
        app.firebaseApp = firebase.initializeApp(config);
    }
}

export function RequestMessagingPermission(){
    firebase.messaging().requestPermission();
    setTimeout(() => {
        firebase.messaging().getToken()
            .then(token => {
    
                firebase.database().ref("Token").push({
                    token: token
                }).then((data) => {
                }).catch((error) => {
                    alert("can't save " + error);
                })
                app.token = token;
            })
            .catch(err => {
                alert(err);
            });
    }, 3000);
}

