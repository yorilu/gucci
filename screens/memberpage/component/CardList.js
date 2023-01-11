/*
 * @Description:
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-01 18:13:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-10 17:20:59
 */

import React from "react";
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
  Text,
  ImageBackground,
  Image as RNImage,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ScreenInfo } from "../../../kit/PlotformOS";
import { height, width } from "../../../tools/device";
import { FILES_PUBLIC } from "../../../config";
import moment from "moment";
import { Image } from "@rn-js-kit/ui";
import {
  isAndroid,
  px,
  TrackManager,
  PageLife,
  PageRouter,
  bottomSafeAreaHeight,
} from "@rn-js-kit/lib";
export default class CardList extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.2)",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
        <View
          style={{
            height: px(500),
            width: "100%",
            backgroundColor: "#fcfcfc",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <View style={styles.cardListHeader}>
            <Text style={styles.headerTitle}>我的会员卡</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this._didPressClose}
            >
              <RNImage
                style={{
                  width: 16,
                  height: 16,
                }}
                source={require("./images/closeButton.png")}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.props.activeRights}
            renderItem={this._renderCardItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => {
              return <View style={{ height: 10, width: "100%" }} />;
            }}
            ItemSeparatorComponent={() => {
              return <View style={{ height: px(12), width: "100%" }} />;
            }}
            ListFooterComponent={() => {
              return (<View style={{ height: px(30), width: "100%",justifyContent:'center',alignItems:'center'}} >
              {
                this.props.loadMoreCard?<Text style={{
                  fontSize: 14,
                  color: '#999999',
                  lineHeight: 28,
                  textAlign: 'center'}}>加载更多</Text>:null
              }
              </View>);
            }}
            onEndReached={() => setTimeout(() => {
              this.props.onEndReached()
            }, 300)}
            onEndReachedThreshold={0.1}
          />
        </View>
      </View>
    );
  }

  

  _renderCardItem = (data) => {
    const { item, index } = data;
    const {
      productName,
      bound,
      group,
      expired,
      expireTime,
      userId,
      sourceUserId,
      showPrefix = "",
      doctor,
    } = item;
    const { personCount } = group || {};
    const { doctorName, imgUrl } = doctor || {};
    const isSelf = userId == sourceUserId;

    let avatar = FILES_PUBLIC + imgUrl;
    let bgimage = expired
      ? require("./images/vip-card-bg-gray.png")
      : require("./images/vip-card-bg.png");
    let backgroundColor = !isSelf
      ? { backgroundColor: "#4bb1ff" }
      : { backgroundColor: "#ff9c3e" };
    let itembackgroundColor = expired
      ? { backgroundColor: "rgba(238, 238, 238, 1)" }
      : { backgroundColor: "rgba(255, 255, 255, 1);" };
    let insueranceBG = !expired
      ? { backgroundColor: "#FEDDC3" }
      : { backgroundColor: "#E0E0E0" };
    let insuranceT = expired
      ? { color: "#666666" }
      : { color: "rgba(34, 34, 34, 100)" };
    let doctorId = doctor?.doctorId;
    let isBlindDoctor = doctorId && doctorId.length;
    let title = isBlindDoctor
      ? `${doctorName} 医生 含${personCount}位家庭成员`
      : "未签约医生";

    return (
      <TouchableOpacity
        style={[styles.cradItemContainer, itembackgroundColor]}
        onPress={() => {
          this._didPressSelect(item, index);
        }}
      >
        <RNImage
          source={bgimage}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 134,
            height: 96,
          }}
        />
        <View
          style={{
            padding: px(16),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.cardName}>{productName}</Text>
            <View
              style={[
                {
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 2,
                  marginLeft: 5,
                  height: px(16),
                  justifyContent: "center",
                  alignContent: "center",
                },
                backgroundColor,
              ]}
            >
              <Text style={styles.cardTag}>{isSelf ? "本人持卡" : "亲友"}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {isBlindDoctor ? (
              <Image
                style={{
                  width: px(40),
                  height: px(40),
                  borderRadius: px(20),
                  marginRight: px(15),
                }}
                placeholderSource={require("../../images/home/defaultDocHead.png")}
                source={{ uri: avatar }}
              />
            ) : null}
            <View>
              <Text style={styles.cardMember}>{title}</Text>
              {!expired && (
                <Text
                  style={styles.expireTime}
                >{`有效期至 ${expireTime}`}</Text>
              )}
            </View>
          </View>
        </View>
        {expired && (
          <View style={styles.expired}>
            <Text
              style={{
                fontFamily: "PingFangSC-Regular",
                color: "rgba(187, 187, 187, 100)",
              }}
            >
              已过期
            </Text>
          </View>
        )}
        {showPrefix?.length > 0 && (
          <View
            style={[
              {
                bottom: 0,
                height: px(28),
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              },
              insueranceBG,
            ]}
          >
            <Text style={[styles.insuranceTitle, insuranceT]} numberOfLines={1}>
              {showPrefix}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  _didPressSelect = (item, index) => {
    this.props.onClick && this.props.onClick(item);
  };
  _didPressClose = () => {
    this.props.onClose && this.props.onClose();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    ...StyleSheet.absoluteFillObject,
  },
  cardListHeader: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    left: 5,
    padding: px(15),
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "PingFangSC-Medium",
    color: "rgba(34, 34, 34, 100)",
  },
  cradItemContainer: {
    position: "relative",
    marginHorizontal: px(16),
    borderRadius: 8,
    display: "flex",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: {
      width: px(0),
      height: px(5),
    },
    shadowOpacity: 0.4,
    elevation: px(3),
  },
  cardName: {
    color: "rgba(34, 34, 34, 100)",
    fontSize: 16,
    fontFamily: "PingFangSC-Medium",
    fontWeight: "bold",
  },
  cardTag: {
    color: "rgba(255, 255, 255, 100)",
    fontSize: 10,
    fontFamily: "PingFangSC-Regular",
    height: 18,
    paddingHorizontal: 8,
    marginTop: 3,
  },
  cardMember: {
    color: "rgba(102, 102, 102, 100)",
    fontSize: 14,
    fontFamily: "PingFangSC-Regular",
    marginTop: px(6),
  },
  expireTime: {
    lineHeight: 14,
    color: "rgba(153, 153, 153, 100)",
    fontSize: 12,
    fontFamily: "PingFangSC-Regular",
    marginTop: px(6),
  },
  expired: {
    backgroundColor: "rgba(246, 246, 246, 1)",
    borderRadius: px(2),
    position: "absolute",
    top: 16,
    right: 16,
    alignContent: "center",
    paddingHorizontal: px(5),
  },
  insuranceTitle: {
    fontSize: "PingFangSC-Regular",
    paddingLeft:px(12),
    paddingRight:px(8),
    fontSize: px(14),
  },
});
