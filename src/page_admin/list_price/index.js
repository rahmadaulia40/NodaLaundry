import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, showError, useForm} from '../../utils';
import { useDispatch } from 'react-redux';
import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import { ILDropDown, ILDropUp } from '../../assets';

const List_priceAdmin = ({navigation}) => {
    const [listHarga, setListHarga] = useState([])
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const category = ["Cuci Kiloan", "Cuci Satuan"]
    const [listClothes, setListClothes] = useForm({
      itemName : '',
      jenis: '',
      price: ''
    })
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    }
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

      const addClothes =() => {
        toggleModal()
        if(listClothes.itemName == ''){
          showError('Anda belum mengisi data pakaian dengan benar !!!')
        }
        else{
          const upload = Firebase.database().ref('daftarHarga').push(listClothes)
          Firebase.database().ref(`daftarHarga/${upload.key}`).update({uid : upload.key})
          setListClothes('reset')
        }
      }

    const deleteClothes=(key)=>{
        Firebase.database().ref(`daftarHarga/${key}/`).remove()
        showError('Data Telah Dihapus !')
      }
  return (
      <>
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='List Harga' type='dark' onPress={()=>navigation.goBack()}/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          {listHarga.map(item => {
              return (
                <List
                    type='delete'
                    key={item.uid}
                    name={item.itemName}
                    desc={item.jenis}
                    total={`Rp${item.price},-`}
                    onPress={()=>deleteClothes(item.uid)}
                />
              )
            })}
          </ScrollView>
          <View style={{marginHorizontal: 10}}>
            <Button title='Tambah Data' onPress={toggleModal}/>
          </View>
          <Gap height={10}/>
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Input Data Pakaian</Text>
                        <Gap height={20}/>
                        <Text style={styles.nameDropDown}>Kategori Cucian</Text>
                        <Gap height={10}/>
                        <SelectDropdown
                            data={category}
                            defaultButtonText={'Tekan disini'}
                            buttonTextStyle={styles.nameDropDown}
                            buttonStyle={styles.dropdownStyle}
                            dropdownIconPosition='right'
                            rowTextStyle={styles.nameDropDown}
                            onSelect={(selectedItem, index) => {setListClothes('jenis', selectedItem)}}
                            buttonTextAfterSelection={(selectedItem, index) => {return selectedItem;}}
                            renderDropdownIcon={isOpened => {
                                if(isOpened){return <ILDropUp/>}
                                else {return <ILDropDown/>}
                            }}
                        />
                        <Gap height={10}/>
                        <Input judul='Jenis Cucian/Pakaian' value={listClothes.itemName} onChangeText={(value)=> setListClothes('itemName',value)} type='komentar'/>
                        <Gap height={10}/>
                        <Input judul='Biaya Laundry (Kg/Pcs)' keyboardType='phone-pad' value={listClothes.price} onChangeText={(value)=> setListClothes('price',value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Tambah" onPress={addClothes}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal} />
                </View>
      </Modal>
      </>
  )
}

export default List_priceAdmin

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
})