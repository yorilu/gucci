import { Image , ScrollView, Linking, TouchableWithoutFeedback, Dimensions} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles'

import { Text, View} from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import getModels from '../../models/index'
import Icons from '../../constants/Icons';
import getEnv from '../../constants/ENV';
import { Button, Carousel } from '@ant-design/react-native';
import Utils from '../../utils/index';
import { useFocusEffect } from '@react-navigation/native';
import $fetch from '../../utils/fetch';
import md5 from 'js-md5';

const WINDOW = Dimensions.get("window");
const { getUrlWithHost , goWebView} = Utils;

const BANNER_SIZE = {
  width: 686,
  height: 270
}

const {assetsHost, biyingApi, BYN_APP_KEY, BYN_APP_SECRET, customerId, BYN_MIDDLE_PAGE} = getEnv();
const getFile = (key)=>{
  return assetsHost + key;
}
let token;
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [firstBannerData, setFirstBannerData] = useState([]);
  const [secondBannerData, setSecondBannerData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [hotGoods, setHotGoods] = useState([]);



  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("======focus======")
      init();
    });

    return unsubscribe;
  }, [navigation]);

  const init = async ()=>{
    const [data1, data2, data3 ,data4] = await Promise.all([
      querySceneConfig({position: "BANNER"}),
      queryLocation({position: "OPERATION_LOCATION"}),
      querySceneConfig({position: "OPERATION_LOCATION"}),
      queryHotGoods()
    ])

    setFirstBannerData(data1.records || []);

    let formatData = [];

    //整除8，分成多个数组。
    data2?.records.map((item, index)=>{
        const arrIndex = Math.floor((index)/10);
        if(!formatData[arrIndex]){
          formatData[arrIndex] = [];
        }
        formatData[arrIndex].push(item);
    })

    setOperationData(formatData || []);
    setSecondBannerData(data3.records || []);
    setHotGoods(data4.records || []);
  }

  const onSearchClicked = ({} = {})=>{
    const uri = getUrlWithHost("mall/pages/search/index");
    myGoWebView({
      uri
    })
  }

  const myGoWebView = (params)=>{
    const { uri } = params;
    if(!uri.startsWith("http") || uri.indexOf("alipay")>-1 || uri.indexOf("weixin")>-1){
      Linking.openURL(uri);
      return false;
    }

    goWebView({
      navigation,
      ...params
    })
  }

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


  const bannerCarouselHeight =  WINDOW.width / BANNER_SIZE.width * BANNER_SIZE.height;

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
            <TouchableWithoutFeedback onPress={onSearchClicked}>
              <Text style={styles.searchText}>输入关键词进行搜索</Text>
            </TouchableWithoutFeedback>
          </View>

          {/* Banner */}
          { firstBannerData && !!firstBannerData.length && <Carousel 
            style={{...styles.bannerCarousel, height: bannerCarouselHeight}} 
            autoplay
            infinite
            dots={false}
            autoplayInterval = { 5000 }
          >
            {
              firstBannerData.map((item, index)=>{
                const uri = getFile(item.images);
                return (
                  <TouchableWithoutFeedback 
                    key={index}
                    onPress={()=>{
                      myGoWebView({
                        uri: item.skipUrl
                      })
                    }}
                  >
                    <Image
                      style={styles.bannerImage}
                      source={{uri}}
                    />
                  </TouchableWithoutFeedback>
                )
              })
            }
          </Carousel>
          }

          {/* 导航-金刚位 */}
          {operationData && !!operationData.length && <Carousel 
            dots={false}
            style={{...styles.operationCarousel, height: Math.ceil(operationData.length / 5)*140}} 
          >
            {
            operationData.map((items, index)=>{
                return (
                  <View key={index} style={styles.operationWrap}>
                    {
                      items.map((item, itemIndex)=>{
                        const uri = getFile(item.images);
                        return (
                          <TouchableWithoutFeedback 
                            key={itemIndex}
                            onPress={()=>{
                              myGoWebView({
                                uri: item.skipUrl
                              })
                            }}
                          >
                            <View style={styles.operationItem}>
                              <Image
                                style={styles.operationImage}
                                source={{uri}}
                              />
                              <Text>{item.name}</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        )
                      })
                    }
                  </View>
                )
              })
            }
          </Carousel>
          }

          {/* Banner */}
          { secondBannerData && !!secondBannerData.length && <Carousel 
            style={styles.secondBannerCarousel} 
            autoplay
            infinite
            dots={false}
            autoplayInterval = { 5000 }
          >
            {
              secondBannerData.map((item, index)=>{
                const uri = getFile(item.images);
                return (
                  <TouchableWithoutFeedback 
                    key={index}
                    onPress={()=>{
                      myGoWebView({
                        uri: item.skipUrl
                      })
                    }}
                  >
                    <Image
                      style={styles.secondBannerImage}
                      source={{uri}}
                    />
                  </TouchableWithoutFeedback>
                )
              })
            }
          </Carousel>
          }
        </View>

        <View style={styles.blockTitle}>
          <Text style={styles.blockTitleText}>今日特卖</Text>
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
                <TouchableWithoutFeedback 
                  key={index}
                  onPress={()=>{
                    const uri = getUrlWithHost(`mall/pages/detail/index?id=${item.id}`)
                    myGoWebView({
                      uri
                    })
                  }}
                >
                  <View style={styles.hotItem}>
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
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>

      </View>
    </ScrollView>
  );
}
