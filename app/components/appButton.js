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