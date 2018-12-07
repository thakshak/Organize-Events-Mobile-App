// Loading.js

import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from '../firebase.config'

export default class LoadingScreen extends React.Component {
    
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'rootStack' : 'Login')
        })
    }
    render() {
        return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <Text style={styles.txt}>Check your internt connectivity and
            relaunch application if this takes more than 10 seconds.
            </Text>
            <ActivityIndicator size="large" />
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  txt: {
    padding: 15,
    textAlign: 'center',
  }
})