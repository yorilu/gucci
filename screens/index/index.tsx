import { Image , ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel } from '@ant-design/react-native';

const {assetsHost} = getEnv();
const getFile = (key)=>{
  const url = assetsHost + key;
  return url
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [firstBannerData, setFirstBannerData] = useState([]);
  const [secondBannerData, setSecondBannerData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [hotGoods, setHotGoods] = useState([]);

  async function querySceneConfig({position = ''} = {}){
    try{
      const data = await getModels("querySceneConfig").send({
        scene:"MALL",
        pageSize:100,
        position
      })
      return data;
    }catch(e){
      console.log(e)
    }
  }

  async function queryLocation({position = ''} = {}){
    try{
      const data = await getModels("queryLocation").send({
        scene:"MALL",
        pageSize:100,
        position: "DIAMOND_LOCATION"
      })
      return data;
    }catch(e){
      console.log(e)
    }
  }

  async function queryHotGoods({} = {}){
    try{
      const data = await getModels("queryHotGoods").send({
        scene:"MALL",
        pageSize: 20,
        currentPage: 1,
        position: "RECOMMEND_GOODS"
      })
      return data;
    }catch(e){
      console.log(e)
    }
  }


  useEffect(()=>{
    async function init(){
      const data1 = await querySceneConfig({position: "BANNER"});
      const data2 = await queryLocation({position: "OPERATION_LOCATION"});
      const data3 = await querySceneConfig({position: "OPERATION_LOCATION"});
      const data4 = await queryHotGoods();

      setFirstBannerData(data1.records);
      setOperationData(data2.records);
      setSecondBannerData(data3.records);
      setHotGoods(data4.records);
    }

    init(); 
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerWrap}>
          {/* 搜索框 */}
          <View style={styles.searchWrap}>
            <Image
              style={styles.searchIcon}
              source={{
                uri: Icons.searchIcon
              }}
            />
            <Text style={styles.searchText}>输入关键词进行搜索</Text>
          </View>

          {/* Banner */}
          <Carousel 
            style={styles.bannerCarousel} 
            autoplay
            infinite
            autoplayInterval = { 5000 }
          >
            {
              firstBannerData.map((item, index)=>{
                const uri = getFile(item.images);
                return (
                  <Image
                    key={index}
                    style={styles.bannerImage}
                    source={{uri}}
                  />
                )
              })
            }
          </Carousel>

          {/* 导航 */}
          <View style={styles.operationWrap}>
            {
              operationData.map((item, index)=>{
                const uri = getFile(item.images);
                return (
                  <View key={index} style={styles.operationItem}>
                    <Image
                      style={styles.operationImage}
                      source={{uri}}
                    />
                    <Text>{item.name}</Text>
                  </View>
                )
              })
            }
          </View>

          {/* Banner */}
          <Carousel 
            style={styles.secondBannerCarousel} 
            autoplay
            infinite
            autoplayInterval = { 5000 }
          >
            {
              secondBannerData.map((item, index)=>{
                const uri = getFile(item.images);
                return (
                  <Image
                    key={index}
                    style={styles.secondBannerImage}
                    source={{uri}}
                  />
                )
              })
            }
          </Carousel>
        </View>

        <View style={styles.blockTitle}>
          <Text style={styles.blockTitleText}>猜你喜欢</Text>
        </View>

        <View style={styles.hotGoods}>
          {
            hotGoods.map((item, index)=>{
              const uri = getFile(item.goodsImageUrls?.[0] || '');
              const sku = item.skuList[0];
              let {marketPrice, sellPrice} = sku;
              marketPrice = marketPrice / 100;
              sellPrice = sellPrice / 100;
              return (
                <View key={index} style={styles.hotItem}>
                  <Image
                    style={styles.hotItemImg}
                    source={{uri}}
                  />
                  <View style={styles.hotItemWrap}>
                    <Text style={styles.hotItemName}>{item.goodsName}</Text>
                    <View style={styles.hotItemMoneyWrap}>
                      <Text style={styles.hotItemUnit}>￥</Text>
                      <Text style={styles.hotItemMoney}>{sellPrice}</Text>
                      <Text style={styles.hotItemMarketMoney}>￥{marketPrice}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>

      </View>
    </ScrollView>
  );
}
