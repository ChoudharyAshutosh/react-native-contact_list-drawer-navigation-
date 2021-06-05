import React, {useEffect, useState, useLayoutEffect} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'
import { fetchUserContact } from '../utils/api'
import ContactThumbnail from '../components/ContactThumbnail'
import colors from '../utils/colors';
import store from '../store'
const keyExtractor=({phone})=>phone
export default function User({navigation}){
    const [state, setState]=useState({
        user:store.getState().user,
        loading:store.getState().isFetchingUser,
        error:store.getState().error
    })
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTintColor:'white',
            headerStyle:{
                backgroundColor:colors.black
            },
            headerLeft:()=>(
                <MaterialIcons name="menu" size={24} style={{color: 'white', marginLeft: 10}} onPress={()=>navigation.toggleDrawer()}/>
            ),
            headerRight:()=>(
                <MaterialIcons name="settings" size={24} style={{color: 'white', marginRight: 10}} onPress={()=>navigation.navigate('Options')}/>
            )
        })
    },[])
    useEffect(()=>{
        (async()=>{
            User.unsubscribe=store.onChange(()=>
                setState({
                    user:store.getState().user,
                    loading:store.getState().isFetchingUser,
                    error:store.getState().error
                })
            )
            const user=await fetchUserContact()
            store.setState({user, isFetchingUser:false})
        })()
        return ()=>{
            User.unsubscribe()
        }
    },[])
    const {loading, user, error}=state
    const {avatar, name, phone}=user
    return(
        <View style={styles.container}>
            {loading && <ActivityIndicator size='large'/>}
            {error && <Text>Error...</Text>}
            {!loading &&
                (
                    <ContactThumbnail avatar={avatar} name={name} phone={phone}/>
                )
            }
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
})