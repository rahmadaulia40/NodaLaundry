import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, Text} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData } from '../../utils';

const History_kurir = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getDataHistory()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const [user, setUser] = useState({})
  const [historyWashing, setHistoryWashing] = useState([])
  const getDataUserFromLocal =()=> {
    getData('kurir')
    .then(res=>{
        setUser(res)
    })
}

  useEffect(()=> {
    getDataUserFromLocal()
    getDataHistory()
  },[user.uid])

  const getDataHistory=()=>{
    const rootDB = Firebase.database().ref('washing').orderByChild('uid_kurir').equalTo(`${user.uid}`)
    rootDB.on('value', async snapshot => {
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
        setRefresh(false)
      }
      else {
        setHistoryWashing('null')
      }
    })
  }

  const onAction=(data)=>{
    if(data.status == 'Proses Penjemputan'){
      navigation.navigate('detailCustomer', data)
    }
    else if(data.status == 'Telah Tiba Dilokasi'){
      navigation.navigate('troli', data)
    }
    else if(data.status == 'Proses Pembayaran'){
      navigation.navigate('transfer_payment', data)
    }
    else{
      navigation.navigate('detailHistory_kurir', data)
    }
  }

  return (
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Header type='dark-only' title='Pesanan Anda'/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
          {historyWashing == 'null' ? 
            <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Pesanan Belum Tersedia !</Text>
            : historyWashing.map(data => {
                return (
                <List
                  key={data.uidWashing}
                  date={`${data.date}/${data.month}`}
                  year={data.year}
                  name={data.fullName}
                  desc={`${data.nameAdmin == undefined ? '' : '['+data.nameAdmin+'] '}${data.status} `}
                  type='next'
                  onPress={()=>onAction(data)}
                />
              )})
            }
          </ScrollView>
          <Gap height ={80}/>
        </View>
      </View>
  )
}

export default History_kurir

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
  container : {
    flex : 1,
    marginHorizontal: 10
  },
})