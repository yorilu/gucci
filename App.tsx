import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Authorize from './components/Authorize'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from './components/Themed';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import Utils from './utils'
import CONSTS from './constants'
import {setToken, setUserInfo} from './actions'

const store = createStore(rootReducer)

export default function App() {
  const isLoadingComplete = useCachedResources();

  const onAgree = async()=>{
    const authorize = await AsyncStorage.setItem('Authorize', "1");
    setShow(true);
  }

  const [show, setShow] = useState(false);
  useEffect(()=>{

    const init = async ()=>{
      const authorize = await AsyncStorage.getItem('Authorize');
      console.log("当前authorize状态:", authorize)
      if(authorize == 1){
        setShow(true)
      }

      const userInfo = await Utils.getStorage(CONSTS.USER_INFO);
      store.dispatch(setUserInfo({
        userInfo
      }))
    }

    init();
  
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          { !show && <Authorize onAgree={onAgree}></Authorize>}
          { show && <>
              <Navigation/>
              <StatusBar />
            </>
          }
        </SafeAreaProvider>
      </Provider>
    );
  }
}
