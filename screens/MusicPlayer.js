import React, {useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Animated, BackHandler, Share, ImageBackground, StatusBar, } from 'react-native';

import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, IMAGES } from '../model/constants';

const {width, height} = Dimensions.get('window');

const MusicPlayer = ({ route, navigation }) => {
  const { songsList } = route.params;

  // useEffect(() => {
  //   const backAction = () => {
        // navigation.goBack()
  //     getSongs();
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const setUpPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: true ,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.add(songs);
    } catch (e) {
      console.log('Track Player Error',e);
    }
  };
  
  const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      if (playBackState == State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };
   
  const [songs, setSongs] = useState(songsList)
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const host = "https://gideon-music-backend.herokuapp.com"

  const [songIndex, setSongIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtWork, setTrackArtWork] = useState();
  
  const [repeatMode, setRepeatMode] = useState('repeat');
  const [liked, setLiked] = useState(false)

  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  const handleSongEnd = async (played) => {
    await fetch(`${host}/api/songs/updatesong/${songs[songIndex]._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ played })
    });
    console.log("Played +1")
  }

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtWork(artwork);
      setTrackArtist(artist);
      if (progress.position !== 0){
        handleSongEnd(songs[songIndex].played + 1);
    }
    }
  });

  // useTrackPlayerEvents([], async event => {
  // });
  
  const editSong = async (_id, like) => {
    await fetch(`${host}/api/songs/updatesong/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like })
    });
  };

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeadMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const likeStatus = () => {
    try {
      if (songs[songIndex].like === 11) {
        return true
      }
      if (songs[songIndex].like === 10) {
        return false
      }
    } catch (error) {
      return false
    }
  };

  const changeLike = (value) => {
    let newSongs = songs.map(e => (
      e.newId === songIndex ? {...e, like: value} : e
    ))
    setSongs(newSongs)
    setLiked(true)
    // console.log(liked)
  }

  const changeHeartMode = () => {
    if (songs[songIndex].like === 10) {
      changeLike(11)
      editSong(songs[songIndex]._id, 11)
    }
    if (songs[songIndex].like === 11) {
      changeLike(10)
      editSong(songs[songIndex]._id, 10)
    }
  };

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    setUpPlayer();
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
    });
    
    return () => {
      scrollX.removeAllListeners();
      // TrackPlayer.destroy()
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };
  
  const scrollSong = (id) => {
    // songSlider.current.scrollToOffset({
    //   offset: (id) * width,
    // });
    skipTo(id)
    setSongIndex(id);
    navigation.goBack()
  }

  const handleBackButton = () => {
    if(liked === true){
      // getSongs()
    }
    navigation.goBack()
  }

  const shareLink = async () => {
    try {
      const result = await Share.share({
        message: songs[songIndex].link
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }


  const renderSongs = () => {
    return (
      <Animated.View style={style.mainImageWrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image source={{uri: trackArtWork}} resizeMode='contain' style={style.musicImage} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <StatusBar animated={true} backgroundColor="transparent" translucent={true}/>
    <ImageBackground source={IMAGES.background} resizeMode="cover" style={style.bgImage}>
      <View style={style.mainContainer}>
        <View style={style.topContainer}>
          <View style={style.topIconWrapper}>
          <TouchableOpacity  activeOpacity={0.5}  onPress={handleBackButton}>
            <Ionicons name='chevron-back-circle-sharp' size={40} color={COLORS.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={() => {}}>
            <Ionicons name="ellipsis-vertical-outline" size={30} color={COLORS.gray} />
          </TouchableOpacity>
          </View> 
        </View>

        {/* image */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item => item.title}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={20}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        {/* Song content */}
        <View>
          <Text style={[style.songTitle, style.songContent]}>
            {trackTitle}</Text>
          <Text style={[style.songArtist, style.songContent]}>
            {trackArtist}</Text>
        </View>

        {/* slider */}
        <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor={COLORS.secondary}
            minimumTrackTintColor={COLORS.secondary}
            maximumTrackTintColor={COLORS.white}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
        </View>

        {/* music progress duration */}
        <View style={style.progressLevelDuration}>
          <Text style={style.progressLabelText}>
            {new Date(progress.position * 1000)
              .getMinutes() - 30}:{ new Date(progress.position * 1000)
              .getSeconds()}
          </Text>
          <Text style={style.progressLabelText}>
            {new Date((progress.duration - progress.position) * 1000)
              .getMinutes() - 30}:{ new Date((progress.duration - progress.position) * 1000)
                .getSeconds()}
          </Text>
        </View>

        {/* music controls */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity  activeOpacity={0.5}  onPress={skipToPrevious}>
            <Ionicons name="play-back" size={30} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={ playBackState === State.Playing ? `ios-pause-circle` : `ios-play-circle` }
              size={70}
              color={COLORS.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={skipToNext}>
            <Ionicons
              name="play-forward"
              size={30}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.bottomContainer}>
        <View style={style.bottomIconWrapper}>
          <TouchableOpacity  activeOpacity={0.5}  onPress={changeHeartMode}>
            <Ionicons 
            name={likeStatus() === true ? 'heart' : 'heart-outline'}
            size={25} 
            color={likeStatus() === true ? COLORS.secondary : COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={changeRepeadMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={25}
              color={repeatMode !== 'off' ? COLORS.secondary : COLORS.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={shareLink}>
            <Ionicons name="share-outline" size={25} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity  activeOpacity={0.5}  onPress={() => {
              navigation.navigate('Queue', {
                songs: songs,
                index: songIndex,
                setSong: scrollSong,
              });
            }}>
            <Ionicons name="filter" size={25} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.primary,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center"
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.05
  },
  topContainer: {
    width: width,
    alignItems: 'center',
    paddingTop: height * 0.02,
    // borderTopColor: COLORS.gray,
    // borderWidth: 1,
  },
  topIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.95,
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    // borderTopColor: COLORS.gray,
    // borderWidth: 1,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
  },
  mainImageWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: width * 0.9,
    // height: width,
    marginTop: - height * 0.02,
    marginBottom: height * 0.01,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  elevation: {
    elevation: 5,
    shadowColor: COLORS.white,
    shadowOffset: {width: 5, height: 5},
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: COLORS.white,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },
  progressBar: {
    width: width * 0.9,
    height: 40,
    marginTop: height * 0.02,
    flexDirection: 'row',
  },
  progressLevelDuration: {
    width: width * 0.88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: - height * 0.01,

  },
  progressLabelText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  musicControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 0,
    marginBottom: height * 0.03,
  },
});
