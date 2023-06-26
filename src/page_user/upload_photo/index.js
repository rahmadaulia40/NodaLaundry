import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Firebase} from '../../config'
import { useDispatch } from 'react-redux';
import { IconAddPhoto, IconRemovePhoto, ILNullPhoto } from '../../assets';
import { Button, Gap, Link } from '../../components';
import { colors, fonts, showError } from '../../utils';
import Geolocation from 'react-native-geolocation-service';

const Upload_photo = ({navigation, route}) => {
  const receiveData = route.params
  const [photoForDB, setPhotoForDB] = useState('')
  const [hasPhoto,setHasPhoto] = useState(false)
  const [photo, setPhoto] = useState(ILNullPhoto)
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  })
  const dispatch = useDispatch();
  dispatch({type : 'SET_LOADING', value : false})
  
  useEffect(() => {
    requestAccessLocation()
  }, [currentPosition.latitude])
  
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
  
  const getImage = () => {
    launchImageLibrary({quality: 0.5, maxWidth: 200, maxHeight: 200, includeBase64: true, mediaType: 'photo', selectionLimit: 0}, response => {
      if(response.didCancel || response.error)
      {
        showError('Oops, sepertinya anda tidak memilih fotonya?')
      }
      else 
      {
        response.assets.map( data => {
          const source = {uri : data.uri}
          setPhotoForDB(`data:${data.type};base64, ${data.base64}`)
          setPhoto(source)
          setHasPhoto(true)
        })
      }
    })
  }

  const newData = {
    fullName : receiveData.fullName,
    ponsel : receiveData.ponsel,
    email: receiveData.email,
    uid : receiveData.uid,
    latitude : currentPosition.latitude,
    longitude : currentPosition.longitude,
    photo : photoForDB,
    next_form : 'Splash'
  }
  const uploadeAndContinue = () => {
    dispatch({type : 'SET_LOADING', value : true})
    Firebase.database()
    .ref('account/'+ receiveData.uid +'/')
    .update(newData)
    navigation.replace(receiveData.next_form, newData)
  }
  
  return (
      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.profile}>
            <Text style={styles.title}>Upload Photo</Text>
            <Gap height={30}/>
            <TouchableOpacity style={styles.avatarWrapper} onPress={getImage}>
              <Image source ={photo} style={styles.avatar}/>
              {hasPhoto && <IconRemovePhoto style = {styles.addPhoto}/> || <IconAddPhoto style = {styles.addPhoto}/>}
            </TouchableOpacity>
            <Text style={styles.name}>{receiveData.fullName}</Text>
            <Text style={styles.profession}>{receiveData.email}</Text>
          </View>
          <View>
            <Button disable={!hasPhoto} title='Upload and Continue' onPress={uploadeAndContinue}/>
            <Gap height={30}/>
            <Link title='Lewati Upload Foto' align='center' size={16} onPress={()=> navigation.replace(receiveData.next_form, newData)}/>
          </View>
        </View>
      </View>
  )
}

export default Upload_photo

const styles = StyleSheet.create({
  page : {
    flex: 1,
    backgroundColor: colors.white
  },
  container : {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingBottom: 64
  },
  avatar : {
    height: 110,
    width: 110,
    borderRadius: 110/2
  },
  avatarWrapper : {
    height: 130,
    width: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 130/2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addPhoto : {
    position: 'absolute',
    bottom: 8,
    right: 6
  },
  name : {
    fontSize: 24,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    textAlign: 'center'
  },
  profession: {
    fontSize: 18,
    fontFamily: fonts.primary.normal,
    textAlign: 'center',
    color: colors.text.secondary
  },
  profile : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    color : colors.text.primary,
    fontSize : 22,
    fontFamily : fonts.primary[800]
  }
})