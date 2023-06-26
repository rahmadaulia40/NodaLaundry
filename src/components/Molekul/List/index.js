import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import { IconAdmin, IconDelete, IconEditProfile, IconHelp, IconLanguage, IconLogout, IconMaps, IconNext, IconRate, IconStar, IconStore, ILNullPhoto, ILPrice } from '../../../assets';
import { colors, fonts } from '../../../utils';
import { Gap } from '../../Atom';

const List = ({profile, name, desc, type, onPress, icon, rate, total, date, year, avatar}) => {
    const rating = []
    const Icon =()=>{
        if (icon === 'edit-profile'){
            return <IconEditProfile/>
        }
        else if (icon === 'language'){
            return <IconLanguage/>
        }
        else if (icon === 'rate'){
            return <IconRate/>
        }
        else if (icon === 'help'){
            return <IconHelp/>
        }
        else if (icon === 'logout'){
            return <IconLogout/>
        }
        else if (icon === 'price'){
            return <ILPrice/>
        }
        else if (icon === 'store'){
            return <IconStore/>
        }
        else if (icon === 'maps'){
            return <IconMaps/>
        }
        else if (icon === 'admin'){
            return <IconAdmin/>
        }
        else {
            return <IconEditProfile/>
        }
    }

    if (type === 'next'){
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View style={styles.date}>
                    <Text style={styles.name}>{date}</Text>
                    <Text style={styles.name}>{year}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                </View>
                <Text style={styles.name}>{total}</Text>
                <IconNext/>
            </TouchableOpacity>
        )
    }
    if (type === 'next-only'){
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Icon/>
                <Gap width={20}/>
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <IconNext/>
            </TouchableOpacity>
        )
    }
    if (type === 'delete'){
        return (
            <TouchableOpacity style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                </View>
                <Text style={styles.name}>{total}</Text>
                <Gap width={20}/>
                <TouchableOpacity onPress={onPress}>
                    <IconDelete/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    if (type === 'deleteWithPicture'){
        return (
            <TouchableOpacity style={styles.container}>
                <Image source={avatar == undefined ? ILNullPhoto : {uri : avatar}} style={styles.avatar}/>
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <IconDelete/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    if (type === 'showOnly'){
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.desc}>{desc}</Text>
                </View>
                <Text style={styles.name}>{total}</Text>
            </View>
        )
    }
    if (type === 'showInformation'){
        return (
            <View style={styles.container}>
                <Text style={styles.name}>{total}</Text>
                <View style={styles.content}>
                    <Text style={styles.desc}>{name}</Text>
                </View>
            </View>
        )
    }
    for (var i=1;i<=rate;i++) {
        rating.push(<IconStar/>)
      }
  return (
      <TouchableOpacity style={styles.page} onPress={onPress}>
          {icon ? <Icon/> : <Image source={profile} style={styles.image}/> }
          <View style={{flexDirection : 'row', marginRight: 16}}>
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
            <View style={styles.rate}>
              {rating}
            </View>
          </View>
      </TouchableOpacity>
  )
}

export default List

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row',
        padding : 16,
        borderBottomWidth : 1,
        borderBottomColor : colors.border.onBlur,
        alignItems : 'center',
        justifyContent: 'space-between',
    },
    avatar : {
        width : 46,
        height : 46,
        borderRadius : 46/2,
    },
    page : {
        flexDirection : 'column',
        padding : 10,
        borderBottomWidth : 1,
        borderBottomColor : colors.border,
        alignItems : 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        margin: 10,
        borderRadius: 10
    },
    image : {
        width : '100%',
        height : 170,
        marginBottom: 10,
        borderRadius: 10
    },
    name : {
        fontSize : 14,
        fontFamily : fonts.primary[800],
        color : colors.text.menuActive,
        marginLeft: 5,
        marginRight: 5,
    },
    desc : {
        fontSize : 14,
        fontFamily : fonts.primary[600],
        color : colors.text.primary,
        marginLeft: 5,
    },
    content : {
        flex: 1,
    },
    rate : {
        flexDirection : 'row',
        alignItems: 'center',
      },
    date : {
        alignItems: 'center',
        borderRightWidth: 1,
    },
    avatar : {
        width : 50,
        height : 50,
        borderRadius : 50/2,
        marginRight : 12
      },
})