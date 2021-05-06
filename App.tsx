import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { background, neutral, text } from './styles/colors/theme';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';

import firebase from 'firebase';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
  apiKey: "AIzaSyBXG-glKkZqSh0J9KoBIEG2ulKBPbTx3PI",
  authDomain: "taskr-5e166.firebaseapp.com",
  projectId: "taskr-5e166",
  storageBucket: "taskr-5e166.appspot.com",
  messagingSenderId: "320325177286",
  appId: "1:320325177286:web:1bfc3ce5a0d9a1e0c7ecc7",
  measurementId: "G-FHWH5001ZX"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator()

export function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    })
  })

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#21252F" }}>
        <Text style={{ color: "#AFB4BB" }}>Loading</Text>
      </View>
    )
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ cardStyle: { ...background.theme[800] } }}>
          <Stack.Screen component={Register} name='Register' options={{ headerShown: false }} />
          <Stack.Screen component={Login} name='Login' options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen component={Home} name='Home' options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App