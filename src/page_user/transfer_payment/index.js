import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, push_notification, showError } from '../../utils'
import  {WebView} from 'react-native-webview'
import { Button, Gap, Header } from '../../components'
import { Firebase, Midtrans } from '../../config'
import axios from 'axios'
import { useDispatch } from 'react-redux';

const Transfer_payment = ({navigation, route}) => {
    const dispatch = useDispatch();
    const data = route.params
    const [listAdministrator, setListAdministrator] = useState([])
    const [status, setStatus] = useState({})
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

    useEffect(()=> {
        getStatus()
        getListAdministrator()
    }, [data.nota, status])

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
              return item.levelAccount == 'administrator' || item.levelAccount == 'admin'
            }, 0)
            await Promise.all(promises, filteringAdmin)
            setListAdministrator(filteringAdmin)
          }
        })
      }

      const pushNotif=()=>{
        listAdministrator.map(res=>{
          push_notification(`[NOTA : ${data.nota}] - Pembayaran Telah Dilakukan !`, res.token)
        })
      }

    const getStatus = () => {
        axios({
            method: "GET",
            url: Midtrans.URL_MIDTRANS_STATUS+data.nota+'/status',
            headers: Midtrans.HEADER_MIDTRANS
        })
        .then(res=>{
            setStatus(res.data)
        })
    }
    const onFailed =()=>{
        const sendData = {
            status : 'Pakaian Telah di Lokasi, Lakukan Pembayaran !',
            date : tgl[date.getDate()],
            month : month[date.getMonth()],
            year : date.getFullYear(),
        }
        Firebase.database().ref(`washing/${data.uidWashing}/`).update(sendData)
        .then(()=>{
            showError('Silahkan lakukan pembayaran ulang !')
            navigation.goBack()
        })
    }

    const onSuccess =()=>{
        const sendData = {
            status : 'Pembayaran Telah Selesai',
            date : tgl[date.getDate()],
            month : month[date.getMonth()],
            year : date.getFullYear(),
            finishDate : `${tgl[date.getDate()]}/${month[date.getMonth()]}/${date.getFullYear()}`,
        }
        Firebase.database().ref(`washing/${data.uidWashing}/`).update(sendData)
        .then(()=>{
            const newData = {
                itemName : `Cuci : ${data.nota}`,
                jumlah : `${data.total} Pcs`,
                price : data.totalPrice,
                date : tgl[date.getDate()],
                month : month[date.getMonth()],
                year : date.getFullYear(),
            }
            const upload = Firebase.database().ref('pendapatan').push(newData)
            Firebase.database().ref(`pendapatan/${upload.key}`).update({uid : upload.key})
            navigation.goBack()
            pushNotif()
            navigation.goBack()
        })
    }

    const onBack =()=>{
        getStatus()
        navigation.goBack()
    }

    const onLoadStart =()=>{
        dispatch({type: 'SET_LOADING', value: true})
        getStatus()
    }

    const viewButton=()=>{
        if(status.transaction_status == 'expire' || status.transaction_status == 'deny' || status.status_code == '404'){
            return (
                <View style={{marginHorizontal: 5}}>
                    <Button title={'Lakukan Pembayaran Ulang'} onPress={()=>onFailed()}/>
                    <Gap height={5}/>
                </View>
            )
        }
        if (status.transaction_status == "settlement" || status.transaction_status == "capture"){
            return (
                <View style={{marginHorizontal: 5}}>
                    <Button title={'Pembayaran Selesai'} onPress={()=>onSuccess()}/>
                    <Gap height={5}/>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <Header title='Lanjutkan Pembayaran' type='payment' onPress={()=>onBack()}/>
            <WebView source={{uri : data.url}} onLoadStart={()=>onLoadStart()} onLoad={()=>dispatch({type: 'SET_LOADING', value: false})} />
            {viewButton()}
        </View>
    )
}

export default Transfer_payment

const styles = StyleSheet.create({
    container : {
      backgroundColor : colors.background,
      flex:1,
    },
  })