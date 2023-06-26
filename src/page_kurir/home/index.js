import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Image, RefreshControl} from 'react-native';
import { Button, Gap, List } from '../../components';
import { colors, fonts, getData, push_notification, storeData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILNullPhoto } from '../../assets';

const Home_kurir = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const [historyWashing, setHistoryWashing] = useState([])
  const onResfresh = React.useCallback(()=>{
    getDataUserOnFirebase()
    getWashing()
    getDataWashing()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({fullName: ''})
  const [photo, setPhoto] = useState(ILNullPhoto)
  const [proses, setProses] = useState({
    pembayaran : '0',
    pencucian : '0',
    penjemputan : '0',
    selesai : '0'
  })
  useEffect(()=> {
    getData('kurir')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
      dispatch({type: 'SET_LOADING', value: false})
    })
    getDataUserOnFirebase()
    getWashing()
    getDataWashing()
  }, [profile.uid])
  
  const getDataUserOnFirebase=()=>{
    Firebase.database()
    .ref(`account/${profile.uid}/`)
    .once('value')
    .then(resDB => {
      //save to localstorage
      if (resDB.val()) {
        const data = resDB.val()
        storeData('kurir',data)
      }
    })
  }

  const getWashing =()=>{
    Firebase.database().ref().child('washing').orderByChild('status').equalTo('Menunggu Konfirmasi')
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          const reqDataUser = Firebase.database().ref().child(`account/${oldData[key].uid_user}`).once('value')
          const dataUser = (await reqDataUser).val()
          data.push({
            sorting : oldData[key].year+oldData[key].month+oldData[key].date,
            ...dataUser,
            ...oldData[key]
          })
        })
        await Promise.all(promises)
        setHistoryWashing(data.sort((a, b)=>{return b.sorting - a.sorting}))
      }
    else{
      setHistoryWashing('null')
    }
    })
  }

  const getDataWashing=()=>{
    Firebase.database().ref().child('washing').orderByChild('uid_kurir').equalTo(`${profile.uid}`)
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        const filtering1 = data.filter(item =>{return item.status == 'Proses Pembayaran'})
        const filtering2 = data.filter(item =>{return item.status == 'Proses Penjemputan'})
        const filtering3 = data.filter(item =>{return item.status == 'Proses Pencucian Pakaian'})
        const filtering4 = data.filter(item =>{return item.status == 'Pembayaran Telah Selesai'})
        setProses({
          'pembayaran' : filtering1.length,
          'penjemputan' : filtering2.length,
          'pencucian' : filtering3.length,
          'selesai' : filtering4.length,
        })
        await Promise.all(promises)
      }
    })
  }

  const onConfirmation =(data)=>{
    const newData = {
      ...data,
      status : 'Proses Penjemputan',
      nameAdmin : profile.fullName,
    }
    Firebase.database().ref(`washing/${data.uidWashing}/`).update({
      status : 'Proses Penjemputan', 
      nameAdmin : profile.fullName,
      uid_kurir : profile.uid
    })
    .then(()=>{
        navigation.navigate('detailCustomer', newData)
        push_notification(`[${profile.fullName}] Proses Penjemputan`, data.token)
    })
  }

  const viewBox =(title, number)=>{
    return (
      <>
        <Gap height ={10}/>
        <View style={styles.buttonBox}>
          <Text style={styles.buttonTeksBox}>{title}</Text>
          <Text style={styles.buttonTeksBox}>{number}</Text>
        </View>
      </>
    )
  }

  return (
    <>
      <View style={styles.page}>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 0}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            <View style={styles.bgFlayer}>
              <Gap height ={20}/>
              <View style={{flexDirection: 'row'}}>
                <Image source={photo} style={styles.avatar}/>
                <View>
                  <Text style={styles.title}>Selamat Datang,</Text>
                  <Text style={styles.titleName}>{profile.fullName}</Text>
                </View>
              </View>
              <Gap height ={20}/>
            </View>
            <Gap height ={20}/>
                {
                  historyWashing == 'null' ? 
                  <View>
                    {viewBox('Proses Penjemputan', proses.penjemputan)}
                    {viewBox('Proses Pencucian', proses.pencucian)}
                    {viewBox('Proses Pembayaran', proses.pembayaran)}
                    {viewBox('Telah Selesai', proses.selesai)}
                  </View> 
                  : historyWashing.map(data=>{
                    return (
                      <>
                      <View style={styles.box}>
                        <Gap height ={20}/>
                        <Text style={styles.titleNotif}>{data.status}</Text>
                        <Text style={styles.text}>{data.nota}</Text>
                        <Text style={styles.text}>{data.date} - {data.month} - {data.year}</Text>
                        <Gap height ={10}/>
                        <Image source={{uri : data.photo}} style={styles.photo}/>
                        <Gap height ={10}/>
                        <Text style={styles.text}>{data.fullName}</Text>
                        <Text style={styles.text}>{data.ponsel}</Text>
                        <Text style={styles.text}>{data.address}</Text>
                        <View style={styles.btnConf}>
                          <Button title='Konfirmasi' onPress={()=> onConfirmation(data)}/>
                        </View>
                        <Gap height ={20}/>
                      </View>
                      <Gap height ={20}/>
                      </>
                  )})
                }

            <Gap height ={80}/>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Home_kurir

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.background,
  },
  bgFlayer:{
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: colors.primary,
    paddingLeft: 30,
    elevation: 20
  },
  category : {
    flexDirection : 'row',
    justifyContent : 'space-around',
    flex: 1
  },
  wrapperSection : {
    marginHorizontal:16
  },
  wrapperScroll : {
    marginHorizontal : -16
  },
  content : {
    flex : 1,
    backgroundColor : colors.background,
  },
  sectionlabel : {
    fontSize : 16,
    fontFamily : fonts.primary[600],
    color : colors.text.primary,
    marginTop : 30,
    marginBottom : 16
  },
  title : {
    color : colors.white,
    marginLeft: 10,
    fontFamily : fonts.primary[600],
    fontSize: 18
  },
  titleNotif : {
    color : colors.text.primary,
    fontFamily : fonts.primary[800],
    fontSize: 18,
    alignSelf: 'center'
  },
  text : {
    color : colors.text.primary,
    fontFamily : fonts.primary[800],
    fontSize: 14,
    alignSelf: 'center'
  },
  titleName : {
    color : colors.white,
    marginLeft: 10,
    fontFamily : fonts.primary[700],
    fontSize: 28
  },
  avatar : {
    width : 50,
    height : 50,
    borderRadius : 50/2,
    marginRight : 12
  },
  photo : {
    width : 80,
    height : 80,
    borderRadius : 80/2,
    alignSelf : 'center'
  },
  box : {
    marginHorizontal: 10,
    elevation: 20,
    backgroundColor: colors.background,
    borderRadius: 15,
    paddingHorizontal: 10
  },
  btnConf : {
    paddingTop: 15,
    marginHorizontal: 10
  },
  buttonBox: {
    backgroundColor: colors.background,
    elevation: 5,
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'space-between'
  },
  buttonTeksBox: {
    color: colors.text.primary,
    fontFamily: fonts.primary[700],
    fontSize: 14,
  },

})