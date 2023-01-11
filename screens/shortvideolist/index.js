/*
 * @Author: Karson
 * @Date: 2021-08-03 17:08:29
 * @LastEditTime: 2021-08-16 18:47:37
 * @LastEditors: Please set LastEditors
 * @Description:  短视频列表页面
 * @FilePath: /rn-medical-home/src/pages/shortvideolist/index.js
 */
import React, { createRef } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  NativeModules,
  ActivityIndicator,
  Modal,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
} from "react-native";
import Text from '../../component/Text'
import { getUser, getTabHeight, userLogoutEmitter, userReadyEmitter } from '../../bridge/IMUserBridge'
import { httpPost } from '../../bridge/CommonRequestBridge'
import { videpPlayer_list, videoPlayLikeCountChange } from '../../bridge/VideoBridge'
import { LoadStatusType } from "../../tools/utils";
import LiveBroadcast from '../../component/main/LiveBroadcast/LiveBroadcast';
import SpecialDiseaseCenter from '../../component/main/SpecialDiseaseCenter'
import VideoModule from "../../component/main/VideoModule";
import { IsAndroid, screenHeight, screenWidth } from "../../tools/device";
import { scaleSizeW, setSpText } from "../../tools/themes";
import Toast from '../../component/common/toast/Toast';
import MainCardHeader from '../../component/main/MainCardHeader';
import { RootSiblingParent } from 'react-native-root-siblings';
import { statusBarHeight } from "../../kit/PlotformOS";
import FamilyDoctorCard from "../../component/main/FamilyDoctorCard";
import MainGrid from "../../component/main/Grid";

import Banner from '../../component/main/Banner';
import { mainGetElementsRequest } from "../main/logic/MainHTTPServer";
import { MAIN_REFRESH_NOTIFICATION_NAME } from "../main/logic/MainConstants";
import {versionCompare } from '../main/logic/MainUtils'
import { jumpToView, VIEW_TYPE } from "../../bridge/RouterBridge";
import { SHANTAI_DOMAIN } from '../../config';
import { isAndroid, navigatorHeight, PageRouter, ScreenInfo, TrackManager } from "@rn-js-kit/lib";

const { width } = Dimensions.get("window");
const itemWidth = (width - scaleSizeW(34)) / 2;
const NAVIGATORHEIGHT = scaleSizeW(50) + statusBarHeight();
const VERSION = "1.2.2";
const { RouterModule } = NativeModules;

export default class ShortVideoList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allVideoMap: [],//所有的动画map
      videodata: [],
      // 测试标题的高
      allTitleHeight: {},
      titlesToCheckHeight: [],
      arrHeightOfTitles: [],
      shareUrl: '',//图片base64码,
      tiYingHuaShareTimes: 0,//太医映画分享次数
      zhuanBingShareTimes: 0,//专病中心分享次数
      safeHeight: 0,//底部安全高度
      baseUrl: '',//域名
      basePublicImgUrl: '',//公有云图片地址
      basePrivateImgUrl: '',//私有云图片地址
      wishCardList: [],//心愿卡
      tabNames: [],
      videoTag: '推荐',
      bannerArr: [],//广告图
      serviceArr: [],//配置化元素,
      animating: true,
      opacity: 0,
      loadStatus: LoadStatusType.ScrollTop, //0:上滑加载更多 1:正在为您加载 2:没有更多数据
      isLoading: false,
      isVisiable: false,
      toastStr: '',
      headerHeight: 0,
      isCeilingSuction: false,//是否吸顶
      isLoadingWishCard:false,
      isShowActivity:false,
    };
    this.funcFlag = false;//防抖标记位
    this.toastRef = createRef();
    this.scrollRef = createRef();

    this.doctorCardRef = createRef();
    this.gridRef = createRef();
    this.broadcrastRef = createRef();
    this._toastPosition = -1000
  }

  //获取首页广告以及配置化元素
  getElements() {
    this.setState({
      animating:false
    })
    // mainGetElementsRequest().then((resData) => {
    //   let result = resData.result;
    //   if (resData.success == true && result != null) {
    //     let bannerArr = result?.BANNER?.elements??[];
    //     let serviceArr = result?.HOMESERVICE?.elements??[];
    //     this.setState({
    //       bannerArr: bannerArr,
    //       serviceArr: serviceArr,
    //       animating:false
    //     });
    //   }else{
    //     this.setState({
    //       animating:false
    //     });
    //   }
    // }).catch((e) => {
    //   console.log('e:', e);
    //   this.setState({
    //     animating:false
    //   });
    // })
  }

  //获取心愿卡数据
  getWishCardInfo = () => {

    // this.setState({
    //   isLoadingWishCard:true
    // })

    // httpPost("api/slow-disease/v1/home-page/wish-card-query", {}, {})
    //   .then(res => {
    //     res = JSON.parse(res)
    //     if (res.result?.wishCardList) {
    //       this.setState({
    //         wishCardList: res.result.wishCardList,
    //       })
    //     }
    //     this.setState({
    //       isLoadingWishCard:false
    //     })
    //   }).catch(e => {
    //     console.log(e)
    //     this.setState({
    //       isLoadingWishCard:false
    //     })
    //   })
  }

  //获取标签
  requestTabs() {
    httpPost('api/video-center/indexTag/query', {}, {}
    ).then((res) => {
      let tagData = JSON.parse(res);
      tagData.result.unshift('推荐')
      if (tagData.result.length > 0) {
        let _allVideoMap = [];
        tagData.result.map((item, index) => {
          let data = {
            tag: item,
            videoList: [],
            viewHeight: 0
          }
          _allVideoMap[index] = data;
        });
        this.setState({
          tabNames: tagData.result,
          allVideoMap: _allVideoMap
        },()=>{
          const { tabNames } = this.state;
            const { tag } = this.props;
            if(tabNames && tabNames.length && tag){
              tabNames.map((item, index)=>{
                if(item === tag){
                  this.moveTagScrollTimer = setTimeout(()=>{
                    this.scrollRef.current.goToScollTabView(index);
                  },1000);
                }
              })
            }
        });
      }
    }).catch({});
  }

  //太映画视频列表
  videoPageQuery(tag) {
    this.setState({
      isLoading: true
    })

    httpPost('api/dataapi/media/recommend', {}, {
      path: "/media/recommend",
      requestParam: {
        classify: tag,
        mediaType: 'VIDEO',
        userId: global.userId
    }
    }).then((res) => {
      let _videodata = JSON.parse(res).result;
      if (!_videodata || _videodata.length === 0) {
        let _loadStatus = LoadStatusType.NoData
        this.setState({
          videodata: _videodata,
          loadStatus: _loadStatus,
          isLoading: false
        })
        this.getVideoHeight(_videodata);
      } else {
        // 检测
        let _titlesToCheckHeight = []
        _videodata.map((item) => {
          _titlesToCheckHeight.push(item.title)
        })
        this.setState({
          videodata: _videodata,
          arrHeightOfTitles: [],
          titlesToCheckHeight: _titlesToCheckHeight,
          isLoading: false
        })
      }
    }).catch(error => {
      this.setState({
        isLoading: false,
      })
    });
  }

  updateVideoList = () => {
    const { videodata } = this.state;
    let videolist = videodata;
    this.getVideoHeight(videolist);

    let loadStatus =  LoadStatusType.ScrollTop

    this.setState({
      arrHeightOfTitles: [],
      titlesToCheckHeight: [],
      isLoading: false,
      loadStatus: loadStatus
    })
    this._showToast(videodata);
  }

  _showToast = (videolist) => {
    if (videolist.length > 0) {
      this.setState({
        isVisiable: true,
        toastStr: '已加载' + videolist.length + '条精彩内容'
      })
      setTimeout(() => {
        this.setState({
          isVisiable: false
        })
      }, 2000);
    }
  }

  //计算整体高度
  getVideoHeight = (videoList) => {
    const { allVideoMap, videoTag, videodata } = this.state;
    let _videoList = [];
    videoList.map((item) => {
      let coverSize = item.coverSize ? item.coverSize : '9:16';
      let size = coverSize.split(':');
      let scale = size[1] / size[0];

      let itemHeight = scale * itemWidth + this._heightOfTitle(item.title) + scaleSizeW(50)
      _videoList.push(Object.assign(item, { scale, itemHeight }))
    })

    let _allVideoMap = allVideoMap;

    // 取出原来的数据来拼接
    allVideoMap.map((item, index) => {
      if (item.tag === videoTag) {
        let tempList = item.videoList.concat(_videoList);
        let leftHeight = 0;
        let rightHeight = 0;
        tempList.map((item) => {
          if (leftHeight <= rightHeight) {
            leftHeight += item.itemHeight + scaleSizeW(10)
          } else {
            rightHeight += item.itemHeight + scaleSizeW(10)
          }
        })
        let viewHeight = this._getMaxViewHeight(Math.max(leftHeight, rightHeight));
        // 存储本次的数据
        let tagVideoMap = {
          tag: item.tag,
          videoList: tempList,
          viewHeight: viewHeight
        }
        _allVideoMap[index] = tagVideoMap
      }
    })
    this.setState({
      allVideoMap: _allVideoMap
    })
  }

  _getMaxViewHeight = (viewHeight) => {
    return Math.max(viewHeight, screenHeight - NAVIGATORHEIGHT - scaleSizeW(50))
  }

  _heightOfTitle = (title) => {
    const { allTitleHeight } = this.state
    return allTitleHeight[title]
  }

  functionHandler = (func, delay = 3000) => {
    if (!this.funcFlag) {
      this.funcFlag = true
      func && func()
      this.timer = setTimeout(() => {
        this.funcFlag = false
        clearTimeout(this.timer);
      }, delay);
    }
  }

  //收到监听或者打开页面、下拉刷新时重新请求数据
  refreshDataWithNet() {
    const { videoTag } = this.state
    NativeModules.RNCloudFileModule.getPublicFileURL('').then((baseUri) => {
      this.setState({
        baseUrl: baseUri
      });
    });
    this.requestTabs();
    this.videoPageQuery(videoTag)
    this.getElements();
  }

  // 收到监听刷新医生信息
  refreshDocListInfo() {
    NativeModules.RNCloudFileModule.getPublicFileURL('').then((baseUri) => {
      this.setState({
        baseUrl: baseUri
      });
    });
  }

  //获取私有云基础路径
  getbasePrivateImgUrl = () => {
    NativeModules.RNCloudFileModule.getPrivateFileURL('+').then((baseUri) => {
      this.setState({
        basePrivateImgUrl: baseUri.split("+")[0]
      });
    })
  }

  //获取公有云基础路径
  getbasePublicImgUrl = () => {
    NativeModules.RNCloudFileModule.getPublicFileURL('+').then((baseUri) => {
      this.setState({
        basePublicImgUrl: baseUri.split("+")[0]
      });
    })
  }

  getVersion = () => {
    RouterModule &&
    RouterModule.appVersionInfo()
      .then((versionInfo) => {
        console.log("versionInfo:", versionInfo);
        versionCompare(versionInfo.Version, VERSION)
          .then((res) => {
            if (res === -1) {
              this.setState({
                isShowActivity:true
              })
            } else {
              this.setState({
                isShowActivity:false
              })
            }
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.moveTagScrollTimer && clearTimeout(this.moveTagScrollTimer);
  }

  componentDidMount() {
    this.getVersion();
    this.refreshDataWithNet();
    this.getbasePrivateImgUrl();
    this.getbasePublicImgUrl();
    let infoInit = (res) => {//登录
      if (typeof (res) === 'string' && res.length) {
        let userJson = JSON.parse(res)
        if (IsAndroid) {
          global.nickName = userJson.nickName
          global.userId = userJson.operatorNo
          global.uploadImageFlag = userJson.uploadImageFlag
          global.headPic = userJson.avatar
          global.mobileNo = userJson.mobile
        } else {
          global.nickName = userJson.nickName
          global.userId = userJson.operatorNo
          global.uploadImageFlag = userJson.uploadImageFlag
          global.headPic = userJson.headPic
          global.mobileNo = userJson.mobileNo
        }
      }
    }
    userReadyEmitter(infoInit);
    getUser().then(infoInit);

    userLogoutEmitter((dataRes) => {//退出登录
      this.refreshDataWithNet();
    });

    videoPlayLikeCountChange((data) => {
      const { allVideoMap } = this.state;
      let _allVideoMap = allVideoMap;
      const _data = data && JSON.parse(data)
      allVideoMap.map((videoMap, index) => {
        videoMap.videoList.map((item, _index) => {
          if (_data.id === item.id) {
            _allVideoMap[index].videoList[_index] = _data
          }
        })
      })
      this.setState({
        allVideoMap: _allVideoMap
      })
    })

    if (Platform.OS == 'android') {
      getTabHeight().then(height => {
        this.setState({
          safeHeight: height,
        });
      }).catch((error) => {

      });
    }

    TrackManager.track("HomeShow", {});//首页展示
    this.getWishCardInfo()
  }

  //下拉刷新
  freshMain = () => {
    this.refreshDataWithNet();
    this.getWishCardInfo()
    DeviceEventEmitter.emit(MAIN_REFRESH_NOTIFICATION_NAME,{});
  }

  //太映画点击视频
  onClickTaiYiYingHuaVideo(item, index) {
    const { videoTag } = this.state
    var _videoList = []
    var pos = 0
    item.videoList.map((item, _index) => {
      if (item.mediaType === "VIDEO") {
        _videoList.push(item)
      } else {
        if (_index < index) {
          pos++
        }
      }
    })
    let videoPra = {
      'list': _videoList,
      'index': index - pos,//重新计算点击位置
      'tag': videoTag === '推荐' ? '' : videoTag
    }
    videpPlayer_list(JSON.stringify(videoPra), () => { })
  }

  //上拉加载更多方法调用
  onloadMore = () => {
    const { videoTag, isLoading } = this.state
    if (!isLoading) {
      this.setState({
        loadStatus: LoadStatusType.Loading
      })
      this.videoPageQuery(videoTag);
    }
  }

  render() {
    const { toastStr, isVisiable, titlesToCheckHeight,isShowActivity } = this.state;
    return (
      <RootSiblingParent>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
            style={{
              width: ScreenInfo.width,
              height: navigatorHeight() + (isAndroid() ? 30 : 0),
              backgroundColor: "white",
              paddingTop: statusBarHeight(),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#222222", fontSize: 18, fontWeight: "bold" }}
            >
              {"名医话健康"}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              style={{ position: "absolute", left: 0, bottom: 0, paddingVertical: 12, paddingLeft:12, paddingRight:40 }}
              onPress={() => {
                PageRouter.pop();
              }}
            >
              <Image
                style={{
                  width: 22,
                  height: 22,
                }}
                source={require("./images/nav_back_n_gray.png")}
              />
            </TouchableOpacity>
          </View>
          {this._renderVideoModule()}
          <Modal visible={this.state.animating && isShowActivity} transparent={true} animationType='fade'>
            <View style={{ width: width, height: screenHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            {isShowActivity &&   <ActivityIndicator
                animating={this.state.animating}
                color="#00AD78"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  height: 80
                }}
                size="large" />}
            </View>
          </Modal>
        </View>
        <Toast
          ref={this.toastRef}
          visible={isVisiable}
          position={this._toastPosition}
          backgroundColor={'#3F78FC'}
          opacity={0.8}
          shadow={false}
          animation={false}
          hideOnPress={true}
        >{toastStr}</Toast>

        {
          titlesToCheckHeight.map((item, index) => {
            return <View key={index} style={[{ top: - 60, left: width + 10, position: "absolute", backgroundColor: "powderblue" }]} onLayout={(event) => this.measureView(event, item)} >
              <Text style={{ width: itemWidth - scaleSizeW(8) - scaleSizeW(8), fontSize: setSpText(14), fontWeight: 'bold' }} numberOfLines={3}>{item}</Text>
            </View>
          })
        }
      </RootSiblingParent>
    );
  }

  measureView(event, key) {
    const { allTitleHeight, arrHeightOfTitles, titlesToCheckHeight } = this.state;
    allTitleHeight[key] = event.nativeEvent.layout.height
    arrHeightOfTitles.push(key)

    if (arrHeightOfTitles.length != 0 && arrHeightOfTitles.length === titlesToCheckHeight.length) {
      this.updateVideoList()
    }
  }

  _renderBanner = () => {
    return (
      <Banner baseUrl={this.state.baseUrl} bannerArr={this.state.bannerArr} />
    )
  }

  _renerFamilyDcotorCardView = () => {
    const { pageTag } = this.props;
    return (
      <FamilyDoctorCard
        ref={this.doctorCardRef}
        container={this.scrollRef}
        style={{ marginTop: scaleSizeW(-24) }}
        userId={global.userId}
        mainPageTag={pageTag}
      />
    )
  }

  _renerdGridView = () => {
    const { baseUrl, serviceArr, shareUrl } = this.state;
    const { pageTag } = this.props;
    return (
      <MainGrid
        ref={this.gridRef}
        container={this.scrollRef}
        serviceArr={serviceArr}
        baseUrl={baseUrl}
        shareUrl={shareUrl}
        mainPageTag={pageTag}
        checkoutCurrentCard={() => {
          return this.doctorCardRef.current.currentHasDoctor();
        }}
        getCurrentBound={() => {
          return this.doctorCardRef.current.currentBound();
        }}
      />
    )
  }

  _renerLiveBroadcast = () => {
    const { shareUrl } = this.state
    return (
      <LiveBroadcast
        ref={this.broadcrastRef}
        container={this.scrollRef}
        title={"健康直播"}
        subTitle={"零距离面对面聊健康"}
        shareUrl={shareUrl}
        style={{ marginTop: scaleSizeW(10) }}
      />)
  }

  _renderSpecialDiseaseCenter = () => {
    const { zhuanBingShareTimes, wishCardList, basePublicImgUrl,isLoadingWishCard } = this.state
    return (
      <SpecialDiseaseCenter
        title={'专病中心'}
        subTitle={'名医大咖专业指导'}
        shareTimes={'已分享' + zhuanBingShareTimes + "次"}
        centerInfo={wishCardList}
        basePublicImgUrl={basePublicImgUrl}
        isLoadingWishCard= {isLoadingWishCard}
        shareOnPress={() => {
          // sensors.track("HomeLive", {
          //   "content_name": '去分享'
          // })
          // this.onClickShareMiniProgram('zhuanbingShare')
        }} />
    )
  }


  _collapsableComponent = () => {
    return (
      <View style={{ alignItems: 'center', overflow: 'hidden' }}>
        {/* {this._renderBanner()}
        {this._renerFamilyDcotorCardView()}
        {this._renerdGridView()}
        {this._renerLiveBroadcast()}
        {this._renderSpecialDiseaseCenter()}

        <View onLayout={(e) => {
          this.setState({
            headerHeight: e.nativeEvent.layout.y
          })
        }} /> */}
      </View>
    )
  }

  _renderTabViewTop = () => {
    return <View />
    // const { tiYingHuaShareTimes } = this.state
    // return <MainCardHeader
    //   title={'名医话健康'}
    //   titleStyle={{ marginBottom: scaleSizeW(4) }}
    //   containerStyle={{ width: screenWidth - scaleSizeW(24), marginLeft: scaleSizeW(12), paddingTop: statusBarHeight() >= 44 ? scaleSizeW(52) : scaleSizeW(22) }}
    //   subTitle={'放心实用的健康知识'}
    //   shareTimes={tiYingHuaShareTimes} />
  }

  _renderVideoModule = () => {
    const { tabNames, videoTag, headerHeight,
      isCeilingSuction, allVideoMap, loadStatus } = this.state;
    const tagVideoMap = this._getTagVideoMap(videoTag);
    return (
      <VideoModule
        ref={this.scrollRef}
        tabNames={tabNames}
        allVideoMap={{ ...allVideoMap }}
        isCeilingSuction={isCeilingSuction}
        collapsableComponent={this._collapsableComponent()}
        loadStatus={loadStatus}
        scrollEventThrottle={20}
        tabViewtopComponent={this._renderTabViewTop()}
        currentHeight={(tagVideoMap.viewHeight ? tagVideoMap.viewHeight : screenHeight - scaleSizeW(150)) + (IsAndroid ? scaleSizeW(50) : 0)}
        pullToRefresh={(respo) => { this.freshMain(); respo() }}
        onMomentumScrollBegin={(e) => {

        }}
        onMomentumScrollEnd={(e) => {

        }}
        onScrollEndDrag={(e) => {
          var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
          var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
          var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

          if (offsetY + oriageScrollHeight >= contentSizeHeight - 50) {
            this.onloadMore()
          }
        }}
        onScroll={(e) => {
          const { continerMarginTop } = this.state;
          let offsetY = e.nativeEvent.contentOffset.y;
          let opacityNum = 0;
          if (offsetY > NAVIGATORHEIGHT && continerMarginTop < NAVIGATORHEIGHT) {
            opacityNum = 1;
            this.setState({
              continerMarginTop: NAVIGATORHEIGHT
            })
          } else if (offsetY <= 0) {
            opacityNum = 0;
            this.setState({
              continerMarginTop: 0
            })
          } else {
            opacityNum = offsetY / NAVIGATORHEIGHT;
          }
          if (offsetY > headerHeight) {
            this._toastPosition = 150;
            this.setState({
              isCeilingSuction: true
            })
          } else if (offsetY < headerHeight) {
            this._toastPosition = headerHeight + NAVIGATORHEIGHT - offsetY + 70;
            this.setState({
              isCeilingSuction: false
            })
          }
        }}
        onChangeTab={(item) => {
          const { animating, loadStatus } = this.state;
          !animating && loadStatus !== LoadStatusType.isLoading && this._triggerVideoChangeTab(item)
        }}
        shareOnPress={() => {
          // sensors.track("HomeVideo", {
          //   "content_name": '去分享'
          // })
          // this.onClickShareMiniProgram("taiyingHuaShareMore");
        }}
        onItemPress={(item, index) => {
          const { videoTag } = this.state;
          const tagVideoMap = this._getTagVideoMap(videoTag);
          TrackManager.track("HomeVideo", {
            "content_name": item.tag,
            'video_id': item.videoId,
            'video_name': item.title,
            'current_page': '',
            'model_id': '',
            'model_name': '',
            'event_type': 'click'
          })
          if (item.mediaType === "VIDEO") {
            this.onClickTaiYiYingHuaVideo(tagVideoMap, index)
          } else {
            jumpToView(VIEW_TYPE.H5, 'NEWS', item.mediaUrl, {})
          }
        }}
        onEmptyPress={() => {
          this.videoPageQuery(videoTag);
        }} />
    )
  }

  _getTagVideoMap = (tag) => {
    const { allVideoMap } = this.state;
    let tagVideoMap = {};
    allVideoMap.map((item, index) => {
      if (tag === item.tag) {
        tagVideoMap = allVideoMap[index];
      }
    })
    return tagVideoMap;
  }

  _triggerVideoChangeTab = (item) => {
    const { tabNames, videoTag } = this.state;
    let nextTag = tabNames[item.i];
    if (nextTag !== videoTag) {
      const tagVideoMap = this._getTagVideoMap(tabNames[item.i]);
      let loadStatus = 0;
      let tagVideoList = tagVideoMap.videoList;
      if (tagVideoList) {
        if ( tagVideoList.length === 0 ) {
          loadStatus = LoadStatusType.Loading;
          this.videoPageQuery(tabNames[item.i])
        } else {
          // 直接显示数据
          loadStatus = LoadStatusType.ScrollTop;
        }
        this.setState({
          videoTag: tabNames[item.i],
          loadStatus: loadStatus
        })
      }
      
    }
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: scaleSizeW(32),
    alignItems: 'center'
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    width: width,
    backgroundColor: "#F7F7F7",
  },
  line: {
    flex: 1,
    backgroundColor: '#EEE',
    height: scaleSizeW(1)
  },
  moreDocBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSizeW(310),
    height: scaleSizeW(34),
    marginTop: scaleSizeW(10),
    marginLeft: width / 2 - scaleSizeW(177),
    borderRadius: scaleSizeW(19),
    borderColor: '#63A1FE',
    borderWidth: 1
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  titleContent: {
    height: scaleSizeW(50),
    marginTop: scaleSizeW(20),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: scaleSizeW(0.5),
    borderBottomColor: '#E6E6E6'
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center'
  },
  videoContentStyle: {
    marginTop: scaleSizeW(10),
    paddingHorizontal: scaleSizeW(12),
  },
  contentText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    marginTop: scaleSizeW(200)
  },
  touchableStyle: {
    width: scaleSizeW(84),
    height: scaleSizeW(31),
    borderRadius: scaleSizeW(15.5),
    backgroundColor: '#ECF8FC',
    marginTop: scaleSizeW(10),
    marginBottom: scaleSizeW(35),
    justifyContent: 'center'
  },
  refreshText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#00AD78'
  }
});
