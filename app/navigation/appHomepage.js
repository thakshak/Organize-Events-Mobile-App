import React, { Component } from 'react';
import { View, Text, ActivityIndicator,StyleSheet} from 'react-native';
import AppButton from '../components/appButton';
import dbData from '../store/dataStore'
import firebase from '../firebase.config';
import { observer } from 'mobx-react/native';

@observer
class AppHomepage extends Component {
  state = { currentUser: null }
  componentDidMount() {
      const { currentUser } = firebase.auth();
      this.setState({ currentUser });
  }
  static navigationOptions = {
    title: 'CSUSB Events',
  };
  
  render() {
    const { currentUser } = this.state;
    this.CSUSBEvents = dbData.getEvents();
    return (dbData.isLoaded() ? 
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style = {{
          fontSize: 32,
          fontWeight: 'bold',
        }}>
            Welcome {dbData.getUserName()}!
        </Text>
        <AppButton 
          title="All Events"
          onPress={() => {
            this.props.navigation.navigate('allEvents', { 
              CSUSBEvents: this.CSUSBEvents,
            });
          }}
        />
        <AppButton 
          title="My Events"
          onPress={() => {
            this.props.navigation.navigate('myEvents', { 
              CSUSBEvents: this.CSUSBEvents,
            });
          }}
        />
        
      </View>:
      <View style={styles.container}>
        <Text>Loading...</Text>
        <Text style={styles.txt}>Check your internt connectivity and
          relaunch application if this takes more than 10 seconds.
        </Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    padding: 15,
    textAlign: 'center',
  }
})
export default AppHomepage;
//export default testable('AppHomepage.View.Text')(AppHomepage);