import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import { colors, fonts } from '../../../utils';
import { Rating } from 'react-native-ratings';

const ReviewUser = ({onPress, name, desc, avatar, rate}) => {
  return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
          <Image source={avatar} style={styles.avatar}/>
          <View style={styles.profil}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.category}>{desc}</Text>
          </View>
          <View style={styles.rate}>
            <Rating
                type='custom'
                ratingColor={colors.primary}
                ratingBackgroundColor={colors.secondary}
                startingValue={rate}
                ratingCount={5}
                imageSize={18}
                readonly
                tintColor={colors.background}
                style={{ paddingVertical: 5, backgroundColor: colors.background }}
            />
          </View>
      </TouchableOpacity>
  )
}

export default ReviewUser

const styles = StyleSheet.create({
  container : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    paddingBottom : 16
  },
  avatar : {
    width : 50,
    height : 50,
    borderRadius : 50/2,
    marginRight : 12
  },
  rate : {
    flexDirection : 'row',
    alignItems: 'center'
  },
  name : {
    fontSize : 16,
    fontFamily : fonts.primary[600],
    color : colors.text.primary
  },
  category : {
    fontSize : 12,
    fontFamily : fonts.primary.normal,
    color : colors.text.secondary,
    marginTop : 2
  },
  profil : {
    flex : 1
  }
})