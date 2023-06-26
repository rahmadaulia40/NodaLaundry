import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import { ILGetStarted, ILLogo } from '../../assets';
import { Button, Gap } from '../../components';
import { colors, fonts } from '../../utils';

const GetStarted = ({navigation}) => {
  return (
      <ImageBackground source={ILGetStarted} style={styles.page}>

        <View>
          <View style={styles.image}>
          <Image source={ILLogo} style={styles.logo}/>
          </View>
          <Text style={styles.title}>Pakaian Menjadi Selalu Bersih Dengan Menggunakan Jasa Kami</Text>  
        </View>

        <View>
          <Button title='Get Started' onPress={()=> {navigation.navigate('register_user')}} />
          <Gap height={16}/>
          <Button title='Sign In' type = 'secondary' onPress={()=> {navigation.replace('Login')}}/>
        </View>

      </ImageBackground>
  )
}

export default GetStarted

const styles = StyleSheet.create({
  page : {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.background
  },
  title : {
    fontSize : 30,
    color : 'white',
    fontFamily: fonts.primary[800]
  },
  logo: {
    height: '100%',
    width: '50%',
    marginLeft: -30,
    marginTop: 0
    
  },
  image: {
    aspectRatio: 1 * 2.9,
  },
})