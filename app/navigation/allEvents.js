import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import ListEvents from '../components/listEvents';
import {observer} from 'mobx-react/native';

@observer
class AllEvents extends Component {
  static navigationOptions = {
    title: 'All Events',
  };
  
  render() {
    const { navigation } = this.props;
    CSUSBEvents = navigation.getParam('CSUSBEvents', {});
    //console.log(dbData.isLoaded());
    return (
      <View style={styles.MainContainer}>
        <ListEvents eventList = {CSUSBEvents} navigation = { navigation }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    backgroundColor : '#F5F5F5'
  },
});

export default AllEvents;
