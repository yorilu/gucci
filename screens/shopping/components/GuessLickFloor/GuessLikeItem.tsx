import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image as RNImage,
  Text,
  TouchableOpacity,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { urlPretreatment } from "../../../../tools/utils";
import { FILES_PUBLIC } from "../../../../config";
import { toJumpGoodDetail } from "../../utils";

interface Props {
  dataSource: any;
  isMarginLeft: boolean;
}

function GuessLikeItem(props: Props) {
  const [skuAmt, setSkuAmt] = useState("");
  const [img, setImg] = useState(FILES_PUBLIC + "");
  const [spuId, setSpuId] = useState("");
  const [storeNo, setStoreNo] = useState("");
  const [skuName, setSkuName] = useState("");

  useEffect(() => {
    let skuName = props?.dataSource?.skuName ?? "";
    let skuAmt = props?.dataSource?.skuAmt ?? "";
    let picList = props?.dataSource?.picList ?? [];
    let spuId = props?.dataSource?.spuId ?? "";
    let storeNo = props?.dataSource?.storeNo ?? "";
    let img = "";
    picList?.map?.((item: any, index: any) => {
      if (item?.picType === "SKU_IMG") {
        img = item?.picPath ?? "";
      }
    });
    setSkuAmt(skuAmt);
    setImg(`${FILES_PUBLIC}${img}`);
    setSpuId(spuId);
    setStoreNo(storeNo);
    setSkuName(skuName);
  }, [props?.dataSource]);

  const _onPress = () => {
    toJumpGoodDetail(spuId, storeNo);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { marginLeft: props?.isMarginLeft ? px(9) : 0 },
      ]}
      activeOpacity={1}
      onPress={_onPress}
    >
      <Image
        style={styles.pic}
        source={{ uri: img }}
        placeholderStyle={styles.picP}
        placeholderSource={require("../../images/search_place.png")}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {skuName}
        </Text>
        {/* <View style={styles.tag}>
          {[""]?.map?.((item, index) => {
            return (
              <View style={styles.tagItem} key={index}>
                <Text style={styles.tagItemTitle}>{"领券满2减2"}</Text>
              </View>
            );
          })}
        </View> */}
        <View style={styles.price}>
          <Text style={styles.priceText}>
            {"¥ "}
            <Text style={styles.priceBehText}>{parseFloat(skuAmt)/100}</Text>
          </Text>
          {/* <Text style={styles.alreadySaleText}>{"已售367件"}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default GuessLikeItem;

const styles = StyleSheet.create({
  container: {
    width: (ScreenInfo.width - px(33)) / 2,
    backgroundColor: "#FFF",
    marginVertical: px(5),
    borderRadius: px(8),
    overflow: "hidden",
  },
  pic: {
    width: px(170),
    height: px(170),
  },
  picP: {
    width: px(60),
    height: px(60),
  },
  info: {
    paddingTop: px(8),
    paddingBottom: px(10),
    paddingHorizontal: px(10),
  },
  title: {
    color: "#222222",
    fontSize: px(14),
    lineHeight: px(18),
  },
  tag: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: px(4),
  },
  tagItem: {
    paddingHorizontal: px(3),
    borderColor: "#FF4136",
    borderWidth: px(0.5),
    borderRadius: px(2),
    marginRight: px(4),
  },
  tagItemTitle: {
    color: "#FF4136",
    fontSize: px(11),
  },
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: px(10),
  },
  priceText: {
    color: "#FF4136",
    fontSize: px(12),
  },
  priceBehText: {
    fontSize: px(20),
    fontWeight: "700",
  },
  alreadySaleText: {
    color: "#999999",
    fontSize: px(11),
  },
});
