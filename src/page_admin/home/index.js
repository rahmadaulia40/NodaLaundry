import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, RefreshControl} from 'react-native';
import { Gap, NewsItem, ReviewUser } from '../../components';
import { colors, fonts, getData, showError } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILNullPhoto } from '../../assets';

const Home_administrator = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getListPendapatan()
    getListPengeluaran()
    getDataWashing()
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
  const [photo, setPhoto] = useState(ILNullPhoto)
  const [review, setReview] = useState([])
  const [proses, setProses] = useState({
    pembayaran : '0',
    pencucian : '0',
    penjemputan : '0',
    konfirmasi : '0'
  })
  const [totalPendapatan, setTotalPendapatan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const calender = new Date()
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'November', 'Desember']
  const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
  useEffect(()=> {
    getData('administrator')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
      dispatch({type: 'SET_LOADING', value: false})
    })
    getListPendapatan()
    getListPengeluaran()
    getDataWashing()
    getNews()
    getReview()
  }, [])

  const getListPendapatan = () =>{
    Firebase.database().ref('pendapatan').orderByChild('year').equalTo(calender.getFullYear())
    .once('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        const filtering = data.filter(a =>{ return a.month == month[calender.getMonth()]})
        const hitung = filtering.reduce((a,b)=>{return a+Number(b.price)}, 0)
        await Promise.all(promises)
        setTotalPendapatan(hitung)
      }
    })
  }
  const getListPengeluaran = () =>{
    Firebase.database().ref('pengeluaran').orderByChild('year').equalTo(calender.getFullYear())
    .once('value', async snapshot => {
      if(snapshot.val()) {
          const oldData = snapshot.val()
          const data = []
          const promises = await Object.keys(oldData).map(async key => {
            data.push({
              ...oldData[key]
            })
          })
          const filtering = data.filter(a =>{ return a.month == month[calender.getMonth()]})
          const hitung = filtering.reduce((a,b)=>{return a+Number(b.price)}, 0)
          await Promise.all(promises)
          setTotalPengeluaran(hitung)
        }
      })
  }

  const getDataWashing=()=>{
    Firebase.database().ref().child('washing')
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
        const filtering4 = data.filter(item =>{return item.status == 'Menunggu Konfirmasi'})
        setProses({
          'pembayaran' : filtering1.length,
          'penjemputan' : filtering2.length,
          'pencucian' : filtering3.length,
          'konfirmasi' : filtering4.length
        })
        await Promise.all(promises)
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

  const onReview =()=>{
    dispatch({type: 'SET_LOADING', value: true})
    navigation.navigate('Review_detail')
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
      <View style={styles.page}>
        <View style={styles.content}>

          <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
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
            <Gap height ={10}/>

            <TouchableOpacity style={styles.box} onPress={()=> {navigation.navigate('Kas_admin')}}>
              <View style={styles.tableBox}>
              <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Data Keuangan : </Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${bulan[calender.getMonth()]} ${calender.getFullYear()}`}</Text>
                </View>
              </View>
              <Gap height={20}/>
              <View style={styles.tableBox}>
                <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Pemasukan</Text>
                  <Text style={styles.buttonTeksBox}>Pengeluaran</Text>
                </View>
                <View style={styles.tableCenterBox}>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${totalPendapatan},-`}</Text>
                  <Text style={styles.buttonTeksBox}>{`${totalPengeluaran},-`}</Text>
                </View>
              </View>
              <Gap height={10}/>
              <View style={styles.tableBoxLine}>
                <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Total</Text>
                </View>
                <View style={styles.tableCenterBox}>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${Number(totalPendapatan)-Number(totalPengeluaran)},-`}</Text>
                  <Gap height={20}/>
                  <Text style={styles.buttonTeksBox}>{`Detail >>`}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {viewBox('Proses Pembayaran', proses.pembayaran)}
            {viewBox('Proses Pencucian', proses.pencucian)}
            {viewBox('Proses Penjemputan', proses.penjemputan)}
            {viewBox('Menunggu Konfirmasi', proses.konfirmasi)}

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
            </View>

            <View style={styles.wrapperSection}>
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
  )
}

export default Home_administrator

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
  tableBox :{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableBoxLine :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.border.onBlur
  },
  tableLeftBox: {
    flex: 1,
    alignItems: 'flex-start'
  },
  tableCenterBox: {
    width: 25
  },
  tableRightBox: {
    flex: 1,
    alignItems: 'flex-end'
  },
  box : {
    marginHorizontal : 10,
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    backgroundColor: colors.background
},
})