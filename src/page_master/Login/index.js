import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, ScrollView, Image, PermissionsAndroid} from 'react-native';
import {ILLogo} from '../../assets'
import { Button, Gap, Input, Link } from '../../components';
import { colors, fonts, showError, storeData, useForm } from '../../utils';
import {Firebase} from '../../config'
import { useDispatch } from 'react-redux';
import PushNotification, {Importance} from "react-native-push-notification";

const Login = ({navigation}) => {
  const [form, setForm] = useForm({email: '', password: ''})
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
      },
      (created) => {}
    );
  }

  useEffect(() => {
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
  }, [token])

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

  const login = ()=>{
    dispatch({type: 'SET_LOADING', value: true})
    Firebase.auth().signInWithEmailAndPassword(form.email, form.password)
    .then(res=> {
      Firebase.database()
      .ref(`account/${res.user.uid}/`)
      .once('value')
      .then(resDB => {
        //save to localstorage
        if (resDB.val()) {
          const data = resDB.val()
          data.token = token
          if(data.levelAccount == 'administrator' || data.levelAccount == 'admin') {
            Firebase.database().ref(`account/${data.uid}/`).update({token : token})
            .then(()=>{
              storeData('administrator', data)
              navigation.replace('MainApp_administrator')
            })
          }
          if(data.levelAccount == 'kurir') {
            Firebase.database().ref(`account/${data.uid}/`).update({token : token})
            storeData('kurir', data)
            navigation.replace('MainApp_kurir')
          }
          if(data.levelAccount == 'user'){
            if(data.photo == undefined) {
                requestAccessLocation()
                data.latitude = currentPosition.latitude
                data.longitude = currentPosition.longitude
                Firebase.database().ref(`account/${data.uid}/`).update({token : token})
                .then(()=>{
                  storeData('user',data)
                  navigation.replace('uploadPhoto_user', data)
                })
            }
            else {
                Firebase.database().ref(`account/${data.uid}/`).update({token : token})
                .then(()=>{
                  storeData('user', data)
                  navigation.replace('MainApp_user')
                })}
          }
          
        }
      })
    })
    .catch(err=> {
      dispatch({type: 'SET_LOADING', value: false})
      showError(err.message)
    })
  }
  return (
    <View  style={styles.page}>
        <View style={styles.image}>
          <Image source={ILLogo} style={styles.logo} />
          <Text style={styles.title}>Login</Text>
        </View>
          <ScrollView showsVerticalScrollIndicator={false} >
          <Gap height={20}/>
          <Input judul='Email Address' value={form.email} onChangeText={(value)=> setForm('email', value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Password' value={form.password} secureTextEntry onChangeText={(value)=> setForm('password', value)} type='komentar'/>
          <Gap height={30}/>
          <Button title='Masuk' onPress={login}/>
          <Gap height={20}/>
          <Link title='Belum punya akun? Klik Disini' size={16} align='center' onPress={()=> navigation.navigate('register_user')} type='komentar'/>
          <Gap height={20}/>
          </ScrollView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: colors.background
  },
  image: {
    aspectRatio: 1 * 1.8
  },
  logo: {
    resizeMode: 'cover',
    height: '80%',
    width: '60%',
    alignSelf: 'center'
    
  },
  title: {
    textAlign: 'center',
      color : colors.text.primary,
      fontSize : 18,
      fontFamily : fonts.primary[800]
  }
})