import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default class Login extends Component {
    state = {
        name : "JustTest"
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Text>Name</Text>
                    <TextInput onChangeText={(name) => { this.setState({name}) }} placeholder="Name" value="test"></TextInput>
                </View>
                <Button title="Login" onPress={() => this.props.AfterLogin({name:this.state.name})}></Button>
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

  });