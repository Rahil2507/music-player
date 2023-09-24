/**
 * @format
 */

 import {AppRegistry, LogBox} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import TrackPlayer from 'react-native-track-player';
 
 LogBox.ignoreAllLogs()
 AppRegistry.registerComponent(appName, () => App);
 
 TrackPlayer.registerPlaybackService(() => require('./service'));
 