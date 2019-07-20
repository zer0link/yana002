import React, { Component } from 'react';
import Login from './components/Login';
import Main from './components/Main';

class App extends Component {

  state = {
    user:null
  }

  AfterLogin(user) {
    this.setState({ user });
  }

  render() {
    console.log("user",this.state.user);
    if (this.state.user != null) {
      return (
        <Main user={this.state.user} />
      );
    }
    else {
      return (
        <Login AfterLogin={this.AfterLogin.bind(this)} />
      )
    }
  }
}

export default App