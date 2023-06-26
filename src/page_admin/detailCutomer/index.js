import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Linking} from 'react-native';
import { Button, Gap, Header } from '../../components';
import { colors, fonts, push_notification } from '../../utils';
import { useDispatch } from 'react-redux';
import MapView, { Marker }from 'react-native-maps';
import { Firebase } from '../../config';


const DetailCustomer = ({navigation, route}) => {
  const receiveData = route.params
  const dispatch = useDispatch();
  dispatch({type : 'SET_LOADING', value : false})

  const onConfirmation =()=>{
    Firebase.database().ref(`washing/${receiveData.uidWashing}/`).update({
      status : 'Telah Tiba Dilokasi'
    })
    .then(()=>{
        navigation.goBack()
        push_notification(`[${receiveData.nameAdmin}] Telah Tiba Dilokasi`, receiveData.token)
    })
  }

  return (
    <View style={styles.page}>
      <Gap height={10}/>
        <Header title='Detail Customer' type='background' photo={{uri : receiveData.photo}} onPress={()=> navigation.goBack()}/>
        <MapView
          style={styles.Map_View}
          region={{latitude : receiveData.latitude, longitude : receiveData.longitude, latitudeDelta : 0.009922, longitudeDelta : 0.004421}}
          onPanDrag={false}
        >
          <Marker
            coordinate ={{latitude : receiveData.latitude, longitude : receiveData.longitude}}
            title={receiveData.fullName}
            description={receiveData.address}
          />

        </MapView>
        <View style={styles.viewBottomPage}>
            <View style={{flexDirection: 'row'}}>
                <View>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.label}>ponsel</Text>
                </View>
                <View>
                    <Text style={styles.label}>:</Text>
                    <Text style={styles.label}>:</Text>
                    <Text style={styles.label}>:</Text>
                </View>
            </View>
            <View>
                <Text style={styles.price}>{receiveData.fullName}</Text>
                <Text style={styles.price}>{receiveData.email}</Text>
                <TouchableOpacity onPress={()=>Linking.openURL('whatsapp://send?text=Hai, saya memiliki keluhan atas pelayanan anda !&phone=+62'+receiveData.ponsel)}>
                  <Text style={styles.price}>klik Disini : {receiveData.ponsel}</Text>
                </TouchableOpacity>
            </View>
        </View>
        {receiveData.status == 'Proses Penjemputan' ?
        <View style={{margin: 5}}>
          <Button title='Konfirmasi Telah Tiba' onPress={()=>onConfirmation()}/>
        </View>
        : <View/>
        }
  </View>

  )
}

export default DetailCustomer

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background
  },
  Map_View: {
    flex: 1
  },
  viewBottomPage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: colors.primary,
  },
  label : {
    fontSize: 14,
    fontFamily: fonts.primary[700],
    color: colors.white,
    paddingHorizontal: 15
  },
  price : {
    fontSize: 14,
    fontFamily: fonts.primary[700],
    color: colors.white,
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
})