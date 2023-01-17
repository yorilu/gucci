import { StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View} from '../components/Themed';
import { RootTabScreenProps } from '../types';
import getModels from '../models/index'
import { searchIcon } from '../constants/Icons';

console.log("searchIcon",searchIcon)

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  useEffect(()=>{
    async function getData(){
      try{
        const data = await getModels("querySceneConfig").send({
          scene:"MALL",
          pageSize:100,
          position:"BANNER"
        })
      }catch(e){
        console.log(e)
      }
    }
    getData(); 
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Image
          style={styles.searchIcon}
          source={{
            uri: searchIcon
          }}
        />
      </View>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}