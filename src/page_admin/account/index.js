import React, {useState, useEffect} from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ILNullPhoto } from '../../assets'
import {Gap, Header, List, Profile} from '../../components'
import { Firebase } from '../../config'
import { colors, getData, showError, showSuccess, storeData } from '../../utils'

const Account_admin = ({navigation}) => {
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        photo: ILNullPhoto
    })
    useEffect(() => {
        //mengambil data dari localstorage
        getData('administrator').then(res => {
            const data = res
            data.photo = {uri : res.photo}
            setProfile(data)
        })
    }, [])

    const signOut = () =>{
        Firebase.auth().signOut().then (() => {
            storeData('administrator', null)
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
        <View style={styles.page}>
            <View style={styles.coloring}>
                <Header title='Profile' type='dark-only'/>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
                    <Gap height={10}/>
                    <Profile name={profile.fullName} desc={profile.email} photo={profile.photo}/>
                    <Gap height={14}/>
                    <List name='Update Profile' type='next-only' icon='edit-profile' onPress={()=> navigation.navigate('UpdateProfile_admin')} />
                    <List name='Update Toko' type='next-only' icon='store' onPress={()=> navigation.navigate('Update_toko')}/>
                    <List name='List Harga' type='next-only' icon='price' onPress={()=> navigation.navigate('List_priceAdmin')}/>
                    <List name='List Karyawan' type='next-only' icon='admin' onPress={()=> navigation.navigate('List_admin')}/>
                    <List name='Sign Out' type='next-only' icon='logout' onPress={signOut}/>
                    <Gap height ={80}/>
                </ScrollView>
            </View>
        </View>
    )
}

export default Account_admin

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
})
