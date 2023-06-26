import React, { useState, useEffect } from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import { Button, Gap, Input } from '../../components';
import { colors, fonts, showError, useForm, getData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILLogo } from '../../assets';


const UploadOutlet = ({navigation, route}) => {
const receiveData = route.params
  const [form, setForm] = useForm({
    outletName: '',
    outletAddress: '',
    outletPhone: '',
  })

  const dispatch = useDispatch();
  dispatch({type : 'SET_LOADING', value : false})
  const onContinue=()=>{
        dispatch({type : 'SET_LOADING', value : true})
        const data = {
          uid : receiveData.uid,
          outletName : form.outletName,
          outletAddress : form.outletAddress,
          outletPhone : form.outletPhone,
          next_form : 'UploadLocation'
        }
        Firebase.database().ref('account/'+receiveData.uid).update(data)
        .then(()=>{
          navigation.navigate(receiveData.next_form, data)
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
          <Text style={styles.title}>Upload Outlet</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={20}/>
          <Input judul='Nama Outlet' value={form.outletName} onChangeText={(value)=> setForm('outletName',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Alamat Outlet' value={form.outletAddress} onChangeText={(value)=> setForm('outletAddress',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='No. Ponsel Outlet' value={form.outletPhone} onChangeText={(value)=> setForm('outletPhone',value)} type='komentar'/>
          <Gap height={20}/>
          <Button title='Continue' onPress={onContinue}/>
          <Gap height={30}/>
        </ScrollView>
  </View>

  )
}

export default UploadOutlet

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