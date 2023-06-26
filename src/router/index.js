import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Login, Splash, GetStarted, Payment_receipt, Review_detail} from '../page_master';
import {account_admin, detailCustomer, detailHistory_admin, history_admin, home_administrator, Kas_admin, List_admin, List_priceAdmin, Register_Admin, UpdateProfile_admin, Update_toko, UploadLocation, UploadOutlet, UploadPhoto_Admin} from '../page_admin';
import {BottomNavigator} from '../components';
import {home_kurir, history_kurir, account_kurir, detailHistory_kurir} from '../page_kurir'
import { account_user, detailHistory_user, history_user, Home_user, List_priceUser, register_user, transfer_payment, troli, UpdateProfile_user, uploadLocation_user, uploadPhoto_user, Waiting_Kurir } from '../page_user';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp_administrator = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigator {...props}/>}>
            <Tab.Screen name='Home' component={home_administrator} options={{headerShown: false}}/>
            <Tab.Screen name='Daftar Pesanan'component={history_admin} options={{headerShown: false}}/>
            <Tab.Screen name='Akun' component={account_admin} options={{headerShown: false}}/>
        </Tab.Navigator>
    )
}

const MainApp_user = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigator {...props}/>}>
            <Tab.Screen name='Home' component={Home_user} options={{headerShown: false}}/>
            <Tab.Screen name='Pesanan Anda'component={history_user} options={{headerShown: false}}/>
            <Tab.Screen name='Akun' component={account_user} options={{headerShown: false}}/>
        </Tab.Navigator>
    )
}

const MainApp_kurir = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigator {...props}/>}>
            <Tab.Screen name='Home' component={home_kurir} options={{headerShown: false}}/>
            <Tab.Screen name='History'component={history_kurir} options={{headerShown: false}}/>
            <Tab.Screen name='Akun' component={account_kurir} options={{headerShown: false}}/>
        </Tab.Navigator>
    )
}

const Router=()=>{
    return (
        <Stack.Navigator initialRouteName='Splash'>
            {/* Page Master */}
            <Stack.Screen name='Splash' component={Splash} options={{headerShown: false}}/>
            <Stack.Screen name='GetStarted' component={GetStarted} options={{headerShown: false}}/>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
            <Stack.Screen name='Payment_receipt' component={Payment_receipt} options={{headerShown: false}}/>
            <Stack.Screen name='Review_detail' component={Review_detail} options={{headerShown: false}}/>
            {/* Page User */}
            <Stack.Screen name='MainApp_user' component={MainApp_user} options={{headerShown: false}}/>
            <Stack.Screen name='register_user' component={register_user} options={{headerShown: false}}/>
            <Stack.Screen name='uploadPhoto_user' component={uploadPhoto_user} options={{headerShown: false}}/>
            <Stack.Screen name='uploadLocation_user' component={uploadLocation_user} options={{headerShown: false}}/>
            <Stack.Screen name='troli' component={troli} options={{headerShown: false}}/>
            <Stack.Screen name='detailHistory_user' component={detailHistory_user} options={{headerShown: false}}/>
            <Stack.Screen name='transfer_payment' component={transfer_payment} options={{headerShown: false}}/>
            <Stack.Screen name='UpdateProfile_user' component={UpdateProfile_user} options={{headerShown: false}}/>
            <Stack.Screen name='List_priceUser' component={List_priceUser} options={{headerShown: false}}/>
            <Stack.Screen name='Waiting_Kurir' component={Waiting_Kurir} options={{headerShown: false}}/>
            {/* Page Admin */}
            <Stack.Screen name='MainApp_administrator' component={MainApp_administrator} options={{headerShown: false}}/>
            <Stack.Screen name='Register_Admin' component={Register_Admin} options={{headerShown: false}}/>
            <Stack.Screen name='UploadPhoto_Admin' component={UploadPhoto_Admin} options={{headerShown: false}}/>
            <Stack.Screen name='UploadLocation' component={UploadLocation} options={{headerShown: false}}/>
            <Stack.Screen name='UploadOutlet' component={UploadOutlet} options={{headerShown: false}}/>
            <Stack.Screen name='detailHistory_admin' component={detailHistory_admin} options={{headerShown: false}}/>
            <Stack.Screen name='detailCustomer' component={detailCustomer} options={{headerShown: false}}/>
            <Stack.Screen name='UpdateProfile_admin' component={UpdateProfile_admin} options={{headerShown: false}}/>
            <Stack.Screen name='List_priceAdmin' component={List_priceAdmin} options={{headerShown: false}}/>
            <Stack.Screen name='Update_toko' component={Update_toko} options={{headerShown: false}}/>
            <Stack.Screen name='Kas_admin' component={Kas_admin} options={{headerShown: false}}/>
            <Stack.Screen name='List_admin' component={List_admin} options={{headerShown: false}}/>
            {/* Page Kurir */}
            <Stack.Screen name='MainApp_kurir' component={MainApp_kurir} options={{headerShown: false}}/>
            <Stack.Screen name='detailHistory_kurir' component={detailHistory_kurir} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default Router;