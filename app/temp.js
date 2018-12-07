index.js
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

export default AppRegistry.registerComponent('test', () => App);

App.js
import React, { Component } from 'react';
import { RootSwitch } from './app/navigation/rootSwitch';
import NavigationService from './app/navigation//NavigationService';

export default class App extends Component<{}> {
  render() {
    return (
      <RootSwitch ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}/>
    );
  }
}

rootSwitch.js
import { createSwitchNavigator } from 'react-navigation'

// import the different screens
import LoadingScreen from './loadingScreen'
import Login from './login'
import RootStack from './appNavigator'

// create our app's navigation
export const RootSwitch = createSwitchNavigator(
  {
    LoadingScreen,
    Login,
    rootStack: RootStack,
  },
  {
    initialRouteName: 'LoadingScreen'
  }
);

loadingScreen.js
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



login.js

import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Image } from 'react-native'
import firebase from '../firebase.config'
import AppButton from '../components/appButton';

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
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
          onPress={this.handleLogin}
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
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})

appNavigator.js
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

appHomepage.js
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

allEvents.js
import React, { Component } from 'react';
import ListEvents from '../components/listEvents';
import {observer} from 'mobx-react/native';
import dbData from '../store/dataStore'

@observer
class AllEvents extends Component {
  static navigationOptions = {
    title: 'All Events',
  };
  
  render() {
    const { navigation } = this.props;
    CSUSBEvents = navigation.getParam('CSUSBEvents', {});
    console.log(dbData.isLoaded());
    return (
        <ListEvents eventList = {CSUSBEvents} navigation = { navigation }/>
    );
  }
}

export default AllEvents;

myEvents.js

import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import ListEvents from '../components/listEvents';
import {observer} from 'mobx-react/native';
import firebase from '../firebase.config';
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

addEvent.js

import React, { Component } from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';
import moment from 'moment';
import t from 'tcomb-form-native'; // 0.6.9
import dbData from '../store/dataStore';

const Form = t.form.Form;

const User = t.struct({
  name: t.String,
  organizer: t.String,
  location: t.String,
  description: t.maybe(t.String),
  date: t.Date, 
  fromTime: t.Date,
  toTime: t.Date
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: 'blue',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    },
    // the style applied when a validation error occours
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}

const options = {
  fields: {
    description: {
        multiline: true,
        stylesheet: {
            ...Form.stylesheet,
            ...formStyles,
            textbox: {
                ...Form.stylesheet.textbox,
                normal: {
                    ...Form.stylesheet.textbox.normal,
                    height: 100
                },
                error: {
                    ...Form.stylesheet.textbox.error,
                    height: 100
                }
            }
        }
    },
    date: {
        label: 'Event Date',
        mode: 'date',
        config: {
            format: date => moment(date).format('MM-DD-YYYY'),
            //dateFormat: date => moment(date).format('MM-d-YYYY'),
        }
    },
    fromTime: {
        label: 'Event Start Time',
        mode: 'time',
        config: {
            format: date => moment(date).format('HH:mm'),
        }
    },
    toTime: {
        label: 'Event End Time',
        mode: 'time',
        config: {
            format: date => moment(date).format('HH:mm'),
        }
    },
  },
  stylesheet: formStyles,
};

export default class App extends Component {

    handleSubmit = () => {
        const value = this._form.getValue();
        if(value==null)
            return;
        dbData.addEvent(value);     
        this.props.navigation.goBack(null); 
    }

    render() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Form 
            ref={c => this._form = c}
            type={User} 
            options={options}
        />
        <Button
            title="Add Event!"
            onPress={this.handleSubmit}
        />
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
});


eventDetails.js

import React, { Component } from 'react';
import { StyleSheet, Button, Text, TextInput, ScrollView, View } from 'react-native';
import AppButton from '../components/appButton';
import dbData from '../store/dataStore'
import Spinner from 'react-native-loading-spinner-overlay';

class EventDetails extends Component{
    constructor(props) {
        super(props);
        this.event = this.props.navigation.getParam('event', {});
        this.state = {
            visible : false
        };
    }
    static navigationOptions = {
        title: 'Event Details',
    };    
    stopLoading = ()=>{
        this.setState(pState => {
            return {visible: false}
        });
    }
    render() {
        let eventStatus = dbData.isUserAttending(this.event)!==null;
        return(
            <ScrollView style={{ flex: 1 }}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={styles.container}>
                    <Text style={styles.eventName}>{this.event.name}</Text>
                    <Text style={styles.item}>{this.event.desc}</Text>
                    <Text>Organizer: {this.event.organizer}</Text>
                    <Text>Location: {this.event.where}</Text>
                    <Text>Date: {this.event.when.date}</Text>
                    <Text>Time: {this.event.when.fromTime} to {this.event.when.toTime}</Text>
                </View>
                {dbData.isUserCreator(this.event) || dbData.hasUserAttended(this.event) ? null :
                    <View>
                        <AppButton 
                            title={  eventStatus ? "UnRegister" : "Register"} 
                            onPress={() => { eventStatus ? dbData.removeUserFromAttendees(this.event,this.stopLoading) 
                                                : dbData.addUserToAttendees(this.event,this.stopLoading);
                                this.setState(pState => { return {visible: true} });
                            }}
                        />
                        {eventStatus ?
                            <AppButton //active only if user registerd
                                title="Attend" 
                                onPress={() => {this.props.navigation.navigate('attendEvent',{event: this.event});}}
                            /> : null
                        }
                    </View> 
                }
                {dbData.isUserCreator(this.event) ?
                    <View>
                        <AppButton //active only on day of event and user is creator of event
                            title="Receive Attendees" 
                            onPress={() => {this.props.navigation.navigate('receiveAttendees', { barcode: this.event.code,});}}
                        /> 
                        <AppButton 
                            title="Delete Event" 
                            onPress={() => {dbData.deleteEvent(this.event); this.props.navigation.goBack(null);}}
                        /> 
                    </View> : null
                }
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        margin: 5,
        padding: 10,
        backgroundColor:'lightgray',
        borderRadius:10,
        borderWidth: 1,
        borderColor: 'gray'
    },
    item: {
        paddingTop: 5,
        margin: 5,
        padding: 10,
        backgroundColor:'white',
        borderRadius:10,
        borderWidth: 1,
        borderColor: 'gray'
    },
    eventName: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    eventDate: {
      fontSize: 12,
    },
})
export default EventDetails;

attendEvent.js


import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import dbData from '../store/dataStore'

export default class AttendEvent extends Component {

  constructor(props) {
    super(props);
    this.event = this.props.navigation.getParam('event', {});
    this.camera = null;
    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        barcodeFinderVisible: true
      }
    };
  }
  alertSuccess = () => {Alert.alert(
    'Scan successful!',
    "Checked-In"
  ) }

  static navigationOptions = {

    header: null
  };
  
  onBarCodeRead(scanResult) {
    console.warn(scanResult.type);
    console.warn(scanResult.data);
    if (scanResult.data != null && scanResult.type == "QR_CODE") {
        console.log(this.event.code);
        if(this.event.code === scanResult.data)
        {
          dbData.addUserToAttended(this.event,this.alertSuccess);
        }
        else
        {
          Alert.alert(
            'Scan Failed!',
            "Please scan the correct event code."
          );
        }

        this.props.navigation.goBack(null);
        //if barcode matches the current event code go in else display error.
    }
    return;
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
            barcodeFinderWidth={280}
            barcodeFinderHeight={220}
            barcodeFinderBorderColor="white"
            barcodeFinderBorderWidth={2}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            style={styles.preview}
            type={this.state.camera.type}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

receiveAttendees.js

import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import {Text} from 'react-native';

import {
    StyleSheet,
    View,
    TextInput
} from 'react-native';

export default class ReceiveAttendees extends Component{
    static navigationOptions = {
        title: 'Event Code',
      };
    state = {
        text: 'csusb-events-app',
    };
    
    render() {
        return (
            <View style={styles.container}>
            <Text style={{padding:10,fontSize: 18,}}>Scan this code to Attend</Text>
            <QRCode
                value={this.state.text}
                size={300}
                bgColor='black'
                fgColor='white'/>
            </View>
        );
    };
}
     
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

appButton.js


import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class AppButton extends Component{
    render() {
        return (
            <View style={{ marginTop: 5, margin:10 }}>
                <Button 
                title={this.props.title}
                onPress={this.props.onPress}
                />
            </View>
        );
    }
}

listEvents.js

import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class ListEvents extends Component {
    render() {
      return (
        <View style={styles.container}>
            <FlatList
                data={this.props.eventList.map((item, i) => Object.assign({key:i}, item))}
                renderItem={({item}) =>
                  <TouchableOpacity style={styles.item}
                    onPress={() => {this.props.navigation.navigate('eventDetails', { event: item,});}}>
                    <Text style={styles.eventName}>{item.name.substring(0,32)}{item.name.length<32 ? "" : "..."}</Text>
                    <Text style={styles.eventOrganizer}>{item.organizer}</Text>
                    <Text style={styles.eventDate}>{item.when.date}</Text>
                    
                  </TouchableOpacity>
                }
            />
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
      margin: 5,
      padding: 10,
      height: 86,
      backgroundColor: 'lightgray',
    },
    eventName: {
      fontSize: 18,
    },
    eventDate: {
      alignSelf: 'flex-end',
      fontSize: 12,
    },
})

dataStore.js

import firebase from '../firebase.config';
import {observable} from 'mobx';
import moment from 'moment';

class dbData{
    @observable loaded = false;
    @observable CSUSBEvents = [];   
    users = {};
    eventSnap = {};
    JSONobjToJSobj(jsonO,jsO)
    {
        for (let objKey in jsonO){
            jsO.push(jsonO[objKey]);
        }
    }
    constructor(props){
        firebase.database()
          .ref('/')
          .on('value',function(snapshot) {
            this.CSUSBEvents.length=0;
            let snap = snapshot.val();
            this.users = snap['users'];
            this.eventSnap = snap['events'];
            this.JSONobjToJSobj(this.eventSnap,this.CSUSBEvents);
            this.loaded = true;
          }.bind(this));
    }
    isLoaded()
    {
        console.log(this.loaded);
        return this.loaded;
    }
    getEvents() {
        return this.CSUSBEvents;
    }
    getUsers() {
        return this.users;
    }
    getEncryptedUID()
    {
        return firebase.auth().currentUser.uid;
    }
    getCoID()
    {
        return firebase.auth().currentUser.email.split("@")[0];
    }
    getUserName()
    {
        return this.users[parseInt(this.getCoID())].name;
    }
    addUserToAttendees(e,exec)
    {
        let newAttendeeKey = firebase.database().ref().child('events/'+e.code+'/attendees').push().key;
        firebase.database()
        .ref('events/'+e.code+'/attendees/' + newAttendeeKey)
        .set(this.getCoID()).then(()=>{exec()});
    }
    
    addUserToAttended(e,exec)
    {
        let newAttendeeKey = firebase.database().ref().child('events/'+e.code+'/attended').push().key;
        firebase.database()
        .ref('events/'+e.code+'/attended/' + newAttendeeKey)
        .set(this.getCoID()).then(()=>{exec()});
    }

    isUserAttending(e)
    {
        e = this.eventSnap[e.code];
        let cid = this.getCoID();
        for (let objKey in e.attendees){
            if(e.attendees[objKey] == cid)
            {
                return objKey;
            }
        }
        return null;
    }

    hasUserAttended(e)
    {
        e = this.eventSnap[e.code];
        let cid = this.getCoID();
        for (let objKey in e.attended){
            if(e.attended[objKey] == cid)
            {
                return true;
            }
        }
        return false;
    }
    
    isUserCreator(e)
    {
        let cid = this.getCoID();
        if(e.creatorId == cid)
        {
            return true;
        }
        return false;
    }

    isUserModerator()
    {
        return this.users[parseInt(this.getCoID())].moderator;
    }

    removeUserFromAttendees(e,exec)
    {
        let stat = this.isUserAttending(e);
        if(stat!=null)
        {
            firebase.database().ref().child('events/'+e.code+'/attendees/'+stat).remove().then(()=>{exec()});
        }
    }

    addEvent(value)
    {
        let userID = firebase.auth().currentUser.email.split("@")[0];
        let newEventKey = firebase.database().ref().child('events').push().key;
        let newEvent = {
            name: value.name,
            organizer: value.organizer,
            when: {
                date:moment(value.date).format('MM-DD-YYYY'),
                fromTime:moment(value.fromTime).format('HH:mm'),
                toTime:moment(value.toTime).format('HH:mm')
            },
            where: value.location,
            desc: value.description,
            creatorId: userID,
            moderators: [userID],
            attendees: [userID],
            attended: [userID],
            code: newEventKey,
        }
        
        firebase.database()
        .ref('/events/' + newEventKey)
        .set(newEvent);
    }
    deleteEvent(e)
    {
        firebase.database().ref().child('events/'+e.code).remove();
        console.log('events/'+e.code);
    }
    signOut()
    {
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
    }
}

export default new dbData;

firebase.config.js

import RNFirebase from 'react-native-firebase'

const firebase = RNFirebase.initializeApp({
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",// intentionally removed
  authDomain: "csusbevents.firebaseapp.com",
  databaseURL: "https://csusbevents.firebaseio.com",
  projectId: "csusbevents",
  storageBucket: "csusbevents.appspot.com",
  messagingSenderId: "000000000000" // intentionally removed
});

export default firebase;
