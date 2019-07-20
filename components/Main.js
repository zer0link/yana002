import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Map from './Map';
import Geolocation from 'react-native-geolocation-service';
import { RequestLocationPermission } from '../functions/RequestLocationPermission';
import { InitFirebaseApp, RequestMessagingPermission } from '../functions/FirebaseHelper';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            statusText: '',
            firstTimeLoaded: false,
        };
        this.watchId = 0;
    }

    async watchLocation() {
        RequestLocationPermission();
        this.setState({ statusText: "watchLocation called." });

        var app = this;
        var myMap = this.myMap;

        if (!app.state.firstTimeLoaded) {
            this.setState({ statusText: "watchPosition called." });
            app.watchId = Geolocation.watchPosition(
                (pos) => {
                    app.setState({ firstTimeLoaded: true, location: Object.assign({}, this.state.location, pos.coords) });
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    app.setState({ statusText: `Time: ${time} : ${pos.coords.latitude}, ${pos.coords.longitude}` });
                    myMap.UpdateCriteria(myMap, pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    console.log("watchPosition failed", error);
                    app.setState({ statusText: "watchPosition failed" });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 3600000
                });
        }
    }

    async componentDidMount() {
        InitFirebaseApp();
        RequestMessagingPermission();
        await this.watchLocation();
    }

    componentWillUnmount(){
        Geolocation.clearWatch(this.watchId);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <Map
                        firstTimeLoaded={this.state.firstTimeLoaded}
                        position={this.state.location}
                        user={this.props.user}
                        ref={(abc) => { this.myMap = abc }} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.instructions}>{this.props.user.name}</Text>
                    <Text style={styles.instructions}>{this.state.statusText}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    mapContainer: {
        // ...StyleSheet.absoluteFillObject,
        flex: 1,
        // height: 1800,
        // width: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },

});