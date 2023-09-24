import { View, Text, StyleSheet, Dimensions, FlatList, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../../model/constants';

const {width, height} = Dimensions.get('window');

const Artist = ({name=null}) => {
  return (
    <View style={style.container}>
      {name === null ?
      <Text style={style.text}>Artist</Text>
      :
      <Text style={style.text}>{name}</Text>
      }
    </View>
  )
}

export default Artist

const style = StyleSheet.create({
container:{
  alignItems: 'center',
  width: width * 0.9,
  marginVertical: height * 0.02,
  // height: height * 0.5,
  borderWidth: 1.5,
  borderColor: COLORS.gray,
  borderRadius: 15
  // backgroundColor: 'green'
},
text:{
  marginVertical: height * 0.02,
  fontSize: 15,
  color: COLORS.secondary,
},
})