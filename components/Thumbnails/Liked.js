import { View, Text, StyleSheet, Dimensions, FlatList, Image } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS } from '../../model/constants';

const {width, height} = Dimensions.get('window');

const Language = ({thumbnailImages=[]}) => {
  return (
    <View style={style.container}>
      <Text style={style.text}>Liked Songs</Text>
      <ScrollView showsVerticalScrollIndicator={true}>
        {thumbnailImages.map(item => {
          return(
            <View style={style.imageContainer}>
          <Image source={{uri: item.artwork}} resizeMode="cover" style={style.image} />
          <View>
          <Text style={style.imageText}>{item.title}</Text>
          <Text style={style.imageText}>{item.artist}</Text>
          </View>
          </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Language

const style = StyleSheet.create({
container:{
  width: width * 0.9,
  height: height * 0.25,
  marginVertical: height * 0.02,
  borderWidth: 1.5,
  borderColor: COLORS.gray,
  borderRadius: 15
  // backgroundColor: 'green'
},
text:{
  marginLeft: 10, 
  fontSize: 15,
  color: COLORS.secondary,
},
imageContainer: {
  width: width * 0.7,
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 5,
  marginHorizontal: 30
},
image:{
  width: 50,
  aspectRatio: 1,
  borderRadius: 15,
},
imageText:{
  paddingHorizontal: 20,
  color: COLORS.white,
},
})