import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { layoutTransfer } from "../../../../layout";
import { FILES_PUBLIC } from "../../../../config";
import { rnHandleScheme } from "../../../../bridge/rn-scheme";

const reg = /\\/g;
interface Props {
  dataSource: any;
  marginHorizen?: number; // 容器水平间距
  titleStyle?: TextStyle; // 文字样式扩展属性
  subTitleStyle?: TextStyle; // 文字样式扩展属性
  imageStyle?: ImageStyle; // 图标样式扩展属性
  containerStyle?: ViewStyle; // 容器样式扩展属性
}

export default class CommonFloor extends PureComponent<Props> {
  render() {
    const {
      dataSource,
      marginHorizen = 0,
      imageStyle = {},
      titleStyle = {},
      subTitleStyle = {},
      containerStyle = {},
    } = this.props;
    // 取出标题 ,副标题
    let { title = "", subTitle = "", elements = [] } = dataSource;
    if (!elements) elements = [];
    // 楼层布局描述
    let style = {};
    try {
      // 转义前 json
      let escape = dataSource?.layoutDescribe ?? "";
      style = layoutTransfer(
        JSON.parse(escape.replace(reg, "")),
        ScreenInfo.width - marginHorizen * 2
      );
    } catch (err) {
      console.log(err);
    }
    let itemSubTitle = elements?.[0]?.subTitle ?? "";
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.itemContainer, style]}>
          {elements.map((item: any, index: number) => {
            const {
              image = "",
              title = "",
              subTitle = "",
              jumpUrl = "",
            } = item;
            let styleItem = {};
            try {
              // 转义前 json
              let escapeItem = item?.layoutDescribe ?? "";
              styleItem = layoutTransfer(
                JSON.parse(escapeItem.replace(reg, "")),
                ScreenInfo.width - marginHorizen * 2
              );
            } catch (err) {
              console.log(err);
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.itemC, styleItem]}
                activeOpacity={0.8}
                onPress={() => {
                  rnHandleScheme(jumpUrl);
                }}
              >
                <Image
                  style={[styles.icon, imageStyle]}
                  placeholderStyle={styles.icon}
                  placeholderSource={require('../../images/search_place.png')}
                  source={{ uri: FILES_PUBLIC + image }}
                />
                <Text style={[styles.itemTitle, titleStyle]} numberOfLines={1}>{title}</Text>
                {subTitle?.length ? (
                  <Text style={[styles.subTitle, subTitleStyle]}>
                    {subTitle}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
    marginHorizontal: 0,
  },
  itemContainer: {
    flexWrap: "wrap",
    alignItems: "center",
  },
  itemC: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: px(44),
    height: px(44),
  },
  itemTitle: {
    fontSize: px(14),
    color: "#222222",
  },
  subTitle: {
    color: "#999999",
    fontSize: px(10),
    marginTop: px(2),
  },
});
