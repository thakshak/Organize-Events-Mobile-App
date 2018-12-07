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
