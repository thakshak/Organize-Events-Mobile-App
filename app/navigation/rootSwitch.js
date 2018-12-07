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
