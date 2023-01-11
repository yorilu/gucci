import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { PureComponent } from "react";
import Swiper from "react-native-swiper";
import { px, ScreenInfo, PageRouter } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { FILES_PUBLIC } from "../../../../config";
import { layoutTransfer } from "../../../../layout";
import { openFloorUrl } from "../../logic/ProfileUtils";

const reg = /\\/g;

interface Props {
  dataSource: any;
}
interface State {}

export default class BannerFloor extends PureComponent<Props, State> {
  _renderItem = (item: any, index: number, style: any) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          const { jumpUrl } = item;
          jumpUrl && openFloorUrl(jumpUrl);
        }}
      >
        <Image
          style={[Styles.bannerItem, style]}
          source={{ uri: FILES_PUBLIC + item.image }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { dataSource } = this.props;
    // 取出标题 ,副标题
    let { elements = [] } = dataSource;
    if (!elements) elements = [];
    // 楼层布局描述
    let style: any = {};
    try {
      if (elements.length) {
        let itemFirst = elements[0];
        // 转义前 json
        let escape = itemFirst?.layoutDescribe ?? "";
        style = layoutTransfer(
          JSON.parse(escape.replace(reg, "")),
          ScreenInfo.width - px(24)
        );
      }
    } catch (err) {
      console.log("BannerFloor:", err);
    }
    return (
      <View style={[Styles.mainContainer, style]}>
        <Swiper
          key={"BannerFloor"}
          width={style?.width ?? 0}
          height={style?.height ?? 0}
          autoplay={true}
          horizontal={true}
          loop={true}
          autoplayTimeout={3}
          containerStyle={Styles.bannerContainer}
          style={Styles.bannerItem}
          showsPagination={true}
          paginationStyle={{ position: "absolute", bottom: px(10) }}
          dot={
            <View
              style={{
                width: px(4),
                height: px(4),
                borderRadius: px(2),
                backgroundColor: "rgba(216, 216, 216, 1)",
                marginHorizontal: px(2),
              }}
            />
          }
          activeDot={
            <View
              style={{
                width: px(8),
                height: px(4),
                borderRadius: px(2),
                backgroundColor: "#00AD78",
                marginHorizontal: px(2),
              }}
            />
          }
        >
          {elements.map((item: any, index: number) => {
            return this._renderItem(item, index, style);
          })}
        </Swiper>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  mainContainer: {
    width: ScreenInfo.width - px(32),
    borderRadius: px(4),
    alignSelf: "center",
    marginTop: px(10),
  },
  shadowContainer: {},
  bannerContainer: {
    // height: px(74),
    borderRadius: px(8),
    overflow: "hidden",
  },
  bannerItem: {
    // borderRadius: px(8),
    overflow: "hidden",
    resizeMode: "contain",
  },
});
