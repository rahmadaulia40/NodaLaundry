/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './src/App';
 import {name as appName} from './app.json';
 import 'react-native-gesture-handler';
import { Firebase } from './src/config';
import PushNotification from 'react-native-push-notification';

    Firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
    PushNotification.popInitialNotification((notification) => {
    });
  });

 
 AppRegistry.registerComponent(appName, () => App);
 