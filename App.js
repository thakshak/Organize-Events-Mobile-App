/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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