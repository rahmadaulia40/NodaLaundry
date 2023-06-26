import React, {useState, useEffect} from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Gap, Header, Input, Profile } from '../../components'
import { colors, fonts, getData, showError, showSuccess, storeData } from '../../utils'
import {Firebase} from '../../config'
const Update_toko = ({navigation}) => {
    const [outlet, setOutlet] = useState({
        outletName : '',
        outletAddress: '',
        outletEmail: '',
        outletPhone: ''
    })

    useEffect(() => {
        getDataOutlet()
    }, [])

    const getDataOutlet =()=>{
        Firebase.database().ref().child('outlet/').once('value')
        .then(res=>{
            setOutlet(res.val())
        })
    }

    const changeText = (key, value) => {
        setOutlet({
            ...outlet,
            [key]: value
        })
    }

    const update =()=>{
        Firebase.database().ref(`outlet/`).update(outlet)
        .then(() => {
            storeData('administrator', outlet)
            navigation.reset({
                index: 0,
                routes: [{name: 'MainApp_administrator'}]
            })
        showSuccess('Sukses Mengubah Data')
        })
        .catch(err => {
            showError(err.message)
        })
    }



    return (
        <View style={styles.page}>
        <View style={styles.coloring}>
            <Gap height={10} />
            <Header title='Update Toko' type='dark' onPress={()=> navigation.goBack()}/>
            <Gap height={20} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Gap height={26} />
                    <Input judul='Nama Toko' type ='komentar' value={outlet.outletName} onChangeText={(value) => changeText('outletName', value)}/>
                    <Gap height={24}/>
                    <Input judul='Alamat' type ='komentar'  value={outlet.outletAddress} onChangeText={(value) => changeText('outletAddress', value)}/>
                    <Gap height={24}/>
                    <Input judul='Nomor Ponsel' type ='komentar' keyboardType='phone-pad' value={outlet.outletPhone} onChangeText={(value) => changeText('outletPhone', value)}/>
                    <Gap height={24}/>
                    <Input judul='Email' type ='komentar' value={outlet.outletEmail} disable/>
                    <Gap height={40}/>
                    <Button title='Save Profile' onPress={update}/>
                </View>
            </ScrollView>
        </View>
        </View>
    )
}

export default Update_toko

const styles = StyleSheet.create({
    page : {
        flex : 1,
        backgroundColor : colors.primary,
      },
      coloring:{
        backgroundColor : colors.background,
        flex : 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
      },
    content :{
        padding: 40,
        paddingTop: 0
    },
    info: {
        fontFamily: fonts.primary[600],
        color : colors.error
      }
})
