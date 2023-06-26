import React, { useEffect } from 'react';
import {LogBox, StatusBar, StyleSheet, PermissionsAndroid} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';
import FlashMessage from 'react-native-flash-message';
import {Provider, useSelector} from 'react-redux'
import store from './redux/store';
import { Loading } from './components';
import { colors, showError } from './utils';
import { Firebase } from './config';
import PushNotification, {Importance} from 'react-native-push-notification';

const MainApp = () => {
  const stateGlobal = useSelector(state=> state)
  LogBox.ignoreAllLogs()
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "fcm_fallback_notification_channel", // (required)
        channelName: "fcm_fallback_notification_channel", // (required)
        playSound: true,
        soundName: "default",
        importance: Importance.HIGH,
        vibrate: true,
        smallIcon: "ic_launcher"
      }
    );
    Firebase.messaging().onMessage(async remoteMessage => {
    });
  }, [])

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <NavigationContainer>
        <Router/>
      </NavigationContainer>
      <FlashMessage position="top" />
      {stateGlobal.loading && <Loading/>}
    </>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <MainApp/>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})