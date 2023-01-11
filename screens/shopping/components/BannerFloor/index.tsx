import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  Image as RNImage,
} from "react-native";
import React, { PureComponent } from "react";
import Swiper from "react-native-swiper";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { FILES_PUBLIC } from "../../../../config";
import { layoutTransfer } from "../../../../layout";
import { rnHandleScheme } from "../../../../bridge/rn-scheme";

const reg = /\\/g;

interface Props {
  dataSource: any;
  containerStyle?: ViewStyle;
  marginHorizen?: number;
  isUseNativeImg?: boolean;
}
interface State {}

export default class BannerFloor extends PureComponent<Props, State> {
  _renderItem = (item: any, index: number, style: any) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          const { jumpUrl } = item;
          jumpUrl && rnHandleScheme(jumpUrl);
        }}
      >
        {this.props.isUseNativeImg ? (
          <RNImage
            style={[Styles.bannerItem, style]}
            source={{ uri: FILES_PUBLIC + item.image }}
          />
        ) : (
          <Image
            style={[Styles.bannerItem, style]}
            source={{ uri: FILES_PUBLIC + item.image }}
            placeholderSource={require("../../images/search_place.png")}
          />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { dataSource, containerStyle = {}, marginHorizen = 0 } = this.props;
    // 取出标题 ,副标题
    let { elements = [] } = dataSource;
    if (!elements) elements = [];
    // 楼层布局描述
    let style: any = {};
    try {
      if (elements.length) {
        // 转义前 json
        let resHeight = 0;
        let escape = elements?.[0]?.layoutDescribe ?? "";
        resHeight = JSON.parse(escape.replace(reg, ""))?.style?.height ?? 0;
        let obj = {
          style: {
            width: 1,
            height: resHeight,
          },
        };
        style = layoutTransfer(obj, ScreenInfo.width - marginHorizen * 2);
      }
    } catch (err) {
      console.log("BannerFloor:", err);
    }
    return (
      <View style={[Styles.mainContainer, containerStyle, style]}>
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
          dot={<View style={Styles.dot} />}
          activeDot={
            <View
              style={[Styles.dot, { width: px(8), backgroundColor: "#00AD78" }]}
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
    width: ScreenInfo.width,
    // borderRadius: px(4),
    alignSelf: "center",
    overflow: "hidden",
  },
  shadowContainer: {},
  bannerContainer: {
    // borderRadius: px(8),
    // overflow: "hidden",
  },
  bannerItem: {
    overflow: "hidden",
    resizeMode: "contain",
  },
  dot: {
    width: px(4),
    height: px(4),
    borderRadius: px(2),
    backgroundColor: "rgba(216, 216, 216, 1)",
    marginHorizontal: px(2),
  },
});
