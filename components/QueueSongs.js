import {View, Text, Image, SafeAreaView, StyleSheet, Dimensions, LogBox } from 'react-native';
import React from 'react';
import { COLORS } from '../model/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const QueueSongs = ({ songs,index, setSong }) => {
  LogBox.ignoreAllLogs()


  const handlePress = () => {
    setSong(songs.newId)
  }

  return (
    <SafeAreaView >
      <TouchableOpacity  activeOpacity={0.5}  style={style.main}
      // onPress={setSong({setIndex: setIndex, id: songs.newId})}
      onPress = {() => handlePress()}
      >
      <View style={style.imageContainer}>
        <Image
          source={{uri: songs.artwork}}
          resizeMode="cover"
          style={songs.newId === index ? style.imagePlaying : style.image}
          />
      </View>

      <View style={style.texts}>
        <Text style={songs.newId === index ? style.titleTextPlaying : style.titleText}>{songs.title}</Text>
        <Text style={songs.newId === index ? style.artistTextPlaying : style.artistText}>{songs.artist}</Text>
      </View>
        {/* <Text style={style.artistText}>{songs.newId}</Text> */}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QueueSongs;

const style = StyleSheet.create({
  main: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    paddingVertical: 10,
    alignItems: 'center'
  },
  imageContainer: {width:45, height: 45},
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  imagePlaying:{
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderColor: COLORS.secondary,
    borderWidth: 1
  },
  texts: {
    paddingHorizontal: 20
  },
  titleText: {
    color: COLORS.white,
    fontSize: 20
  },
  titleTextPlaying:{
    color: COLORS.secondary,
    fontSize: 22
  },
  artistText: {
    color: COLORS.white,
    fontSize: 15
  },
  artistTextPlaying:{
    color: COLORS.secondary,
    fontSize: 17
  }
});
