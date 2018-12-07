import RNFirebase from 'react-native-firebase'

const firebase = RNFirebase.initializeApp({
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "csusbevents.firebaseapp.com",
  databaseURL: "https://csusbevents.firebaseio.com",
  projectId: "csusbevents",
  storageBucket: "csusbevents.appspot.com",
  messagingSenderId: "000000000000"
});

export default firebase;