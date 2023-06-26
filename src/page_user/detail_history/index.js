import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Button, Gap, Header, List } from '../../components'
import { Firebase, Midtrans } from '../../config'
import { getData, showError } from '../../utils'
import { colors, fonts } from '../../utils'
import axios from 'axios'
import { useDispatch } from 'react-redux';

const DetailHistory_user = ({navigation, route}) => {
    const data = route.params;
    const status = data.status
    const [profile, setProfile] = useState({fullName: ''})
    const [listClothes, setListClothes] = useState([])
    const dispatch = useDispatch();
    useEffect(()=> {
        getData('user').then(res => {setProfile(res)})
        getDataTroly()
    }, [profile.uid])

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
    const year = date.getFullYear().toString()

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
        if (status === 'Pakaian Telah di Lokasi, Lakukan Pembayaran !') {
            const onConfirmation=()=>{
                dispatch({type: 'SET_LOADING', value: true})
                const dataTransfer = {
                    transaction_details: {
                      order_id: data.nota,
                      gross_amount: parseInt(data.totalPrice)
                    }, 
                    credit_card: {
                      secure: true
                    },
                    customer_details: {
                        first_name: profile.fullName,
                        email: profile.email,
                        phone: profile.ponsel,
                    },
                }
                axios({
                    method : "POST",
                    url: Midtrans.URL_MIDTRANS+"transactions",
                    headers: Midtrans.HEADER_MIDTRANS,
                    data: dataTransfer,
                    timeout: Midtrans.API_TIMEOUT
                })
                .then(res => {
                    const sendData = {
                        url: res.data.redirect_url,
                        status : 'Proses Pembayaran',
                        nameAdmin : profile.fullName,
                        uidWashing : data.uidWashing,
                        nota : data.nota,
                        uid_user : data.uid_user,
                        paymentMethod : 'Transfer',
                        total : data.total,
                        totalPrice : data.totalPrice
                    }
                    Firebase.database().ref(`washing/${data.uidWashing}/`).update(sendData)
                    .then(()=>{
                        dispatch({type: 'SET_LOADING', value: false})
                        navigation.navigate('transfer_payment', sendData)
                    })
                })
                .catch(res => {
                     showError('NOTA diubah dikarenakan NOTA lama sudah digunakan, silahkan lakukan pembayaran ulang !')
                    const nota = `YGG${year.slice(2,4)+month[date.getMonth()]+tgl[date.getDate()]+month[date.getHours()]+tgl[date.getMinutes()]+data.uid_user.slice(0,5)}`
                    Firebase.database().ref(`washing/${data.uidWashing}/`).update({nota : nota})
                    dispatch({type: 'SET_LOADING', value: false})
                    navigation.goBack()
                })
            }
            return (
                <>
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Bayar Sekarang' onPress={onConfirmation}/>
                    <Gap height={5}/>
                </View>
                </>
            )
        }
        if (status === 'Pembayaran Telah Selesai') {
            const onConfirmation=()=>{
                const sendData = {
                    status : 'Pembayaran Telah Selesai',
                    uidWashing : data.uidWashing,
                    uid_user : data.uid_user
                }
                dispatch({type: 'SET_LOADING', value: true})
                navigation.navigate('Payment_receipt', sendData)
            }
            return (
                <View style={{paddingHorizontal: 5}}>
                    <Gap height={5}/>
                    <Button title='Lihat Bukti Pembayaran' onPress={onConfirmation}/>
                    <Gap height={5}/>
                </View>
            )
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.coloring}>
            <Gap height={10}/>
            <Header title='Detail Laundry' type='dark' onPress={()=> navigation.goBack()}/>
            <View style={{flex: 1 ,marginHorizontal: 15}}>
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
                    <Text style={styles.price}>{`Rp${data.ongkir == undefined ? 0 : data.ongkir},-`}</Text>
                    <Text style={styles.price}>{`Rp${data.totalPrice == undefined ? 0 : data.totalPrice},-`}</Text>
                </View>
            </View>
            {button()}
            </View>
        </View>
    )
}

export default DetailHistory_user

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : colors.primary,
      },
      coloring:{
        backgroundColor : colors.background,
        flex : 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
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
    dropdownStyle: {
        backgroundColor: colors.background,
        borderRadius: 10,
        width: '100%',
        borderWidth: 1
      },
      nameDropDown: {
        fontFamily: fonts.primary[700],
        color : colors.text.primary
      },
      title : {
        fontFamily: fonts.primary[700],
        color : colors.primary,
        alignSelf: 'center',
        fontSize: 20
      },
      modal: {
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingVertical: 20,
        marginHorizontal: 20,
        paddingHorizontal: 20
      },
  })