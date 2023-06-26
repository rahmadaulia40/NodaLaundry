import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { colors, fonts } from '../../../utils';
import BtnIconSend from './BtnIconSend';
import IconOnly from './icononly';

const Button = ({type, title, onPress, icon, disable, color}) => {
  if (type === 'btn-icon-send')
  {
    return <BtnIconSend disable={disable} onPress={onPress}/>
  }
  else if(type === 'icon-only')
  {
    return <IconOnly icon ={icon} onPress={onPress}/>
  }
  else if(disable){
    return (
      <View style={styles.disableBg}>
          <Text style={styles.disableText}>{title}</Text>
      </View>
    )
  }
  else if(type === 'btn-left-right'){
    return (
      <TouchableOpacity style={styles.container1(color)} onPress={onPress}>
          <Text style={styles.title1(color)}>{title}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity style={styles.container(type)} onPress={onPress}>
        <Text style={styles.title(type)}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  container : (type)=>({
    backgroundColor: type === 'secondary' ? colors.button.secondary.background : colors.button.primary.background,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5,
    
  }),
  title :(type)=>({
    fontSize : 15,
    textAlign: 'center',
    color: type === 'secondary' ? colors.button.secondary.text : colors.button.primary.text,
    fontFamily : fonts.primary[600],
  }),
  disableBg : {
    backgroundColor: colors.button.disable.background,
    paddingVertical: 10,
    borderRadius: 10
  },
  disableText : {
    fontSize : 18,
    textAlign: 'center',
    color: colors.button.disable.text,
    fontFamily : fonts.primary[700]
  },
  container1 : (type)=>({
    backgroundColor: type === 'primary' ? colors.button.secondary.background : colors.button.primary.background,
    paddingVertical: 10,
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }),
  title1 :(type)=>({
    fontSize : 15,
    textAlign: 'center',
    color: type === 'primary' ? colors.button.secondary.text : colors.button.primary.text,
    fontFamily : fonts.primary[600],
  }),
})