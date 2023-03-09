import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Authorize from './components/Authorize'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from './components/Themed';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();


  const onAgree = async()=>{
    const authorize = await AsyncStorage.setItem('Authorize', "1");
    setShow(true);
  }

  const [show, setShow] = useState(false);
  useEffect(()=>{
    const init = async ()=>{
      const authorize = await AsyncStorage.getItem('Authorize');
      if(authorize == 1){
        setShow(true)
      }
    }

    init();
  
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
      { !show && <Authorize onAgree={onAgree}></Authorize>}
      { show && <>
          <Navigation/>
          <StatusBar />
        </>
      }
      </SafeAreaProvider>
    );
  }
}
