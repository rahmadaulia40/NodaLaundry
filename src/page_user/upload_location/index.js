import React, { useState } from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Button, Gap, Header, Input } from '../../components';
import { colors, fonts, showError, useForm, showSuccess } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import MapView, { Marker }from 'react-native-maps';


const Upload_locationUser = ({navigation, route}) => {
  const receiveData = route.params
  const dispatch = useDispatch();
  dispatch({type : 'SET_LOADING', value : false})
  const [address, setAddress] = useForm({address: receiveData.address})
  const [latitude, setLatitude] = useState(receiveData.latitude)
  const [longitude, setLongitude] = useState(receiveData.longitude)
  const onRegionChange = (coor) => {
    setLatitude(coor.latitude)
    setLongitude(coor.longitude)
  }

  const onContinue=()=>{
        dispatch({type : 'SET_LOADING', value : true})
        const newData = {
          address : address.address,
          Latitude : latitude,
          Longitude : longitude,

        }
        Firebase.database().ref('account/'+receiveData.uid+'/')
        .update(newData)
        .then(()=>{
          if(receiveData.next_form == 'goBack') {
            navigation.reset({
              index: 0,
              routes: [{name: 'MainApp_user'}]
            })
            showSuccess('Sukses Mengubah Lokasi')
          }
          else{
            navigation.navigate(receiveData.next_form)
          }
        })
        .catch((err) => {
          dispatch({type : 'SET_LOADING', value : false})
          showError(err.message)
        });
  }


  return (
    <View style={styles.page}>
    <View style={styles.coloring}>
      <Header type='dark-only' title='Location'/>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
          <Input judul='Alamat Lengkap' value={address.address} onChangeText={(value)=> setAddress('address',value)} type='komentar'/>
      </ScrollView>
          <MapView
            style={styles.Map_View}
            initialRegion={{latitude : latitude, longitude : longitude, latitudeDelta : 0.009922, longitudeDelta : 0.004421}}
            region={{latitude : receiveData.latitude, longitude : receiveData.longitude, latitudeDelta : 0.009922, longitudeDelta : 0.004421}}
            onPanDrag={false}
            onPress={(e)=> {onRegionChange(e.nativeEvent.coordinate)}}
          >
            <Marker
              coordinate ={{latitude : latitude, longitude : longitude}}
              draggable
              tappable
              onDragEnd={(e)=> {onRegionChange(e.nativeEvent.coordinate)}}
            />
          </MapView>
          <View style={{marginHorizontal: 10}}>
            <Button title='Continue' onPress={onContinue}/>
            <Gap height={10}/>
          </View>
  </View>
  </View>

  )
}

export default Upload_locationUser

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.primary,
  },
  coloring:{
    backgroundColor : colors.background,
    flex : 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  title: {
    textAlign: 'center',
      color : colors.text.primary,
      fontSize : 18,
      fontFamily : fonts.primary[800]
  },
  Map_View: {
    flex: 100
  }
})