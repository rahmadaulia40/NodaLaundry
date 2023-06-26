import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { ILDetail } from '../../assets'
import { Button, Gap, Header, Input, List } from '../../components'
import { Firebase } from '../../config'
import { getData } from '../../utils'
import { colors, fonts, push_notification } from '../../utils'

const DetailHistory_kurir = ({navigation, route}) => {
    const data = route.params;
    const status = data.status
    const [profile, setProfile] = useState({})
    const [listClothes, setListClothes] = useState([])
    useEffect(()=> {
        getData('kurir').then(res => {setProfile(res)})
        getDataTroly()
    }, [profile.uid])

    const getDataTroly = ()=>{
        const rootDB = Firebase.database().ref()
        const troliDB = rootDB.child('washing/'+data.uidWashing+'/clothes/')
        troliDB.on('value', async snapshot => {
            if(snapshot.val()) {
                const oldData = snapshot.val()
                const data = []
                const promises = await Object.keys(oldData).map(async key=>{
                    data.push({
                        ...oldData[key]
                      })
                })
                await Promise.all(promises)
                setListClothes(data)
            }
        })
      }

    const button = () => {
        if (status === 'Pakaian Sudah Dijemput') {
            const onConfirmation=()=>{
                Firebase.database().ref(`washing/${data.uidWashing}/`).update({status : 'Telah tiba di Laundry', nameAdmin : profile.fullName})
                .then(()=>{
                    navigation.goBack()
                    push_notification(`[${profile.fullName}] Pakaian Telah Tiba Di Laundry`, data.token)
                })
            }
            return (
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Pakaian Tiba Di Laundry' onPress={()=>onConfirmation()}/>
                    <Gap height={5}/>
                </View>
            )
        }
        if (status === 'Proses Penjemputan') {
            const onConfirmation=()=>{
                Firebase.database().ref(`washing/${data.uidWashing}/`).update({status : 'Pakaian Telah Dibawa', nameAdmin : profile.fullName})
                .then(()=>{
                    navigation.goBack()
                    push_notification(`[${profile.fullName}] Pakaian Telah Dibawa`, data.token)
                })
            }
            return (
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Konfirmasi Pengambilan Pakaian' onPress={()=>onConfirmation()}/>
                    <Gap height={5}/>
                </View>
            )
        }
        if (status === 'Pakaian Selesai Dicuci') {
            const onConfirmation=()=>{
                Firebase.database().ref(`washing/${data.uidWashing}/`).update({status : 'Proses Pengembalian Pakaian', nameAdmin : profile.fullName})
                .then(()=>{
                    push_notification(`[${profile.fullName}] Proses Pengembalian Pakaian`, data.token)
                    navigation.goBack()
                })
            }
            return (
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Konfirmasi Pengembalian Pakaian' onPress={()=>onConfirmation()}/>
                    <Gap height={5}/>
                </View>
            )
        }
        if (status === 'Proses Pengembalian Pakaian') {
            const onConfirmation=()=>{
                Firebase.database().ref(`washing/${data.uidWashing}/`).update({status : 'Pakaian Telah di Lokasi, Lakukan Pembayaran !', nameAdmin : profile.fullName})
                .then(()=>{
                    push_notification(`[${profile.fullName}] Pakaian Telah di Lokasi, Lakukan Pembayaran !`, data.token)
                    navigation.goBack()
                })
            }
            return (
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Konfirmasi Pakaian Telah di Lokasi' onPress={()=>onConfirmation()}/>
                    <Gap height={5}/>
                </View>
            )
        }
    }
    
    return (
        <View style={styles.container}>
            <Gap height={10}/>
            <View style={{flex: 1 ,marginHorizontal: 15}}>
                <Header title='Detail Laundry' type='dark' onPress={()=> navigation.goBack()}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                {
                listClothes.map(item => {
                return <List 
                    type ='showOnly' 
                    key = {item.uid}
                    name={`${item.kategori} (${item.totalClothes} ${item.kategori == 'Cuci Kiloan' ? 'Kg' : 'Pcs'})`}
                    total={`Rp.${item.price},-`}
                    desc={item.jenisPakaian}
                  />
                })
                }
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.viewDetail} onPress={()=>{navigation.navigate('detailCustomer', data)}}>
                <View style={styles.troli}>
                    <ILDetail/>
                </View>
                <Text style={styles.titleDetail}>Detail Costumer</Text>
            </TouchableOpacity>

            <View style={styles.viewPage}>
                    <Text style={styles.label}>{`${data.nameAdmin == undefined ? '' : '['+data.nameAdmin+'] '}${data.status} `}</Text>
            </View>
            <View style={styles.viewBottomPage}>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <Text style={styles.label}>NOTA Laundry</Text>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text style={styles.label}>Biaya Kurir</Text>
                        <Text style={styles.label}>Total Harga</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>:</Text>
                        <Text style={styles.label}>:</Text>
                        <Text style={styles.label}>:</Text>
                        <Text style={styles.label}>:</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.price}>{data.nota}</Text>
                    <Text style={styles.price}>{`${data.date}-${data.month}-${data.year}`}</Text>
                    <Text style={styles.price}>{`Rp${data.ongkir},-`}</Text>
                    <Text style={styles.price}>{`Rp${data.totalPrice},-`}</Text>
                </View>
            </View>
            {button()}
        </View>
    )
}

export default DetailHistory_kurir

const styles = StyleSheet.create({
    container : {
      backgroundColor : colors.background,
      flex:1,
    },
    box: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 10
      },
    label : {
        fontSize: 14,
        fontFamily: fonts.primary[700],
        color: colors.white,
        paddingHorizontal: 15
    },
    price : {
        fontSize: 14,
        fontFamily: fonts.primary[700],
        color: colors.white,
        alignSelf: 'flex-end',
        paddingRight: 15,
    },
    viewPage :{
        elevation: 20,
        backgroundColor: colors.error,
        justifyContent: 'center',
        paddingVertical: 15,
    },
    viewBottomPage: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        backgroundColor: colors.primary,
        flexWrap: 'wrap'
    },
    troli:{
        backgroundColor: colors.primary,
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -6,
      },
      viewDetail: {
        flexDirection: 'row-reverse',
        height: 50,
        marginBottom: 10,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 15,
      },
      titleDetail: {
        fontSize: 14,
        fontFamily: fonts.primary[700],
        color: colors.white,
        padding: 7,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: colors.primary
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