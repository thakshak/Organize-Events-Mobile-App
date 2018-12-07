import React, { Component } from 'react';
import { StyleSheet, Button, Text, TextInput, ScrollView, View } from 'react-native';
import AppButton from '../components/appButton';
import dbData from '../store/dataStore'
import Spinner from 'react-native-loading-spinner-overlay';
import { observer } from 'mobx-react/native';

@observer
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
        s = "k";
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