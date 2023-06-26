import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl} from 'react-native';
import { useDispatch } from 'react-redux';
import {Button, Gap, Header, Input, List} from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData, push_notification, showError, useForm } from '../../utils';
import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import { ILDropDown, ILDropUp, ILTroli } from '../../assets';

const Troli = ({navigation, route}) => {
  const dispatch = useDispatch();
  const receiveData = route.params
  const [listClothes, setListClothes] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [dropDown, setDropDown] = useForm({totalClothes : ''})
  const [clothes, setClothes] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }
  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  }
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    setRefresh(true)
    getDataTroly()
    getClothes()
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const category = ["Cuci Kiloan", "Cuci Satuan"]
  useEffect(()=> {
    getClothes()
    getDataTroly()
  }, [])

  const getDataTroly = ()=>{
    const rootDB = Firebase.database().ref()
    const troliDB = rootDB.child('washing/'+receiveData.uidWashing+'/clothes/')
    troliDB.on('value', async snapshot => {
        if(snapshot.val()) {
            const oldData = snapshot.val()
            const data = []
            const promises = await Object.keys(oldData).map(async key=>{
                data.push({
                    ...oldData[key]
                  })
            })
            let total = data.reduce((val, element)=>{return val + Number(element.totalClothes)},0)
            let totalPrice = data.reduce((val, element)=>{return val + Number(element.price)},0)
            setTotal(total)
            setTotalPrice(totalPrice)
            await Promise.all(promises)
            setListClothes(data)
            dispatch({type: 'SET_LOADING', value: false})
        }
        else{
          dispatch({type: 'SET_LOADING', value: false})
          setListClothes('null')
          setTotalPrice(0)
        }
    })
  }

  const getClothes = () => {
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
        setClothes(data)
      }
    })
  }
  const filtering2 = clothes.filter(item=>{return item.jenis == 'Cuci Satuan'})
  const category2 = filtering2.map(item=>{return item.itemName})
  const filtering3 = clothes.filter(item=>{return item.jenis == 'Cuci Kiloan'})
  const category3 = filtering3.map(item=>{return item.itemName})

  const addClothes =() => {
    toggleModal()
    const filtering = clothes.filter(data=>{return data.itemName == dropDown.jenisPakaian})
    const priceClothes = filtering.map(data=>{return data.price})
    const totalPrice = Number(priceClothes.toString())*Number(dropDown.totalClothes)
    if(dropDown.totalClothes == ''){
      showError('Anda belum mengisi data pakaian dengan benar !!!')
    }
    else{
      const newData = {
        totalClothes : dropDown.totalClothes,
        kategori : dropDown.kategori,
        jenisPakaian : dropDown.jenisPakaian,
        price : totalPrice
      }
      const upload = Firebase.database().ref('washing/'+receiveData.uidWashing+'/clothes/').push(newData)
      Firebase.database().ref(`washing/${receiveData.uidWashing}/clothes/${upload.key}`).update({uid : upload.key})
      setDropDown('reset')
    }
  }

  const deleteClothes=(key)=>{
    Firebase.database().ref(`washing/${receiveData.uidWashing}/clothes/${key}/`).remove()
    getDataTroly()
    showError('Data Telah Dihapus !')
  }

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

  const onPickup =()=> {
    const newData = {
      status : 'Pakaian Sudah Dijemput',
      ongkir : dropDown.ongkir,
      totalPrice : Number(totalPrice)+Number(dropDown.ongkir),
      total : total,
      date : tgl[date.getDate()],
      month : month[date.getMonth()],
      year : date.getFullYear(),
    }
    Firebase.database().ref(`washing/${receiveData.uidWashing}/`).update(newData)
    .then(()=>{
        navigation.goBack()
        push_notification(`[${receiveData.nameAdmin}] Pakaian Sudah Dijemput`, receiveData.token)
    })
  }
  
  return (
    <>
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='Data Pakaian Kotor' type='dark' onPress={()=> navigation.goBack()}/>
          <View style={{marginHorizontal: 10, flex: 1}}> 

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingTop: 10}}>
              <Text style={styles.titleTotal}>Total :</Text>
              <Text style={styles.titleTotal}>{`Rp ${totalPrice},-`}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            {listClothes == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Pakaian Belum Tersedia !</Text> : listClothes.map(item => {
                return <List 
                    type ='delete' 
                    key = {item.uid}
                    name={`${item.jenisPakaian} (${item.totalClothes} ${item.kategori == 'Cuci Kiloan' ? 'Kg' : 'Pcs'})`}
                    total={`Rp.${item.price},-`}
                    desc={item.kategori}
                    onPress={()=>deleteClothes(item.uid)}
                  />
                })
                }
            </ScrollView>
            <Gap height={10}/>
            <Button title='Bawa Pakaian' onPress={toggleModal2} disable={listClothes == 'null' ? true : false}/>
            <Gap height={20}/>
          </View>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Input Data Pakaian</Text>

                        <Gap height={10}/>
                        <Text style={styles.nameDropDown}>Kategori</Text>
                        <Gap height={5}/>
                        <SelectDropdown
                            data={category}
                            defaultButtonText={'Tekan disini'}
                            buttonTextStyle={styles.nameDropDown}
                            buttonStyle={styles.dropdownStyle}
                            dropdownIconPosition='right'
                            rowTextStyle={styles.nameDropDown}
                            onSelect={(selectedItem, index) => {setDropDown('kategori', selectedItem)}}
                            buttonTextAfterSelection={(selectedItem, index) => {return selectedItem;}}
                            renderDropdownIcon={isOpened => {
                                if(isOpened){return <ILDropUp/>}
                                else {return <ILDropDown/>}
                            }}
                        />
                        <Gap height={10}/>
                        <Text style={styles.nameDropDown}>{dropDown.kategori == 'Cuci Kiloan' ? 'Jenis Cucian' : 'Jenis Pakaian'}</Text>
                        <Gap height={5}/>
                        <SelectDropdown
                            data={dropDown.kategori == 'Cuci Kiloan' ? category3 : category2}
                            defaultButtonText={'Tekan disini'}
                            buttonTextStyle={styles.nameDropDown}
                            buttonStyle={styles.dropdownStyle}
                            dropdownIconPosition='right'
                            rowTextStyle={styles.nameDropDown}
                            onSelect={(selectedItem, index) => {setDropDown('jenisPakaian', selectedItem)}}
                            buttonTextAfterSelection={(selectedItem, index) => {return selectedItem;}}
                            renderDropdownIcon={isOpened => {
                                if(isOpened){return <ILDropUp/>}
                                else {return <ILDropDown/>}
                            }}
                        />
                        <Gap height={10}/>
                        <Input judul={dropDown.kategori == 'Cuci Kiloan' ? 'Berat Pakaian (Kg)' : 'Jumlah Pakaian (Pcs)'} keyboardType='phone-pad' value={dropDown.totalClothes} onChangeText={(value)=> setDropDown('totalClothes',value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Tambah" onPress={addClothes}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal} />
                </View>
            </Modal>

            <Modal isVisible={isModalVisible2}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Input Data Ongkir</Text>
                        <Gap height={10}/>
                        <Input judul='Biaya Kurir' keyboardType='phone-pad' value={dropDown.ongkir} onChangeText={(value)=> setDropDown('ongkir',value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Input Ongkir" onPress={onPickup}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal2} />
                </View>
            </Modal>

        </View>
      </View>
      <TouchableOpacity style={styles.troli} onPress={toggleModal}>
        <ILTroli/>
      </TouchableOpacity>
    </>
  )
}

export default Troli

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
  dropdownStyle: {
    backgroundColor: colors.background,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1
  },
  nameDropDown: {
    fontFamily: fonts.primary[700],
    color : colors.text.primary,
    fontSize: 14
  },
  troli:{
    position: 'absolute',
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 80,
    left: 15,
    elevation: 10
  },
  confDelete : {
    height: 30,
    width: 50, 
    right: 0,
    backgroundColor: colors.primary
  },
  titleTotal : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 18
  },
})