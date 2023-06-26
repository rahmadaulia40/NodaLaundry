import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Gap, Header, ReviewUser } from '../../components';
import { Firebase } from '../../config';
import { colors, showError } from '../../utils';
import { useDispatch } from 'react-redux';

const Review_detail = ({navigation}) => {
  const [review, setReview] = useState([])
    const dispatch = useDispatch();
    useEffect(()=> {
        getReview()
      }, [])
      const getReview = () => {
        Firebase.database().ref('review').orderByChild('star').once('value')
        .then(res => {
          if(res.val()) {
            const oldData = res.val()
            const data = []
            Object.keys(oldData).map(key => {
              data.push({
                ...oldData[key]
              })
            })
            setReview(data)
            dispatch({type: 'SET_LOADING', value: false})
          }
        })
        .catch(err => {
          dispatch({type: 'SET_LOADING', value: false})
          showError(err.message)
        })
      }
  return (
      <View style={styles.page}>
        <View style={styles.coloring}>
          <Gap height={10}/>
          <Header title='Ulasan' type='dark' onPress={()=>navigation.goBack()}/>
          <Gap height={20}/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          {review.map(item =>{
                return (
                <ReviewUser
                  key={item.uid}
                  name={item.fullName}
                  desc={item.review}
                  avatar={item.photo}
                  rate={item.star}
                />
                )
              })}
          </ScrollView>
        </View>
      </View>
  )
}

export default Review_detail

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
})