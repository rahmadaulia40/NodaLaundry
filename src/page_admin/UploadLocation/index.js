import React, { useState, useEffect } from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import { Button, Gap, Input } from '../../components';
import { colors, fonts, showError, useForm, getData, storeData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILLogo } from '../../assets';
import MapView, { Marker }from 'react-native-maps';


const UploadLocation = ({navigation, route}) => {
  const receiveData = route.params
  const dispatch = useDispatch();
  dispatch({type : 'SET_LOADING', value : false})
  const [currentPosition, setCurrentPosition] = useForm({
    latitude: 3.5996191045089554,
    longitude: 98.681206369688,
    latitudeDelta: 0.009922,
    longitudeDelta: 0.004421,
  })
  const onRegionChange = (coor) => {
    setCurrentPosition('latitude', coor.latitude);
    setCurrentPosition('longitude', coor.longitude);
  }

  const onContinue=()=>{
        dispatch({type : 'SET_LOADING', value : true})
        const data = {
          ...receiveData,
          latitude : currentPosition.latitude,
          longitude : currentPosition.longitude,
        }
        Firebase.database().ref('account/'+receiveData.uid)
        .update(data)
        .then(()=>{
          storeData('administrator', null)
          storeData('administrator',data)
          navigation.replace(receiveData.next_form)
        })
        .catch((err) => {
          dispatch({type : 'SET_LOADING', value : false})
          showError(err.message)
        });
  }

  return (
    <View  style={styles.page}>
        <View style={styles.image}>
          <Image source={ILLogo} style={styles.logo}/>
          <Text style={styles.title}>Upload Location</Text>
        </View>
        <MapView
          style={styles.Map_View}
          initialRegion={currentPosition}
          region={{latitude : receiveData.latitude === '0' ? receiveData.latitude : currentPosition.latitude, longitude : receiveData.longitude === '0' ? receiveData.longitude : currentPosition.longitude, latitudeDelta : 0.009922, longitudeDelta : 0.004421}}
          onRegionChange={onRegionChange}
          onPanDrag={false}
          onPress={(e)=> {onRegionChange(e.nativeEvent.coordinate)}}
        >
          <Marker
            coordinate ={{latitude : receiveData.latitude === '0' ? receiveData.latitude : currentPosition.latitude, longitude : receiveData.longitude === '0' ? receiveData.longitude : currentPosition.longitude}}
            draggable
            tappable
            onDragEnd={(e)=> {onRegionChange(e.nativeEvent.coordinate)}}
          />

        </MapView>
        <View>
        <Gap height={20}/>
          <Button title='Continue' onPress={onContinue}/>
          <Gap height={30}/>
        </View>
  </View>

  )
}

export default UploadLocation

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
  },
  Map_View: {
    flex: 1
  }
})