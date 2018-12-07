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