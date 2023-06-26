import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { IconFace, IconFaceActive, IconHistory, IconHistoryActive, IconHome, IconHomeActive,  IconMessages, IconMessagesActive } from '../../../assets';
import { colors, fonts } from '../../../utils';

const TabItem = ({title, active, onPress, onLongPress}) => {
    const Icon =()=>{
        if (title === 'Home')
        {
            return active ? <IconHomeActive/> : <IconHome/>
        }
        if (title === 'Messages')
        {
            return active ? <IconMessagesActive/> : <IconMessages/>
        }
        if (title === 'Daftar Pesanan')
        {
            return active ? <IconHistoryActive/> : <IconHistory/>
        }
        if (title === 'History')
        {
            return active ? <IconHistoryActive/> : <IconHistory/>
        }
        if (title === 'Pesanan Anda')
        {
            return active ? <IconHistoryActive/> : <IconHistory/>
        }
        if (title === 'Akun')
        {
            return active ? <IconFaceActive/> : <IconFace/>
        }
        else
        {
            return active ? <IconFaceActive/> : <IconFace/>
        }
    }
  return (
      <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
          <Icon/>
            <Text style={styles.text(active)}>{title}</Text>
      </TouchableOpacity>
  )
}

export default TabItem

const styles = StyleSheet.create({
    container : {
        alignItems: 'center',
        paddingHorizontal: 15
    },
    text : (active)=> ({
        fontSize : 12,
        color : active ? colors.text.menuActive : colors.text.menuInactive,
        fontFamily : fonts.primary[800],
    })
})