import { View, Text, SafeAreaView, FlatList, StyleSheet, Dimensions, LogBox, TouchableOpacity, ImageBackground, StatusBar } from 'react-native'
import React from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons';

import QueueSongs from '../components/QueueSongs';
import {COLORS, IMAGES} from '../model/constants';

const { width, height } = Dimensions.get('window');

const Queue = ({ route, navigation }) => {
  LogBox.ignoreAllLogs()

  const handleBackButton = () => {
    navigation.goBack()
  }
  
  const { songs, index, setSong } = route.params;
  
  return (
      <ImageBackground source={IMAGES.background} resizeMode="cover" style={style.bgImage}>
    <SafeAreaView style={style.main} >
      <StatusBar animated={true} backgroundColor="transparent" translucent={true}/>
      <View style={{zIndex:0}}>
        <FlatList 
          data={songs}
          renderItem={({item}) => <QueueSongs songs={item} index={index} setSong={setSong}/>}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={style.header}>
            <TouchableOpacity  activeOpacity={0.5}  onPress={handleBackButton} style={style.topIconContainer}>
              <Ionicons name='chevron-back-circle-sharp' size={40} color={COLORS.gray}/>
            </TouchableOpacity>
            <Text style={style.headerText}>Queue</Text>
          </View>
        }
        // ListFooterComponent={<Text>Footer</Text>}
        />
      </View>
    </SafeAreaView>
    </ImageBackground>
  )
}

export default Queue

const style = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.primary,
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center"
  },
  header: {
    flexDirection: 'row',
    paddingVertical: width * 0.05,
    justifyContent: 'center'
  },
  topIconContainer: {
    width: width * 0.1,
    position: 'absolute',
    top: width * 0.04,
    left: 0,
  },
  headerText: {
    color: COLORS.secondary,
    fontSize: 35,
    // textAlign: 'center',
    // marginVertical : width * 0.05 
  }
})