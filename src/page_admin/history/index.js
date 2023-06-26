import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors } from '../../utils';

const History_admin = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getWashing()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const [historyWashing, setHistoryWashing] = useState([])

  useEffect(()=> {
    getWashing()
  },[historyWashing.uid_user])

  const getWashing =()=>{
    Firebase.database().ref().child('washing')
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
    })
  }

  return (
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Header type='dark-only' title='Daftar Pesanan'/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            {
              historyWashing.map(data=>{
                return (
                <List
                  key={data.uidWashing}
                  date={`${data.date}/${data.month}`}
                  year={data.year}
                  name={data.fullName}
                  desc={`${data.nameAdmin == undefined ? '' : '['+data.nameAdmin+'] '}${data.status} `}
                  type='next'
                  onPress={()=> navigation.navigate('detailHistory_admin', data)}
                />
              )})
            }
            <Gap height ={80}/>
          </ScrollView>
        </View>
      </View>
  )
}

export default History_admin

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