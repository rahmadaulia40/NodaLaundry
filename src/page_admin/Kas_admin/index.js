import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData, showError, showSuccess, useForm} from '../../utils';
import { useDispatch } from 'react-redux';
import Modal from "react-native-modal";
import RNPrint from 'react-native-print';

const Kas_admin = ({navigation}) => {
    const [listPendapatan, setListPendapatan] = useState([])
    const [listPengeluaran, setListPengeluaran] = useState([])
    const [totalPendapatan, setTotalPendapatan] = useState(0)
    const [totalPengeluaran, setTotalPengeluaran] = useState(0)
    const dispatch = useDispatch();
    const [isModalPendapatan, setModalPendapatan] = useState(false);
    const [isModalPengeluaran, setModalPengeluaran] = useState(false);
    const [onPendapatan, setOnPendapatan] = useState('primary');
    const [onPengeluaran, setOnPengeluaran] = useState('secondary');
    const [profile, setProfile] = useState({})

    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'November', 'Desember']
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
    const [pendapatan, setPendapatan] = useForm({
      itemName : '',
      jumlah: '',
      price: 0
    })
    const [pengeluaran, setPengeluaran] = useForm({
      itemName : '',
      jumlah: '',
      price: 0,
    })

    useEffect(()=> {
      getData('administrator').then(res => {
        setProfile(res)
      })
        getListPendapatan()
        getListPengeluaran()
    }, [])

    const getListPendapatan = () =>{
        Firebase.database().ref().child('pendapatan')
        .on('value', async snapshot => {
          if(snapshot.val()) {
            const oldData = snapshot.val()
            const data = []
            const promises = await Object.keys(oldData).map(async key => {
              data.push({
                sorting : oldData[key].year+oldData[key].month+oldData[key].date,
                ...oldData[key]
              })
            })
            const hitung = data.reduce((a,b)=>{return a+Number(b.price)}, 0)
            await Promise.all(promises)
            setListPendapatan(data.sort((a, b)=>{return b.sorting - a.sorting}))
            setTotalPendapatan(hitung)
            dispatch({type: 'SET_LOADING', value: false})
          }
          else {
            setListPendapatan('null')
          }
        })
    }
    const getListPengeluaran = () =>{
        Firebase.database().ref().child('pengeluaran')
        .on('value', async snapshot => {
          if(snapshot.val()) {
            const oldData = snapshot.val()
            const data = []
            const promises = await Object.keys(oldData).map(async key => {
              data.push({
                sorting : oldData[key].year+oldData[key].month+oldData[key].date,
                ...oldData[key]
              })
            })
            const hitung = data.reduce((a,b)=>{return a+Number(b.price)}, 0)
            await Promise.all(promises)
            setTotalPengeluaran(hitung)
            setListPengeluaran(data.sort((a, b)=>{return b.sorting - a.sorting}))
            dispatch({type: 'SET_LOADING', value: false})
          }
          else{
            setListPengeluaran('null')
          }
        })
    }

    const Pendapatan=()=>{
      const toggleModal = () => {
        setModalPendapatan(!isModalPendapatan);
      }

      const addPendapatan =() => {
        toggleModal()
        if(pendapatan.itemName == '' && pendapatan.price == ''){
          showError('Anda belum mengisi data pakaian dengan benar !!!')
        }
        else{
          const newData = {
            ...pendapatan,
            date : tgl[date.getDate()],
            month : month[date.getMonth()],
            year : date.getFullYear(),
          }
          const upload = Firebase.database().ref('pendapatan').push(newData)
          Firebase.database().ref(`pendapatan/${upload.key}`).update({uid : upload.key})
          setPendapatan('reset')
        }
      }
      const deletePendapatan=(item)=>{
        if(profile.levelAccount == 'administrator'){
          Firebase.database().ref(`pendapatan/${item.uid}/`).remove()
          showSuccess('Data Telah Dihapus !')
        }
        else {
          showError('Akses penghapusan anda di tolak !')
        }
      }
      return(
        <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingTop: 10}}>
          <Text style={styles.title}>Total :</Text>
          <Text style={styles.title}>{`Rp ${totalPendapatan},-`}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {listPendapatan == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belum Tersedia !</Text> : listPendapatan.map(item => {
            return (
              <List
                  type='delete'
                  key={item.uid}
                  name={`${item.itemName}`}
                  desc={` ${item.date}/${item.month}/${item.year}`}
                  total={`Rp ${item.price},-`}
                  onPress={()=>deletePendapatan(item)}
              />
            )
          })}
        </ScrollView>
        <View style={{marginHorizontal: 10}}>
          <Button title='Tambah Pendapatan' onPress={toggleModal}/>
        </View>
        <Gap height={10}/>
        <Modal isVisible={isModalPendapatan}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Input Data Pendapatan</Text>
                        <Gap height={10}/>
                        <Input judul='Nama Item' value={pendapatan.itemName} onChangeText={(value)=> setPendapatan('itemName',value)} type='komentar'/>
                        <Gap height={20}/>
                        <Input judul='Jumlah'  keyboardType='numeric' value={pendapatan.jumlah} onChangeText={(value)=> setPendapatan('jumlah',value)} type='komentar'/>
                        <Gap height={20}/>
                        <Input judul='Total Harga' keyboardType='numeric' value={pendapatan.price} onChangeText={(value)=> setPendapatan('price',value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Tambah" onPress={addPendapatan}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal} />
                </View>
        </Modal>
        </>
      )
    }

    const Pengeluaran=()=>{
      const toggleModal = () => {
        setModalPengeluaran(!isModalPengeluaran);
      }

      const addPengeluaran =() => {
        toggleModal()
        if(pengeluaran.itemName == '' && pengeluaran.price == ''){
          showError('Anda belum mengisi data pakaian dengan benar !!!')
        }
        else{
          const newData = {
            ...pengeluaran,
            date : tgl[date.getDate()],
            month : month[date.getMonth()],
            year : date.getFullYear(),
          }
          const upload = Firebase.database().ref('pengeluaran').push(newData)
          Firebase.database().ref(`pengeluaran/${upload.key}`).update({uid : upload.key})
          setPengeluaran('reset')
        }
      }
      const deletePengeluaran=(key)=>{
        Firebase.database().ref(`pengeluaran/${key}/`).remove()
        showError('Data Telah Dihapus !')
      }
      return(
        <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingTop: 10}}>
          <Text style={styles.title}>Total :</Text>
          <Text style={styles.title}>{`Rp ${totalPengeluaran},-`}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {listPengeluaran == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belum Tersedia !</Text> : listPengeluaran.map(item => {
            return (
              <List
                  type='delete'
                  key={item.uid}
                  name={`${item.itemName}`}
                  desc={`${item.date}/${item.month}/${item.year} - (${item.jumlah})`}
                  total={`Rp ${item.price},-`}
                  onPress={()=>deletePengeluaran(item.uid)}
              />
            )
          })}
        </ScrollView>
        <View style={{marginHorizontal: 10}}>
          <Button title='Tambah Pengeluaran' onPress={toggleModal}/>
        </View>
        <Gap height={10}/>
        <Modal isVisible={isModalPengeluaran}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Input Data Pengeluaran</Text>
                        <Gap height={10}/>
                        <Input judul='Nama Item' value={pengeluaran.itemName} onChangeText={(value)=> setPengeluaran('itemName',value)} type='komentar'/>
                        <Gap height={20}/>
                        <Input judul='Jumlah'  keyboardType='numeric' value={pengeluaran.jumlah} onChangeText={(value)=> setPengeluaran('jumlah',value)} type='komentar'/>
                        <Gap height={20}/>
                        <Input judul='Total Harga' keyboardType='numeric' value={pengeluaran.price} onChangeText={(value)=> setPengeluaran('price',value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Tambah" onPress={addPengeluaran}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal} />
                </View>
        </Modal>
        </>
      )
    }

    const onPrint = ()=>{
      RNPrint.print({
        jobName: `Kas Noda Laundry ${bulan[date.getMonth()]} ${date.getFullYear()}`,
        html: 
        `
          <h3>
            NODA LAUNDRY<br/>
            Logon Advance Care wet Cleaning<br/>
            Jl. Polonia No. 19, Medan, Sumatera Utara<br/>
            Telepon : 0812-6776-4467
          </h3>
          <hr/>

          <table style="width: 100%;">
            <caption style="font-weight: bold;">Data Keuangan Noda Laundry</caption>
            <caption style="font-weight: bold;">Bulan : ${bulan[date.getMonth()]} ${date.getFullYear()}</caption>
            <tr>
              <th align="left">Pemasukan</th>
              <td align="right">${totalPendapatan},-</td>
            </tr>
            <tr>
              <th align="left">Pengeluaran</th>
              <td align="right">${totalPengeluaran},-</td>
            </tr>
            <tr>
              <th align="left">Pendapatan Bersih</th>
              <td align="right">${Number(totalPendapatan)-Number(totalPengeluaran)},-</td>
            </tr>
          </table>

          <table style="width: 100%;">
            <caption style="font-weight: bold;">Data Detail Pendapatan</caption>
              <thead>
                  <tr>
                      <th>Tanggal</th>
                      <th>Pendapatan</th>
                      <th>Quantity</th>
                      <th>Harga (Rupiah)</th>
                  </tr>
              </thead>
              <tbody>
              ${listPendapatan === 'null' ?
              '<h4></h4>' :
              listPendapatan.map(item =>{
              return (`
                  <tr>
                    <td>${item.date}/${item.month}/${item.year}</td>
                    <td>${item.itemName}</td>
                    <td align="right">${item.jumlah}</td>
                    <td align="right">${item.price},-</td>
                  </tr>`
              )})}
              </tbody>
              <tfoot>
              <tr>
                  <th colspan="3">Total Pendapatan</th>
                  <th align="right">${totalPendapatan},-</th>
              </tr>
          </tfoot>
          </table>

          <table style="width: 100%;">
            <caption style="font-weight: bold;">Data Detail Pengeluaran</caption>
              <thead>
                  <tr>
                      <th>Tanggal</th>
                      <th>Pengeluaran</th>
                      <th>Quantity</th>
                      <th>Harga (Rupiah)</th>
                  </tr>
              </thead>
              <tbody>
              ${listPengeluaran === 'null' ?
                '<h4></h4>' :
                listPengeluaran.map(item =>{
              return (`
                  <tr>
                    <td>${item.date}/${item.month}/${item.year}</td>
                    <td>${item.itemName}</td>
                    <td align="right">${item.jumlah}</td>
                    <td align="right">${item.price},-</td>
                  </tr>`
              )})}
              </tbody>
              <tfoot>
              <tr>
                  <th colspan="3">Total Pengeluaran</th>
                  <th align="right">${totalPengeluaran},-</th>
              </tr>
          </tfoot>
          </table>

          <style>
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
            th{
              padding-left: 2%;
              padding-right: 2%;
            }
            td {
              padding-left: 2%;
              padding-right: 2%;
            }
          </style>
          `
      })
    }

  return (
      <>
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='Keuangan' type='dark' onPress={()=>navigation.goBack()}/>
          {onPendapatan == 'primary' ? Pendapatan() : Pengeluaran()}
        </View>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary, paddingHorizontal: 5}}>
        <Button type='btn-left-right' color={onPendapatan} title='Pendapatan' onPress={()=> {setOnPendapatan('primary');setOnPengeluaran('secondary')}}/>
        <Button type='btn-left-right' color={onPengeluaran} title='Pengeluaran' onPress={()=> {setOnPendapatan('secondary');setOnPengeluaran('primary')}}/>
      </View>
      <View style={{height: 5, backgroundColor: colors.primary}}/>

      <View style={{padding : 5}}>
          <Button title='Cetak Keuangan' onPress={onPrint}/>
      </View>
      </>
  )
}

export default Kas_admin

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.primary,
  },
  coloring:{
    backgroundColor : colors.background,
    flex : 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  container : {
    flex : 1,
    marginHorizontal: 10
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
    fontSize: 18
  },
})