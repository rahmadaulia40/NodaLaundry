import React, {useState, useEffect} from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import Modal from "react-native-modal";
import { ILNullPhoto } from '../../assets'
import {Button, Gap, Header, Input, List, Profile} from '../../components'
import { Firebase } from '../../config'
import { colors, fonts, getData, showError, showSuccess, storeData, useForm } from '../../utils'
import { Rating } from 'react-native-ratings';

const Account_user = ({navigation}) => {
    const [outlet, setOutlet] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [rate, setRate] = useState()
    const [review, setReview] = useState()
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    }
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        photo: ILNullPhoto
    })
    useEffect(() => {
        getData('user').then(res => {
            const data = res
            data.photo = {uri : res.photo}
            setProfile(data)
            getDataReview(data.uid)
        })
        getDataOutlet()
    }, [profile.uid])

    const getDataOutlet =()=>{
        Firebase.database().ref('outlet/').once('value')
        .then(res=>{
            setOutlet(res.val())
        })
    }

    const getDataReview = (uid)=> {
        Firebase.database().ref(`review/${uid}`).once('value')
        .then(res=>{
            const data = res.val()
            setRate(data.star)
            setReview(data.review)
        })
    }

    const updateLocation =()=>{
        const data = {
            latitude : profile.Latitude,
            longitude : profile.Longitude,
            address : profile.address,
            uid : profile.uid,
            next_form : 'goBack'
        }
        navigation.navigate('uploadLocation_user', data)
    }

    const contactPerson =()=>{
        Linking.openURL('whatsapp://send?text=Hai, saya memiliki keluhan atas pelayanan anda !&phone=+62'+outlet.outletPhone)
        .catch(()=>{
            showError('Whatsapp tidak bisa di akses ! Pastikan Whatsapp sudah tersedia dan sudah aktif !')
        })
    }

    const onReview=()=>{
        const newData = {
            uid : profile.uid,
            fullName : profile.fullName,
            star : rate,
            review : review,
            photo : profile.photo
        }
        Firebase.database().ref(`review/${profile.uid}`).update(newData)
        .then(()=>{
            navigation.reset({
                index: 0,
                routes: [{name: 'MainApp_user'}]
              })
              showSuccess('Sukses Mengisi Ulasan !')
    })
    }

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

    const ratingCompleted =(rating)=> {
        setRate(rating)
      }

    return (
        <>
        <View style={styles.page}>
            <View style={styles.coloring}>
                <Header title='Profile' type='dark-only'/>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
                    <Gap height={10}/>
                    <Profile name={profile.fullName} desc={profile.email} photo={profile.photo == 'ILNullPhoto' ? ILNullPhoto : profile.photo}/>
                    <Gap height={14}/>
                    <List name='Edit Profile'  type='next-only' icon='edit-profile' onPress={()=> navigation.navigate('UpdateProfile_user')} />
                    <List name='Update Titik Lokasi'  type='next-only' icon='maps' onPress={updateLocation}/>
                    <List name='Contact Person'  type='next-only' icon='help' onPress={contactPerson} />
                    <List name='Give Us Rate'  type='next-only' icon='rate' onPress={toggleModal}/>
                    <List name='Sign Out' type='next-only' icon='logout' onPress={signOut}/>
                    <Gap height ={80}/>
                </ScrollView>
            </View>
        </View>
        <Modal isVisible={isModalVisible}>
            <View style={styles.modal}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Beri Penilaian</Text>
                    <Gap height={10}/>
                    <Rating
                        type='custom'
                        ratingColor={colors.primary}
                        ratingBackgroundColor={colors.secondary}
                        startingValue={rate}
                        ratingCount={5}
                        imageSize={30}
                        onFinishRating={ratingCompleted}
                        tintColor={colors.background}
                        style={{ paddingVertical: 5, backgroundColor: colors.background }}
                    />
                    <Input judul='Ulasan' value={review} onChangeText={(value) => setReview(value)} type='komentar'/>
                    <Gap height={20}/>
                </ScrollView>
                <Button title="Continue" onPress={onReview}/>
                <Gap height={10}/>
                <Button title="Close" type='secondary' onPress={toggleModal} />
            </View>
        </Modal>
        </>
    )
}

export default Account_user

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
