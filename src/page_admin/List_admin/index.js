import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData, showError, showSuccess, useForm} from '../../utils';
import { useDispatch } from 'react-redux';
import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import { ILDropDown, ILDropUp } from '../../assets';

const List_admin = ({navigation}) => {
    const [listAdministrator, setListAdministrator] = useState([])
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('')
    const [listAccount, setListAccount] = useState([])
    const [profile, setProfile] = useState({})
    const category = ["admin", "kurir"]
    const [dropDown, setDropDown] = useForm({})
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    }
    useEffect(()=> {
      getData('administrator').then(res => {
        setProfile(res)
      })
        getListAdministrator()
      }, [])
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
              return item.levelAccount == 'administrator' || item.levelAccount == 'admin' || item.levelAccount == 'kurir'
            }, 0)
            await Promise.all(promises, filteringAdmin)
            setListAdministrator(filteringAdmin)
            setListAccount(data)
            dispatch({type: 'SET_LOADING', value: false})
          }
        })
    }

    const addAdmin =() => {
        toggleModal()
          listAccount.filter(item => {
            if( item.email == email){
              Firebase.database().ref(`account`).child(item.uid).update({levelAccount : dropDown.kategori})
              .then(()=>{
                showSuccess('Admin berhasil ditambah !')
                setEmail('')
              })
              .catch(err=> {
                showError(err)
              })
            }
            else {
              showError('E-mail yang anda masukkan tidak tersedia/salah !')
            }
          })
        
      }

      const deleteAdmin=(item)=>{
        if(profile.levelAccount == 'administrator') {
          if(item.levelAccount == 'administrator'){
            showError('Akses penghapusan anda ditolak !')
            setEmail('')  
          }
          else{
            Firebase.database().ref(`account`).child(item.uid).update({levelAccount : 'user'})
            .then(()=>{
                showSuccess('Data berhasil diubah !')
                setEmail('')
            })
            .catch(err=> {
                showError(err)
            })
          }
        }
        else {
          showError('Akses penghapusan anda ditolak !')
          setEmail('')        
        }
    }
  return (
      <>
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='Data Karyawan' type='dark' onPress={()=>navigation.goBack()}/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          {listAdministrator.map(item => {
              return (
                <List
                    type='deleteWithPicture'
                    key={item.uid}
                    name={`${item.fullName} [${item.levelAccount}]`}
                    avatar={item.photo}
                    desc={item.email}
                    onPress={()=>deleteAdmin(item)}
                />
              )
            })}
          </ScrollView>
          <View style={{marginHorizontal: 10}}>
            <Button title='Tambah Karyawan' onPress={toggleModal}/>
          </View>
          <Gap height={10}/>
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Tambah Admin</Text>
                        <Gap height={10}/>
                        <Input judul='E-mail Pengguna' value={email} onChangeText={(value)=> setEmail(value)} type='komentar'/>
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
                        <Text>* Pastikan e-mail sudah terdaftar di sistem ! jika belum terdaftar, silahkan daftar akun terlebih dahulu.</Text>
                        <Gap height={20}/>
                    </ScrollView>
                    <Button title="Tambah" onPress={addAdmin}/>
                    <Gap height={10}/>
                    <Button title="Close" type='secondary' onPress={toggleModal} />
                </View>
      </Modal>
      </>
  )
}

export default List_admin

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