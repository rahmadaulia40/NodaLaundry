import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors } from '../../utils';
import { useDispatch } from 'react-redux';

const List_price = ({navigation}) => {
    const [listHarga, setListHarga] = useState([])
    const dispatch = useDispatch();
    useEffect(()=> {
        getListHarga()
      }, [])
      const getListHarga = () =>{
        Firebase.database().ref().child('daftarHarga')
        .on('value', async snapshot => {
          if(snapshot.val()) {
            const oldData = snapshot.val()
            const data = []
            const promises = await Object.keys(oldData).map(async key => {
              data.push({
                ...oldData[key]
              })
            })
            await Promise.all(promises)
            setListHarga(data)
            dispatch({type: 'SET_LOADING', value: false})
          }
        })
      }
    dispatch({type: 'SET_LOADING', value: false})
  return (
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='List Harga' type='dark' onPress={()=>navigation.goBack()}/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          {listHarga.map(item => {
              return (
                <List
                    type='showOnly'
                    key={item.key}
                    name={item.itemName}
                    desc={item.jenis}
                    total={`Rp${item.price},-`}
                />
              )
            })}
          </ScrollView>
        </View>
      </View>
  )
}

export default List_price

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