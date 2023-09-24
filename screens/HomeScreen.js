import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, LogBox, ImageBackground, StatusBar, Image } from 'react-native';
import {useNavigation} from '@react-navigation/native';

// import songs from '../model/data';

// import songs from '../model/datas';

import {COLORS, IMAGES} from '../model/constants';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Language from '../components/Thumbnails/Language';
import Artist from '../components/Thumbnails/Artist';
import Liked from '../components/Thumbnails/Liked';
import Suggestion from '../components/Thumbnails/Suggestion';
import MostPlayed from '../components/Thumbnails/MostPlayed';
import AnimatedLottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

const artist = (songs) => {
  songs.sort((a, b) => {
    let fa = a.artist.toLowerCase(),
      fb = b.artist.toLowerCase();
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < songs.length; i++) {
    songs[i].newId = i
  }

  return songs
};

const title = (songs) => {
  songs.sort((a, b) => {
    let fa = a.title.toLowerCase(),
      fb = b.title.toLowerCase();
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < songs.length; i++) {
    songs[i].newId = i
  }
  return songs
};

const english = (songs) => {
  let englishSongs = []
  songs.map(e => (
    e.language === 'english' && englishSongs.push(e)
  ))
  return title(englishSongs)
}

const hindi = (songs) => {
  let hindiSongs = []
  songs.map(e => (
    e.language === 'hindi' && hindiSongs.push(e)
  ))
  return title(hindiSongs)
}

const liked = (songs) => {
  let likedSongs = []
  songs.map(e => (
    e.like === 11 && likedSongs.push(e)
  ))
  return title(likedSongs)
  
}

const suggestion = (songs) => {
  songs.sort(() => .5 - Math.random()).slice(0,5)
  return title(songs)
}

const mostPlayed = (songs) => {
  songs.sort((a, b) => {
    return a.played - b.played;
  });
  songs = songs.slice(0,5)
  return title(songs)
}

const HomeScreen = () => {
  const host = "https://gideon-music-backend.herokuapp.com"
  const [songs, setSongs] = useState([])
  const [thumbnailSongs, setThumbnailSongs] = useState(null)
  const [fetched, setFetched] = useState(false)
  
  // Get all Songs
  const getSongs = async () => {
      try {
        const response = await fetch(`${host}/api/songs/fetchallsongs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
      });
      const json = await response.json()
      setSongs(json)
      setThumbnailSongs({
        allSongs: title(songs),
        english: english(songs),
        hindi: hindi(songs),
        artist: artist(songs),
        liked: liked(songs),
        suggestion: suggestion(songs),
        mostPlayed: mostPlayed(songs),
      })
      setFetched(true)
      console.log('Song Received')
    } catch (error) {
      console.log("GetAllSong Error:",error)
    }
  };
  
  
  useEffect(() => {
    getSongs();
  },[]);
  
  const handleRefresh = () => {
    setFetched(false)
    getSongs()
  }

  const navigation = useNavigation();
  
  LogBox.ignoreAllLogs()


  return (
    <SafeAreaView style={style.main}>
      <StatusBar animated={true} backgroundColor="transparent" translucent={true}/>
      <ImageBackground source={IMAGES.background} resizeMode="cover" style={style.bgImage}>
        <ScrollView style={style.scrollView}>
          <View style={style.mainContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => handleRefresh()} style={style.topIcon}>
        <Image source={IMAGES.logo} resizeMode="contain" style={fetched === false ? style.logo : [style.logo, style.logoFetched]} />
      </TouchableOpacity>
      <View style={style.page}>
        <View style={style.buttonsWrapper}>
          {fetched === true ?
          <View>
            <TouchableOpacity onPress={() => { navigation.navigate('Player', { songsList: english(songs)}); }}>
            <Language category={'English'} thumbnailImages={thumbnailSongs.english}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Player', { songsList: hindi(songs) }); }}>
            <Language category={'Hindi'} thumbnailImages={thumbnailSongs.hindi}/>
            </TouchableOpacity>
            <TouchableOpacity style={style.artist} onPress={() => { navigation.navigate('Player', { songsList: artist(songs) }); }}>
            <Artist/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Player', { songsList: liked(songs) }); }}>
            <Liked thumbnailImages={thumbnailSongs.liked}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Player', { songsList: suggestion(songs) }); }}>
            <Suggestion thumbnailImages={thumbnailSongs.suggestion}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Player', { songsList: mostPlayed(songs) }); }}>
            <MostPlayed thumbnailImages={thumbnailSongs.mostPlayed}/>
            </TouchableOpacity>
            <TouchableOpacity style={style.artist} onPress={() => { navigation.navigate('Player', { songsList: title(songs) }); }}>
            <Artist name={"Play All"}/>
            </TouchableOpacity>
          </View>
          :<>
          <AnimatedLottieView
        source={require("../assets/image/95494-double-loader.json")}
        style={style.loader}
        autoPlay
      />
          </>
          }
          {/* <Button title="All Songs" onPress={() => { navigation.navigate('Player', { songsList: title(songs) }); }} />
          <Button title="English" onPress={() => { navigation.navigate('Player', { songsList: english(songs) }); }} />
          <Button title="Hindi" onPress={() => { navigation.navigate('Player', { songsList: hindi(songs) }); }} />
          <Button title="Play via Artist" onPress={() => { navigation.navigate('Player', { songsList: artist(songs) }); }} />
          <Button title="Play via Liked" onPress={() => { navigation.navigate('Player', { songsList: liked(songs) }); }} />
          <Button title="Play via Suggestion" onPress={() => { navigation.navigate('Player', { songsList: suggestion(songs) }); }} />
          <Button title="Play via Most Played" onPress={() => { navigation.navigate('Player', { songsList: mostPlayed(songs) }); }} /> */}
        </View>
      </View>
          </View>
        </ScrollView>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  main: {
    flex: 1
  },
  bgImage:{
    flex: 1,
    justifyContent: 'center'
  },
  scrollView:{
    marginTop : height * 0.05,
    marginHorizontal: width * 0.05
  },
  topIcon: {
    // height: height * 0.1
  },
  logo:{
    marginVertical: height * 0.02,
    height: height * 0.05,
    // width: width * 0.9,
    opacity: 0.5
  },
  logoFetched:{
    opacity: 1,
  },
  page: {
    alignItems: 'center',
  },
  mainContainer: {
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center'
    
  },
  // text: {
    //   color: COLORS.secondary,
    //   fontSize: 30
    // },
    buttonsWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width : width,
    marginBottom: height * 0.05
  },
  logoImage:{
    height: 150,
  // aspectRatio: 1,
  },
  loader:{
    marginTop: 50,
    height:150,
    width:150
  }
});
