// Login.js

import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Image } from 'react-native'
import firebase from '../firebase.config'
import AppButton from '../components/appButton';

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  doLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('LoadingScreen'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Image  style={{ width:300}} 
                source={require('../assets/images/csusb_LG.png')} 
                resizeMode="contain"/>

        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <AppButton 
          title="Login"
          onPress={this.doLogin}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '89%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 9
  }
})