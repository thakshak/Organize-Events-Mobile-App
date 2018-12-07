import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import ListEvents from '../components/listEvents';
import {observer} from 'mobx-react/native';
import dbData from '../store/dataStore'

@observer
class MyEvents extends Component {
  static navigationOptions = {
    title: 'My Events',
  };
  navigateTo=()=>{
    this.props.navigation.navigate('addEvent');
  }
  myEvent=(e)=>{
    if(dbData.isUserAttending(e)!==null || dbData.hasUserAttended(e) || dbData.isUserCreator(e))
      return true;  
    return false;
  }
  render() {
    const { navigation } = this.props;
    CSUSBEvents = navigation.getParam('CSUSBEvents', {});
    
    return (
      <View style={styles.MainContainer}>
        <ListEvents eventList = {CSUSBEvents.filter((event) => this.myEvent(event))} navigation = { navigation } />
        {dbData.isUserModerator() ?
          <TouchableOpacity activeOpacity={0.5} onPress={this.navigateTo} style={styles.TouchableOpacityStyle} >
            <Image source={require('../assets/images/floatingActionButton.png')}
                  style={styles.FloatingButtonStyle} />
          </TouchableOpacity> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    backgroundColor : '#F5F5F5'
  },

  TouchableOpacityStyle:{

    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 64,
    height: 64,
  }
});

export default MyEvents;
