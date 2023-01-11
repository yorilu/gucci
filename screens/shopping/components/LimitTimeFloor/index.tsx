import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image as RNImage,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  FlatList,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { urlPretreatment } from "../../../../tools/utils";
import GoodItem from "./GoodItem";
import { queryStoreSku } from "../../services";
import { convertParams } from "../../utils";
import { rnHandleScheme } from "../../../../bridge/rn-scheme";
import SubTitletag from "../SubTitletag";

interface Props {
  dataSource: any;
  titleStyle?: TextStyle; // 标题样式扩展属性
  containerStyle?: ViewStyle; // 容器样式扩展属性
}

function LimitTimeFloor(props: Props) {
  const [title, setTitle] = useState("");
  const [moreTitle, setMoreTitle] = useState("");
  const [moreImage, setMoreImage] = useState("");
  const [moreJumpUrl, setMoreJumpUrl] = useState("");
  const [subTitle, setSubTitle] = useState('');
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    let title = props?.dataSource?.title ?? "";
    let subTitle = props?.dataSource?.subTitle ?? "";
    let moreTitle = props?.dataSource?.rightMoreItem?.title ?? "";
    let moreImage = props?.dataSource?.rightMoreItem?.image ?? "";
    let moreJumpUrl = props?.dataSource?.rightMoreItem?.jumpUrl ?? "";
    let elements = props?.dataSource?.elements ?? "";
    setTitle(title);
    setMoreTitle(moreTitle);
    setMoreImage(moreImage?.length ? urlPretreatment(moreImage) : "");
    setMoreJumpUrl(moreJumpUrl);
    getStoreSku(elements);
    setSubTitle(subTitle);
  }, [props.dataSource]);

  const getStoreSku = (arr: Array<any>) => {
    let params = convertParams(arr);
    queryStoreSku(params)
      .then((res: any) => {
        // console.log("getStoreSku---", res);
        if (res?.success) {
          setData(res?.result ?? []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const _onMorePress = () => {
    rnHandleScheme(moreJumpUrl);
  };

  const _renderItem = ({ item, index }: any) => {
    return <GoodItem dataSource={item} />;
  };

  if (data?.length) {
    return (
      <View style={[styles.container, props?.containerStyle ?? {}]}>
        <RNImage
          style={styles.back}
          source={require("./images/limit_back.png")}
        />
        {title?.length || moreTitle?.length || moreImage?.length ? (
          <View style={styles.header}>
            <View style={styles.headLeft}>
              <Text style={styles.headerTitle}>{title}</Text>
              {/* <RNImage
                style={styles.headIcon}
                source={require("./images/icon.png")}
              /> */}
              <SubTitletag
                title={subTitle}
                type={0}
                containerStyle={{ marginLeft: px(5) }}
              />
            </View>
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
        <FlatList
          contentContainerStyle={styles.flatList}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  } else {
    return null;
  }
}

export default LimitTimeFloor;

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
  },
  back: {
    width: ScreenInfo.width - px(24),
    position: "absolute",
    left: 0,
    top: 0,
  },
  header: {
    paddingHorizontal: px(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: px(10),
  },
  headLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headIcon: {
    width: px(60),
    height: px(18),
    marginLeft: px(5),
  },
  headerTitle: {
    color: "#222222",
    fontSize: px(18),
    fontWeight: "bold",
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
  flatList: {
    paddingHorizontal: px(12),
  },
});
