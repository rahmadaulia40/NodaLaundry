import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, View, PermissionsAndroid} from 'react-native';
import { ILLogo } from '../../assets';
import { colors, showError, storeData} from '../../utils';
import { Firebase } from '../../config';
import { useDispatch } from 'react-redux';
import PushNotification, {Importance} from "react-native-push-notification";

const Splash = ({navigation}) => {
  const [token, setToken] = useState('')
  const dispatch = useDispatch();
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  })
  const createChannel =()=>{
    PushNotification.createChannel(
      {
        channelId: "fcm_fallback_notification_channel", // (required)
        channelName: "fcm_fallback_notification_channel", // (required)
        playSound: true,
        soundName: "default",
        importance: Importance.HIGH,
        vibrate: true,
      }
    );
  }

  useEffect(()=>{
    createChannel()
    Firebase.messaging().registerDeviceForRemoteMessages();
    Firebase.messaging().requestPermission();
    Firebase.messaging().getToken()
    .then(res=>{
        setToken(res)
    })
    .catch(err=>{
        showError(err)
    })
    const unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      setTimeout(()=>{
        if (user) {
          dispatch({type: 'SET_LOADING', value: true})
          Firebase.database()
          .ref(`account/${user.uid}/`)
          .once('value')
          .then(resDB => {
            //save to localstorage
            if (resDB.val()) {
              const data = resDB.val()
              data.token = token
              if(data.levelAccount == 'administrator' || data.levelAccount == 'admin') {
                Firebase.database().ref(`account/${user.uid}/`).update({token : token})
                storeData('administrator', data)
                navigation.replace('MainApp_administrator')
              }
              if(data.levelAccount == 'kurir') {
                Firebase.database().ref(`account/${user.uid}/`).update({token : token})
                storeData('kurir', data)
                navigation.replace('MainApp_kurir')
              }
              if(data.levelAccount == 'user'){
                if(data.latitude == undefined) {
                  requestAccessLocation()
                    data.latitude = currentPosition.latitude
                    data.longitude = currentPosition.longitude
                    Firebase.database().ref(`account/${user.uid}/`).update({token : token})
                    .then(()=>{
                      storeData('user',data)
                      navigation.replace('uploadPhoto_user', data)
                    })
                }
                else {
                    Firebase.database().ref(`account/${user.uid}/`).update({token : token})
                    .then(()=>{
                      storeData('user', data)
                      navigation.replace('MainApp_user')
                    })
                }
              }
            }
          })
        }
        else {
          navigation.replace('GetStarted')
        }
      },3000)
    })
    return () => unsubscribe();
  },[token])

  const requestAccessLocation = async () => {
    try {
      const cekPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          
            title: 'Izin akses lokasi',
            message: 'Anda belum memberikan akses lokasi pada aplikasi ini !',
            buttonPositive: 'OK',
        }
      )
      if(cekPermission == PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setCurrentPosition({
              latitude : position.coords.latitude,
              longitude: position.coords.longitude
            })
          },
          () => { showError('Pastikan anda telah memberi izin akses lokasi !')},
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 300, distanceFilter: 10, forceRequestLocation : true }
        );
      }
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.image}>
        <Image source={ILLogo} style={styles.logo}/>
      </View>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  page : {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'cover',
    height: '80%',
    width: '70%',
    alignSelf: 'center',
    
  },
  image: {
    aspectRatio: 1 * 1.8,
  },
})