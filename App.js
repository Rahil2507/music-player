import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import React from 'react';
import { LogBox } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import MusicPlayer from "./screens/MusicPlayer";
import Queue from './screens/Queue'

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent"
  }
}

const App = () => {
  // LogBox.ignoreAllLogs()
  return (
    <NavigationContainer theme={theme}>
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Player" component={MusicPlayer}/>
      <Stack.Screen name="Queue" component={Queue}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;

