import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Image } from 'react-native'
import {COLORS} from '../../model/constants';


const {width, height} = Dimensions.get('window');

const MostPlayed = ({thumbnailImages=[]}) => {
  return (
    <View style={style.container}>
      <Text style={style.text}>Most Played Songs</Text>
      <FlatList 
          horizontal
          data={thumbnailImages}
          renderItem={({item}) => <>
          <View style={style.imageContainer}>
          <Image source={{uri: item.artwork}} resizeMode="cover" style={style.image} />
          </View>
          </>}
          keyExtractor={(item) => item.title }
          showsHorizontalScrollIndicator={false}
          />
    </View>
  )
}

export default MostPlayed

const style = StyleSheet.create({
container:{
  width: width * 0.9,
  marginVertical: height * 0.01,
  borderWidth: 1.5,
  borderColor: COLORS.gray,
  borderRadius: 15
},
text:{
  marginLeft: 10, 
  fontSize: 15,
  color: COLORS.secondary,
},
imageContainer: {
  margin: 8,
},
image:{
  marginLeft: 0,
  width: 53,
  aspectRatio: 1,
  borderRadius: 15,
},
})