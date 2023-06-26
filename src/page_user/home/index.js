import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Image, RefreshControl} from 'react-native';
import { WashingCategory, Gap, NewsItem, ReviewUser } from '../../components';
import { colors, fonts, getData, push_notification, showError, storeData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILNullPhoto } from '../../assets';

const Home_user = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getDataUserOnFirebase()
    getNews()
    getReview()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const dispatch = useDispatch();
  const [news, setNews] = useState([])
  const [profile, setProfile] = useState({fullName: ''})
  const [review, setReview] = useState([])
  const [listAdministrator, setListAdministrator] = useState([])
  const [photo, setPhoto] = useState(ILNullPhoto)
  useEffect(()=> {
    getData('user')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
      dispatch({type: 'SET_LOADING', value: false})
    })
    getDataUserOnFirebase()
    getNews()
    getReview()
    getListAdministrator()
  }, [profile.uid])
  
  const getDataUserOnFirebase=()=>{
    Firebase.database()
    .ref(`account/${profile.uid}/`)
    .once('value')
    .then(resDB => {
      //save to localstorage
      if (resDB.val()) {
        const data = resDB.val()
        storeData('user',data)
      }
    })
}

  const getNews = () =>{
    Firebase.database().ref('news/').once('value')
    .then(res => {
      if(res.val()) {
        const data = res.val()
        const filterData = data.filter(el => el !== null)
        setNews(filterData)
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
    .catch(err => {
      showError(err.message)
    })
  }

  const getReview = () => {
    Firebase.database().ref('review').orderByChild('star').limitToLast(3).once('value')
    .then(res => {
      if(res.val()) {
        const oldData = res.val()
        const data = []
        Object.keys(oldData).map(key => {
          data.push({
            ...oldData[key]
          })
        })
        setReview(data)
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
    .catch(err => {
      dispatch({type: 'SET_LOADING', value: false})
      showError(err.message)
    })
  }

  const getListAdministrator = () =>{
    Firebase.database().ref().child('account')
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        const filteringAdmin = await data.filter(item =>{
          return item.levelAccount == 'administrator' || item.levelAccount == 'admin' || item.levelAccount == 'kurir'
        }, 0)
        await Promise.all(promises, filteringAdmin)
        setListAdministrator(filteringAdmin)
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
  }

  const pushNotif=()=>{
    listAdministrator.map(res=>{
      push_notification("Ada Cucian Terbaru nih, segera konfirmasi !", res.token)
    })
  }

  const onWashing =()=>{
    const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
    const tgl = [
      "00","01","02","03","04","05","06","07","08","09",
      "10","11","12","13","14","15","16","17","18","19",
      "20","21","22","23","24","25","26","27","28","29",
      "30","31","32","33","34","35","36","37","38","39",
      "40","41","42","43","44","45","46","47","48","49",
      "50","51","52","53","54","55","56","57","58","59","60"
    ]
    const date = new Date();
    const uidUser = profile.uid
    const year = date.getFullYear().toString()
    const newData = {
      uid_user : profile.uid,
      status : 'Menunggu Konfirmasi',
      date : tgl[date.getDate()],
      month : month[date.getMonth()],
      year : date.getFullYear(),
      startDate : `${tgl[date.getDate()]}/${month[date.getMonth()]}/${date.getFullYear()}`,
      nota : `YGG${year.slice(2,4)+month[date.getMonth()]+tgl[date.getDate()]+month[date.getHours()]+tgl[date.getMinutes()]+uidUser.slice(0,5)}`
    }
    const upload = Firebase.database().ref('washing/').push(newData)
    Firebase.database().ref(`washing/${upload.key}/`).update({uidWashing : upload.key})
    .then(()=>{
        pushNotif()
        navigation.navigate('Waiting_Kurir', upload.key)
    })
  }

  const onPrice =()=>{
    dispatch({type: 'SET_LOADING', value: true})
    navigation.navigate('List_priceUser')
  }

  const onReview =()=>{
    dispatch({type: 'SET_LOADING', value: true})
    navigation.navigate('Review_detail')
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
              <View horizontal showsHorizontalScrollIndicator={false} style={styles.category}>
                <WashingCategory category='List Harga' onPress={onPrice} />
                <WashingCategory category='Cuci Sekarang' onPress={onWashing} />
              </View>
            
            <Gap height ={20}/>

            <View style={styles.wrapperSection}>
              <Text style={styles.sectionlabel}>Ulasan Pengguna</Text>
              {review.map(item =>{
                return (
                <ReviewUser
                  key={item.uid}
                  name={item.fullName}
                  desc={item.review}
                  avatar={item.photo}
                  rate={item.star}
                  onPress={onReview}
                />
                )
              })}
              
              <Text style={styles.sectionlabel}>Seputar Informasi</Text>
            </View>

            {news.map(item => {
              return (
                <NewsItem 
                  key={item.id}
                  title={item.title} 
                  date={item.date} 
                  image={item.image}/>
              )
            })}
            <Gap height ={80}/>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Home_user

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.background,
  },
  bgFlayer:{
    borderBottomRightRadius: 500,
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

})