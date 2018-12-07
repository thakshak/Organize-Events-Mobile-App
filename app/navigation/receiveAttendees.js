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
        text: this.props.navigation.getParam('barcode', {}),
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