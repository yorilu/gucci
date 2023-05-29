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
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 

const TODAY = moment().format("YYYY_MM_DD");
const redGif = require('../../assets/images/red.gif');
const tagSelectedImg = require('../../assets/images/tag-selected.png');

const WINDOW = Dimensions.get("window");
const { getUrlWithHost , goWebView} = Utils;

const FIRST_BANNER_SIZE = {
  width: 750,
  height: 476
}

const {assetsHost, biyingApi, BYN_APP_KEY, BYN_APP_SECRET, customerId, BYN_MIDDLE_PAGE, OSS_PATH, REDBAG_URL} = getEnv();
const getFile = (key)=>{
  return assetsHost + key;
}
let token;
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [firstBannerData, setFirstBannerData] = useState([]);
  const [secondBannerData, setSecondBannerData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [hotGoods, setHotGoods] = useState([]);
  const [showRedBag, setShowRedBag] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagSelectedIndex, setTagSelectedIndex] = useState(0);

  const [indexData, setIndexdata] = useState({
    firstBannerData: [],
    secondBannerData: [],
    diamonds: [],
    goods: [],
    tags: []
  })

  React.useEffect(() => {

    const fn = async()=>{
      const categoryId =indexData.tags[tagSelectedIndex]? indexData.tags?.[tagSelectedIndex].id : null;
      if(!categoryId) return;

      const diamonds = await getDiamondsData(categoryId);
      setIndexdata({
        ...indexData,
        diamonds
      })
    }

    fn();
    
  }, [tagSelectedIndex]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("======focus======")
      init();
    });

    return unsubscribe;
  }, [navigation]);

  const getDiamondsData = async (category)=>{
    let diamonds = await queryData({category, position: 1, modelName:'diamond'});

    let formatData = [];
    diamonds?.map((item, index)=>{
      const arrIndex = Math.floor((index)/10);
      if(!formatData[arrIndex]){
        formatData[arrIndex] = [];
      }
      formatData[arrIndex].push(item);
    })

    return formatData;
  }

  const init = async ()=>{
    let [firstBannerData = [], secondBannerData = [], tags, goods] = await Promise.all([
      queryData({position: 1, modelName:'banner'}),
      queryData({position: 2, modelName:'banner'}),
      queryData({modelName:'category'}),
      queryData({modelName:'waterfall'})
    ])

    const categoryId = tags?.[0].id;
    
    const diamonds = await getDiamondsData(categoryId);

    setIndexdata({
      firstBannerData,
      secondBannerData,
      diamonds,
      tags,
      goods
    })

    try{
      const info = await $fetch(OSS_PATH + '/oss-config.json', null, {
        method: "GET"
      }) || {};

      const value = await AsyncStorage.getItem(TODAY);

      if(info.showRedBag && !value){
        setShowRedBag(true);
        AsyncStorage.setItem(TODAY, "1");
      }
    }catch(e){
      console.log(e);
    }

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

  async function queryData({modelName = '', ...rest} = {}){
    try{
      const {code, result = []} = await getModels(modelName).send({
        ...rest
      },{
        method: "GET"
      })

      if(code == 0){
        return result;
      }

      return [];
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

  const onRedBagClicked = ()=>{
    setShowRedBag(false);
    myGoWebView({
      uri: REDBAG_URL
    })
  }


  const onRedBagClose = ()=>{
    setShowRedBag(false);
  }

  const onTagClicked = (index)=>{
    setTagSelectedIndex(index);
  }

  const firstBannerCarouselHeight =  WINDOW.width / FIRST_BANNER_SIZE.width * FIRST_BANNER_SIZE.height;

  return (
    <ScrollView>
      <View style={styles.container}>

        {/* Banner */}
        { indexData.firstBannerData && !!indexData.firstBannerData.length && <Carousel 
          style={{...styles.bannerCarousel, height: firstBannerCarouselHeight}} 
          autoplay
          infinite
          dots={false}
          autoplayInterval = { 5000 }
        >
          {
            indexData.firstBannerData.map((item, index)=>{
              const uri = getFile(item.img);
              return (
                <TouchableWithoutFeedback 
                  key={index}
                  onPress={()=>{
                    myGoWebView({
                      uri: item.url
                    })
                  }}
                >
                  <Image
                    key={index}
                    style={styles.bannerImage}
                    source={{uri}}
                  />
                </TouchableWithoutFeedback>
              )
            })
          }
        </Carousel>}

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
            <View style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>搜商品</Text>
            </View>
          </View>

          {/* tags */}
          {indexData.tags && !!indexData.tags.length && <View style={styles.tags}>
              {indexData.tags.map((item, index)=>{
                return (
                  <TouchableWithoutFeedback key={index} onPress={()=>{onTagClicked(index)}}>
                    <View key={index} style={{...styles.tagWrap}} >
                      <Text style={{...styles.tagText, ...(tagSelectedIndex == index?styles.tagTextSelected:{})}}>{item.name}</Text>
                      {
                        tagSelectedIndex == index && <Image
                          style={styles.tagSelectedImg}
                          source={tagSelectedImg}
                          resizeMode = "contain"
                        />
                      }
                    </View>
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
          }
          {/* 导航-金刚位 */}
          {indexData.diamonds && !!indexData.diamonds.length && <Carousel 
            dots={false}
            style={{...styles.operationCarousel, height: Math.ceil(indexData.diamonds.length / 2)*190}} 
          >
            {
            indexData.diamonds.map((items, index)=>{
                return (
                  <View key={index} style={styles.operationWrap}>
                    {
                      items.map((item, itemIndex)=>{
                        const uri = getFile(item.img);
                        return (
                          <TouchableWithoutFeedback 
                            key={itemIndex}
                            onPress={()=>{
                              myGoWebView({
                                uri: item.url
                              })
                            }}
                          >
                            <View style={styles.operationItem}>
                              <Image
                                style={styles.operationImage}
                                source={{uri}}
                              />
                              <Text style={styles.operationTitle}>{item.title}</Text>
                              <Text style={styles.operationSubTitle}>{item.subtitle}</Text>
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

          {/* 第二个banner */}
          { indexData.secondBannerData && !!indexData.secondBannerData.length && <Carousel 
            style={styles.secondBannerCarousel} 
            autoplay
            infinite
            dots={false}
            autoplayInterval = { 5000 }
          >
            {
              indexData.secondBannerData.map((item, index)=>{
                const uri = getFile(item.img);
                return (
                  <TouchableWithoutFeedback 
                    key={index}
                    onPress={()=>{
                      myGoWebView({
                        uri: item.url
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

        {/* 商品 */}
        <View style={styles.hotGoods}>
          {
            indexData.goods.map((item, index)=>{
              const uri = getFile(item.img);
              let {marketPrice, sellPrice} = item;
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
                      resizeMode="contain"
                    />
                    <Text style={styles.hotItemName}>{item.name}</Text>
                    <View style={styles.hotItemBtn}>
                      <Text style={styles.hotItemText}>去下单</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </View>

      {
        showRedBag && <View style={styles.redModal}>
          <TouchableWithoutFeedback onPress={onRedBagClose}>
            <FontAwesome style={styles.redGifClose} name="close" size={24} color="black" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onRedBagClicked}>
            <Image
              resizeMode={'cover'}
              style={styles.redGif}
              source={redGif}
            />
          </TouchableWithoutFeedback>

        </View>
      }
    </ScrollView>
  );
}
