import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image as RNImage,
  TextStyle,
  ViewStyle,
} from "react-native";
import { isIOS, px, ScreenInfo } from "@rn-js-kit/lib";
import { urlPretreatment } from "../../../../tools/utils";
import { rnHandleScheme } from "../../../../bridge/rn-scheme";
import { Image } from "@rn-js-kit/ui";

interface Props {
  dataSource: any;
  marginHorizen?: number; // 容器水平间距
  paddingHorizen?: number; // 容器水平内边距
  titleStyle?: TextStyle; // 标题样式扩展属性
  containerStyle?: ViewStyle; // 容器样式扩展属性
  space?: number; // 元素间距
}

export default function ActivityFloor(props: Props) {
  const [title, setTitle] = useState("");
  const [moreTitle, setMoreTitle] = useState("");
  const [moreImage, setMoreImage] = useState("");
  const [moreJumpUrl, setMoreJumpUrl] = useState("");
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  const [obj, setObj] = useState<any>({});

  useEffect(() => {
    const { dataSource } = props;
    let title = dataSource?.title ?? "";
    let moreTitle = dataSource?.rightMoreItem?.title ?? "";
    let moreImage = dataSource?.rightMoreItem?.image ?? "";
    let moreJumpUrl = dataSource?.rightMoreItem?.jumpUrl ?? "";
    let innerConfigElements =
      dataSource?.elements?.[0]?.innerConfigElements ?? [];
    setTitle(title);
    setMoreTitle(moreTitle);
    setMoreImage(moreImage?.length ? urlPretreatment(moreImage) : "");
    setMoreJumpUrl(moreJumpUrl);
    setDataSource(innerConfigElements);
  }, [props.dataSource]);

  useEffect(() => {
    getImageSize(dataSource);
  }, [dataSource]);

  const _onMorePress = () => {
    rnHandleScheme(moreJumpUrl);
  };

  const getImageSize = (arr: Array<any>) => {
    arr?.map((itemx, index) => {
      let arrx = itemx?.innerConfigElements ?? [];
      arrx?.map((itemy: any, indey: number) => {
        let url = itemy?.image ?? "";
        url?.length &&
          RNImage.getSize(
            urlPretreatment(url),
            (width, height) => {
              let h = (height / width) * getItemWidth();
              itemy.height = h;
              setObj({});
            },
            (err) => {
              console.log(err);
            }
          );
      });
    });
  };

  const getItemWidth = () => {
    const { marginHorizen = 0, paddingHorizen = 0 } = props;
    let containerW = ScreenInfo.width - marginHorizen * 2 - paddingHorizen * 2;
    let column = dataSource?.length ?? 1;
    let firstFloorW =
      (containerW - (props?.space ?? 0) * (column - 1)) / column;
    return firstFloorW;
  };

  return (
    <View style={[styles.container, props?.containerStyle ?? {}]}>
      {title?.length && moreTitle?.length && moreImage?.length ? (
        <View style={styles.headerC}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.arrowC}
            activeOpacity={0.8}
            onPress={_onMorePress}
          >
            {moreTitle?.length ? (
              <Text style={styles.headerSubTitle}>{moreTitle}</Text>
            ) : null}
            {moreImage?.length ? (
              <RNImage
                style={styles.headerArrowImg}
                source={{ uri: moreImage }}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      ) : null}
      <View
        style={[
          styles.contentC,
          {
            marginHorizontal: props?.paddingHorizen ?? 0,
            marginBottom: props?.paddingHorizen ?? 0,
          },
        ]}
      >
        {dataSource?.map((itemx, index) => {
          let firstFloorW = getItemWidth();
          let arrx = itemx?.innerConfigElements ?? [];
          return (
            <View
              key={index}
              style={[
                styles.firstFloorC,
                {
                  width: firstFloorW,
                  marginLeft: index ? props?.space ?? 0 : 0,
                },
              ]}
            >
              {arrx?.map((itemy: any, indey: number) => {
                let url = itemy?.image ?? "";
                let jumpUrl = itemy?.jumpUrl ?? "";
                let height = itemy?.height ?? 0;
                return (
                  <TouchableOpacity
                    key={indey}
                    style={{ marginTop: indey ? props?.space ?? 0 : 0 }}
                    activeOpacity={0.9}
                    onPress={() => {
                      rnHandleScheme(jumpUrl);
                    }}
                  >
                    <Image
                      style={[
                        styles.itemImg,
                        {
                          width: firstFloorW,
                          height,
                        },
                      ]}
                      source={{ uri: urlPretreatment(url) }}
                      placeholderSource={require('../../images/search_place.png')}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
  },
  headerC: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: px(10),
    paddingTop: px(16),
    marginBottom: px(10),
  },
  headerTitle: {
    color: "#222222",
    fontSize: px(18),
    fontWeight: isIOS() ? "800" : "bold",
  },
  arrowC: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerSubTitle: {
    fontSize: px(14),
    color: "#999999",
  },
  headerArrowImg: {
    width: px(16),
    height: px(16),
    marginLeft: px(2),
  },
  contentC: {
    flexDirection: "row",
    alignItems: "center",
  },
  firstFloorC: {},
  itemImg: {
    resizeMode: "stretch",
  },
});
