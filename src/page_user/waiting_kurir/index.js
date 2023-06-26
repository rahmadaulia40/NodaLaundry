import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, fonts, getData, showSuccess} from '../../utils';
import LottieView from 'lottie-react-native'
import { Button, Gap, Link } from '../../components';
import { Firebase } from '../../config';

const Waiting_Kurir = ({navigation, route}) => {
    const data = route.params

    useEffect(() => {
        getDataHistory()
    }, []);

    const getDataHistory=()=>{
        const rootDB = Firebase.database().ref('washing').orderByChild('uidWashing').equalTo(`${data}`)
        rootDB.on('value', async snapshot => {
          if(snapshot.val()) {
            const oldData = snapshot.val()
            const promises = await Object.keys(oldData).map(async key => {
                if(oldData[key].status == 'Proses Penjemputan'){
                    navigation.goBack()
                    navigation.navigate('Pesanan Anda')
                }
            })
            await Promise.all(promises)

          }
        })
    }

    const onCancel =()=> {
        Firebase.database().ref(`washing/${data}/`).remove(()=>{
            showSuccess('Pembatalan telah dilakukan')
            navigation.goBack()
        })
    }

    const onBack =()=> {
        navigation.goBack()
        navigation.navigate('Pesanan Anda')
    }

  return (
    <View style={styles.wrapper}>
        <LottieView source={require('../../assets/json/dummy/searching.json')} autoPlay loop />
        <Text style={styles.text}>Menunggu Konfirmasi...</Text>
        <View style={styles.button}>
            <Button title='Batalkan Pencucian' onPress={()=>onCancel()}/>
            <Gap height={10}/>
            <Link title='Menunggu Konfirmasi dilatar belakang' align='center' size={16} onPress={()=> onBack()}/>
        </View>
    </View>
  )
}

export default Waiting_Kurir

const styles = StyleSheet.create({
    wrapper : {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        width: '100%',
        height: '100%'
    },
    text : {
        fontSize: 18,
        color : colors.primary,
        fontFamily: fonts.primary[600],
        top : -150
    },
    button : {
        bottom: -170,
        minWidth: 150
    }
})