import React, {useState, useEffect} from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ILNullPhoto } from '../../assets'
import {Gap, Header, List, Profile} from '../../components'
import { Firebase } from '../../config'
import { colors, fonts, getData, showError, showSuccess, storeData } from '../../utils'

const Account_kurir = ({navigation}) => {
    const [photo, setPhoto] = useState(ILNullPhoto)
    const [profile, setProfile] = useState({
        fullName: '',
        profession: ''
    })
    useEffect(() => {
        getData('kurir').then(res => {
            setPhoto({uri : res.photo})
            setProfile(res)
        })
    }, [profile.uid])

    const signOut = () =>{
        Firebase.auth().signOut().then (() => {
            storeData('user', null)
            navigation.reset({
                index: 0,
                routes: [{name: 'Login'}]
            })
        })
        .then(()=> {
            showSuccess('Anda telah SignOut !')
        })
        .catch(err => {
            showError(err.message)
        })
    }

    return (
        <>
        <View style={styles.page}>
            <View style={styles.coloring}>
                <Header title='Profile' type='dark-only'/>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
                    <Gap height={10}/>
                    <Profile name={profile.fullName} desc={profile.email} photo={photo}/>
                    <Gap height={14}/>
                    <List name='Sign Out' type='next-only' icon='logout' onPress={signOut}/>
                    <Gap height ={80}/>
                </ScrollView>
            </View>
        </View>
        </>
    )
}

export default Account_kurir

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
      modal: {
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingVertical: 20,
        marginHorizontal: 20,
        paddingHorizontal: 20
      },
      title : {
        fontFamily: fonts.primary[700],
        color : colors.primary,
        alignSelf: 'center',
        fontSize: 20
      },
})
