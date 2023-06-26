import React from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import {colors, fonts} from '../../../utils'
import {Button} from '../../Atom'
import LinierGradient from 'react-native-linear-gradient';

const DarkProfile = ({onPress, title, desc, photo}) => {
    return (
        <LinierGradient style = {styles.container} colors={[colors.secondary,colors.primary]} start={{x:1, y:1}} end={{x:0, y:0}}>
            <Button type='icon-only' icon='back-light' onPress={onPress}/>
            <View style={styles.content}>
                <Text style={styles.name}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
            <Image source={photo} style={styles.avatar}/>
        </LinierGradient>
    )
}

export default DarkProfile
const styles = StyleSheet.create({
    container :{
        backgroundColor: colors.secondary,
        paddingVertical: 30,
        paddingLeft: 20,
        paddingRight: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        flex: 1
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 46/2
    },
    name : {
        fontSize: 20,
        fontFamily: fonts.primary[600],
        color: colors.white,
        textAlign: 'center'
    },
    desc :{
        fontSize: 14,
        fontFamily: fonts.primary.normal,
        marginTop: 6,
        textAlign: 'center',
        color: colors.text.subTitle

    }
})