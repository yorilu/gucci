/*
 * @Description:
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-06 13:56:26
 * @LastEditors: cmg
 * @LastEditTime: 2021-07-21 11:57:39
 */

import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  NativeModules,
  ActivityIndicator,
  Modal,
  DeviceEventEmitter,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { width } from '../../../tools/device';
import Banner from '../../../component/common/Banner';
import { px } from '../../../kit/Util';
import { ScreenInfo } from '../../../kit/PlotformOS';
import { FILES_PUBLIC } from '../../../config'
import { PageRouter } from '@rn-js-kit/lib'

import Swiper from 'react-native-swiper'

// interface Props {
//   dataArray: Array;
// }

export default class AdBanner extends React.Component {
  didPressItem = (item) => {
    if (item.jumpUrl) {
      PageRouter.openH5Page(item.jumpUrl)
    }
  };

  renderItem = () => {
    const { dataArray = [] } = this.props
    let imageViews = [];
    let that = this;
    dataArray.map(function (item, idnex) {
      let url = FILES_PUBLIC + item.image;
      imageViews.push(
        <TouchableOpacity key={idnex} activeOpacity={1} style={Styles.bannerItem} onPress={() => {
          that.didPressItem(item)
        }}>
          <Image
            style={{
              width: ScreenInfo.width - px(38), height: px(90),
            }}
            source={{ uri: url }}
          />
        </TouchableOpacity>
      );
    })
    return imageViews;
  };

  render() {
    const { dataArray = [] } = this.props;
    if (dataArray) {
      return (
        <View style={Styles.mainContainer}>
          <View style={Styles.shadowContainer}>
            <Swiper
              key={dataArray.length}
              width={ScreenInfo.width - px(38)}
              height={px(90)}
              autoplay={true}
              horizontal={true}
              loop={true}
              autoplayTimeout={3}
              containerStyle={Styles.bannerContainer}
              style={Styles.bannerItem}
              showsPagination={true}
              paginationStyle={{ position: 'absolute', bottom: px(10) }}
              dot={(<View style={{ width: px(4), height: px(4), borderRadius: px(2), backgroundColor: 'rgba(216, 216, 216, 1)', marginHorizontal: px(2), }} />)}
              activeDot={(<View style={{ width: px(8), height: px(4), borderRadius: px(2), backgroundColor: '#00AD78', marginHorizontal: px(2), }} />)}
            >{this.renderItem()}</Swiper>
          </View >
        </View >
      );
    } else {
      return null;
    }
  }
}

const Styles = StyleSheet.create({
  mainContainer: {
    height: px(90),
    width: ScreenInfo.width - px(38),
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: {
      width: px(5),
      height: px(5),
    },
    shadowOpacity: 0.4,
    elevation: px(4),
    borderRadius: px(4),
    alignSelf: 'center',
    marginTop: px(25)
  },
  shadowContainer: {
    // marginLeft: px(16),
    height: px(90),
    width: ScreenInfo.width - px(38),
    borderRadius: px(6),
    overflow: 'hidden',
  },
  bannerContainer: {
    height: px(90),
    borderRadius: px(6),
  },
  bannerItem: {
    borderRadius: px(6),
  },
});
