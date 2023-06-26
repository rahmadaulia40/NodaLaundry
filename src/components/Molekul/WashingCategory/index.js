import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ILList, ILWashing } from '../../../assets';
import { colors, fonts } from '../../../utils';

const WashingCategory = ({category, onPress}) => {
  const Icon=()=>{
    if (category === 'List Harga')
    {
      return <ILList/>
    }
    else if (category === 'Cuci Sekarang')
    {
      return <ILWashing />
    }
    else
    {
      return <ILWashing/>
    }
  }
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={{alignSelf: 'center', flex: 1}}>
          <Icon/>
        </View>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.category}>{category}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default WashingCategory

const styles = StyleSheet.create({
  container : {
    padding : 10,
    backgroundColor : colors.background,
    borderRadius : 10,
    height : 130,
    width: 140,
    elevation: 15,
    shadowColor: colors.primary
  },
  category : {
    fontSize : 14,
    fontFamily : fonts.primary[800],
    color : colors.text.primary
  },
})