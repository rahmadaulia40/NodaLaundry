import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Gap, Header, List } from '../../components'
import { colors, fonts, getData } from '../../utils'
import { Firebase } from '../../config'
import { ILLogo } from '../../assets'
import { useDispatch } from 'react-redux';

const Payment_receipt = ({navigation, route}) => {
    const data = route.params
    const [dataWashing, setDataWashing] = useState([])
    const [outlet, setOutlet] = useState([])
    const [profile, setProfile] = useState({fullName: ''})
    const dispatch = useDispatch();
    useEffect(() => {
        getDataUser()
        getDataOutlet()
    }, [])

    const getDataWashing=()=>{
        const rootDB = Firebase.database().ref()
        const urlHistory = `washing/${data.uidWashing}`
        const serviceDB = rootDB.child(urlHistory)
        serviceDB.on('value', async snapshot => {
          if(snapshot.val()) {
            const newData = snapshot.val()
              setDataWashing(newData)
              dispatch({type: 'SET_LOADING', value: false})
          }
        })
    }
    const getDataOutlet =()=>{
        Firebase.database().ref('outlet/').once('value')
        .then(res=>{
            setOutlet(res.val())
            getDataWashing()
        })
    }
    const getDataUser =()=>{
        getData('user')
        .then(res => {
            setProfile(res)
            getDataOutlet()
        })
    }

    return (
        <View style={styles.container}>
            <Header title='Kwitansi Pembayaran' type='payment' onPress={()=> navigation.goBack()}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.box}>
                    <View style={styles.image}>
                        <Image source={ILLogo} style={styles.logo}/>
                        <Text style={styles.title}>{outlet.outletName}</Text>
                        <Text style={styles.textHeader}>{outlet.outletAddress}</Text>
                        <Text style={styles.textHeader}>{outlet.outletPhone}</Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <Text style={styles.title}>{profile.fullName}</Text>
                    <Text style={styles.text}>{dataWashing.nota}</Text>
                    <Gap height={5}/>
                    <Text style={styles.textBox}>{dataWashing.paymentMethod}</Text>
                    <Gap height={10}/>
                    <View style={styles.tableBox}>
                        <View style={styles.tableLeftBox}>
                            <Text style={styles.text}>Alamat</Text>
                        </View>
                        <View style={styles.tableCenterBox}>
                            <Text style={styles.text}>:</Text>
                        </View>
                        <View style={styles.tableRightBox}>
                            <Text style={styles.text}>{profile.address}</Text>
                        </View>
                    </View>
                    <View style={styles.tableBox}>
                        <View style={styles.tableLeftBox}>
                            <Text style={styles.text}>Ponsel</Text>
                            <Text style={styles.text}>Dimulai</Text>
                            <Text style={styles.text}>Selesai</Text>
                            <Text style={styles.text}>Total Biaya</Text>
                            <Text style={styles.text}>Pembayaran</Text>
                            <Text style={styles.text}>Pengembalian</Text>
                            <Text style={styles.text}>Status</Text>
                        </View>
                        <View style={styles.tableCenterBox}>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                            <Text style={styles.text}>:</Text>
                        </View>
                        <View style={styles.tableRightBox}>
                            <Text style={styles.text}>{profile.ponsel}</Text>
                            <Text style={styles.text}>{dataWashing.startDate}</Text>
                            <Text style={styles.text}>{dataWashing.finishDate}</Text>
                            <Text style={styles.text}>{`Rp${dataWashing.totalPrice},-`}</Text>
                            <Text style={styles.text}>{`Rp${dataWashing.totalPrice},-`}</Text>
                            <Text style={styles.text}>Rp0,-</Text>
                            <Text style={styles.textBoxLunas}>Lunas</Text>
                        </View>
                    </View>
                    <Gap height={5}/>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Syarat & Ketentuan</Text>
                    <Text style={styles.textFooter}>PERHATIAN !</Text>
                    <View style={styles.tableBox}>
                        <Text>1. </Text>
                        <Text style={{flex: 1}}>
                            Garansi apabila pakaian rusak dan hilang karena pengerjaan dan berlaku
                            khusus layanan dry clean dan wet clean.
                            Senilai Rp. 100.000/lembar pakaian rusak/hilang.
                        </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>2. </Text>
                        <Text style={{flex: 1}}>
                            Cucian KILOAN tidak ada garansi (LUNTUR, SUSUT, SOBEK MELAR, DAN BERCAK)
                            dan sepenuhnya menjadi tanggung jawab customer.
                        </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>3. </Text>
                        <Text style={{flex: 1}}>
                            Pakaian SATUAN tidak ada garansi KELUNTURAN terutama luntur dari bahan sendiri.
                        </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text >4. </Text>
                        <Text style={{flex: 1}}>
                            Penggantian kehilangan baju akan kami ganti 10x harga satuan / kg baju yang hilang .
                            Contoh : Harga 8.000 / kg : 1 Kg isi 4 = 2.000 x 10 = Rp. 20.000,-
                        </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>5. </Text>
                        <Text style={{flex: 1}}>
                            Garansi HILANG berlaku apabila saat pengambilan pelanggan melakukan pengecekan didepan kasir.
                        </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>6. </Text>
                    <Text style={{flex: 1}}>
                        Garansi pengerjaan ulang apabila masih kotor, kurang rapi dan kurang wangi. Pasti dan TANPA BIAYA.
                    </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>7. </Text>
                    <Text style={{flex: 1}}>
                        Garansi pengerjaan ulang berlaku selama 1x24 jam sejak laundry diambil dan dalam kondisi seperti penyerahan kami.
                    </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>8. </Text>
                    <Text style={{flex: 1}}>
                        Barang 30 hari tidak diambil bukan tanggung jawab kami jika hilang.
                    </Text>
                    </View>
                    <View style={styles.tableBox}>
                        <Text>9. </Text>
                    <Text style={{flex: 1}}>
                        Apabila anda mencuci di laundry kami di anggap setuju dengan isi ketentuan di atas.
                    </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Payment_receipt

const styles = StyleSheet.create({
    container : {
      flex:1,
    },
    box : {
        margin : 5,
        borderRadius: 10,
        elevation: 20,
        padding: 20,
        backgroundColor: colors.background
    },
    image: {
        aspectRatio: 1 * 1.8
      },
    logo: {
        resizeMode: 'cover',
        height: '60%',
        width: '50%',
        alignSelf: 'center'
        
      },
      title: {
        textAlign: 'center',
          color : colors.text.primary,
          fontSize : 18,
          fontFamily : fonts.primary[800],
          borderBottomWidth: 1,
          borderColor: colors.border.onBlur,
          paddingBottom: 5
      },
      textHeader: {
        textAlign: 'center',
          color : colors.text.primary,
          fontSize : 14,
          fontFamily : fonts.primary[600]
      },
      text: {
        textAlign: 'center',
          color : colors.text.primary,
          fontSize : 14,
          fontFamily : fonts.primary[600],
          paddingBottom: 10
      },
      textFooter: {
          color : colors.text.primary,
          fontSize : 14,
          fontFamily : fonts.primary[600],
          textAlign: 'justify'
      },
      textBox: {
        textAlign: 'center',
          color : colors.white,
          fontSize : 14,
          fontFamily : fonts.primary[600],
          backgroundColor: colors.primary,
          paddingHorizontal: 15,
          paddingVertical: 5,
          alignSelf: 'center',
          borderRadius: 5
      },
      textBoxLunas: {
        textAlign: 'center',
          color : colors.white,
          fontSize : 14,
          fontFamily : fonts.primary[600],
          backgroundColor: colors.primary,
          paddingHorizontal: 25,
          paddingVertical: 3,
          borderRadius: 5
      },
      tableBox :{
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      tableLeftBox: {
        flex: 1,
        alignItems: 'flex-start',
        minWidth: 80,
        maxWidth: 85
      },
      tableCenterBox: {
        flex: 1,
        alignItems: 'flex-start',
        maxWidth: 10
      },
      tableRightBox: {
        flex: 1,
        alignItems: 'flex-end'
      }
  })