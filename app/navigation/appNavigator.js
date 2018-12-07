import { createStackNavigator } from 'react-navigation';
import AppHomepage from './appHomepage'
import AllEvents from './allEvents'
import MyEvents from './myEvents'
import EventDetails from './eventDetails'
import AttendEvent from './attendEvent'
import ReceiveAttendees from './receiveAttendees'
import AddEvent from './addEvent.js'
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import dbData from '../store/dataStore'
import NavigationService from './NavigationService';

logOut = function()
{
  dbData.signOut();
  NavigationService.navigate('Login');
}

const RootStack = createStackNavigator(
  {
    appHome: AppHomepage,
    allEvents: AllEvents,
    myEvents: MyEvents,
    eventDetails: EventDetails,
    attendEvent: AttendEvent,
    receiveAttendees: ReceiveAttendees,
    addEvent: AddEvent,
  },
  {
    initialRouteName: 'appHome',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#005eb8',
      },
      headerRight: (
        <TouchableOpacity activeOpacity={0.5} onPress={logOut}
          style={{
            marginRight: 10,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image source={require('../assets/images/logout.png')}
                  style={{

                    resizeMode: 'contain',
                    width: 32,
                    height: 32,
                  }} />
        </TouchableOpacity>
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);


export default RootStack;