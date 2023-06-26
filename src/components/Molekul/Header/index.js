import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import { Button, Gap } from '../../Atom';
import {colors, fonts} from '../../../utils';
import DarkProfile from './DarkProfile';
import LinierGradient from 'react-native-linear-gradient';

const Header = ({onPress, title, type, desc, photo}) => {
  if (type === 'dark-profile'){
    return <DarkProfile onPress={onPress} title={title} desc={desc} photo={photo}/>
  }
  else if (type === 'dark-only'){
    return (
      <View style={styles.darkOnly}>
        <Text style={styles.text('dark')}>{title}</Text>
      </View>
    )
  }
  else if (type === 'background'){
    return (
        <View style={styles.containerWithPicture('dark')}>
          <Button type='icon-only' icon= {type === 'background' ? 'back-light' : 'back-dark'} onPress={onPress}/>
          <Text style={styles.text('dark')}>{title}</Text>
          <Image source={photo} style={styles.avatar}/>
        </View>
    )
  }
  else if (type === 'payment'){
    return (
      <View style={styles.payment('dark')}>
        <Button type='icon-only' icon= {'back-light'} onPress={onPress}/>
        <Text style={styles.text('dark')}>{title}</Text>
        <Gap width={24} />
      </View>
    )
  }
  return (
    <View style={styles.container(type)}>
      <Button type='icon-only' icon= {type === 'dark' ? 'back-light' : 'back-dark'} onPress={onPress}/>
      <Text style={styles.text(type)}>{title}</Text>
      <Gap width={24} />
    </View>
  )
}
 
export default Header;
const styles = StyleSheet.create({
  container: (type)=>({
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: type === 'dark' ? colors.primary : colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 10,
    marginHorizontal: 10
  }),
  text : (type) =>({
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontFamily: fonts.primary[800],
    color: type === 'dark' ? colors.white : colors.primary,
    textTransform : 'capitalize',
  }),
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50/2
  },
  content: {
    flexDirection: 'column',
    marginBottom: -80,
    paddingHorizontal: 15
  },
  darkOnly:{
    marginHorizontal: 50,
    paddingVertical: 15,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 20,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  containerWithPicture: (type)=>({
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: type === 'dark' ? colors.primary : colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 10,
    marginHorizontal: 10
  }),
  payment: (type)=>({
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: type === 'dark' ? colors.primary : colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 20,
  }),
})