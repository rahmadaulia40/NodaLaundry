import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import { colors, fonts } from '../../../utils';

const Input = ({value, onChangeText, secureTextEntry, disable, placeholder, judul, type, keyboardType}) => {
  const [border, setBorder] = useState(colors.border)
  const onFocusForm = ()=>{
    setBorder(colors.border.onFocus)
  }
  const onBlurFrom =()=>{
    setBorder(colors.border.onBlur)
  }
  if(type === 'komentar') {
    return (
      <View>
          <Text style={styles.label}>{judul}</Text>
          <TextInput 
            keyboardType={keyboardType}
            onFocus={onFocusForm} 
            onBlur={onBlurFrom} 
            value={value} 
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry} 
            style={styles.input(border)}
            editable={!disable}
            selectTextOnFocus={!disable}
            placeholder={placeholder}
          >
          </TextInput>
  
      </View>
    )}
  return (
    <View>
        <TextInput 
          onFocus={onFocusForm} 
          onBlur={onBlurFrom} 
          value={value} 
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry} 
          style={styles.input(border)}
          editable={!disable}
          selectTextOnFocus={!disable}
          placeholder={placeholder}
        />

    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: border => (
    {
      borderWidth: 1,
      borderColor: border,
      borderRadius: 8,
      padding: 10,
      backgroundColor : colors.background,
      flex: 1,
      color: colors.text.primary
    }
  ),
  label : {
    fontSize: 14,
    fontFamily: fonts.primary[800],
    color: colors.text.primary,
    paddingBottom: 10
}
})