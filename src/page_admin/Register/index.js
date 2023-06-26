import React from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import { Button, Gap, Input, Link } from '../../components';
import { colors, fonts, showError, storeData, useForm } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILLogo } from '../../assets';

const Register = ({navigation}) => {

  const [form, setForm] = useForm({
    ownerName: '',
    ownerPhone: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch();

  const onContinue=()=>{
    dispatch({type : 'SET_LOADING', value : true})
    Firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
      .then((success) => {
        dispatch({type : 'SET_LOADING', value : false})
        setForm('reset')

        const data_admin ={
          fullName : form.ownerName,
          ponsel : form.ownerPhone,
          email: form.email,
          uid : success.user.uid,
          levelAccount : 'administrator',
          next_form : 'UploadPhoto_Admin'
        }
        Firebase.database()
        .ref('account/'+success.user.uid+'/')
        .set(data_admin)
        //save to localstorage
        storeData('administrator',data_admin)
        
        navigation.replace('UploadOutlet', data_admin)
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
          <Text style={styles.title}>Register</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={20}/>
          <Input judul='Nama Lengkap' value={form.ownerName} onChangeText={(value)=> setForm('ownerName',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='No. Ponsel' value={form.ownerPhone} onChangeText={(value)=> setForm('ownerPhone',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Email' value={form.email} onChangeText={(value)=> setForm('email',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='New Password' secureTextEntry value={form.password} onChangeText={ (value)=> setForm('password',value)} type='komentar'/>
          <Gap height={30}/>
          <Button title='Register' onPress={onContinue}/>
          <Gap height={20}/>
          <Link title='Sudah punya akun? Klik Disini' size={16} align='center' onPress={()=> navigation.goBack()}/>
          <Gap height={30}/>
        </ScrollView>
  </View>

  )
}

export default Register

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
      fontSize : 22,
      fontFamily : fonts.primary[800]
  }
})