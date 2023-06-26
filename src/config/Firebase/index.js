// import firebase from 'firebase'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'

// firebase.initializeApp({
//   apiKey: "AIzaSyCBfRHM_3iAtHGbpxKNL2rIja2xCpdNd7Y",
//   authDomain: "gose-85773.firebaseapp.com",
//   databaseURL: "https://gose-85773-default-rtdb.firebaseio.com",
//   projectId: "gose-85773",
//   storageBucket: "gose-85773.appspot.com",
//   messagingSenderId: "946868289156",
//   appId: "1:946868289156:web:54ad424a9b33f2f84dccd1",
//   measurementId: "G-00MW70RXFP"
// })
const HEADER_MESSAGE = {
    'Content-Type': 'application/json',
    'Authorization' :'key=AAAAuzADHK4:APA91bGo8EbTiGrghO4BSMf39oEzVtk7SZAnBq5ju-IL0GRWwiJ278xnXrL5Tokjqr69AvS5iIBCWn0irWxH4KaGaY9X_f4WQ42flfAfFVt8MrrRByAybRzSV_l1u9qTQiR9nbZn4i-e',
}

const URL_MESSAGE = 'https://fcm.googleapis.com/fcm/send'

const Firebase = {auth, database, messaging, URL_MESSAGE, HEADER_MESSAGE};

export default Firebase;