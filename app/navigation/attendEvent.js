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
    "Scan successful!",
    "Checked-In"
  ) }
  dummy = () => {};
  static navigationOptions = {
    header: null
  };
  onBarCodeRead(scanResult) {
    //console.warn(scanResult.type);
    //console.warn(scanResult.data);
    scanned = false;
    if (scanResult.data != null && scanResult.type == "QR_CODE" && !scanned) {
        //console.log(this.event.code);
        if(this.event.code === scanResult.data && !scanned)
        {
          scanned = true;
          dbData.addUserToAttended(this.event,this.alertSuccess);
          dbData.removeUserFromAttendees(this.event,this.dummy);
        }
        else
        {
          Alert.alert(
            'Scan Failed!',
            "Please scan the correct event code."
          );
        } //if barcode matches the current event code go in else display error.
        this.props.navigation.navigate('appHome');
        
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
