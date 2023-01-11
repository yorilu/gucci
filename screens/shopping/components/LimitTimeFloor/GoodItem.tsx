import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image as RNImage,
  Text,
  TouchableOpacity,
} from "react-native";
import { px } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { urlPretreatment } from "../../../../tools/utils";
import { toJumpGoodDetail } from "../../utils";
import { FILES_PUBLIC } from "../../../../config";

interface Props {
  dataSource: any;
}

function GoodItem(props: Props) {
  const [skuAmt, setSkuAmt] = useState("");
  const [layoutAmt, setLayoutAmt] = useState("");
  const [img, setImg] = useState(FILES_PUBLIC + "");
  const [spuId, setSpuId] = useState("");
  const [storeNo, setStoreNo] = useState("");

  useEffect(() => {
    let skuAmt = props?.dataSource?.skuAmt ?? "";
    let layoutAmt = props?.dataSource?.layoutAmt ?? "";
    let picList = props?.dataSource?.picList ?? [];
    let spuId = props?.dataSource?.spuId ?? '';
    let storeNo = props?.dataSource?.storeNo ?? '';
    let img = "";
    picList?.map?.((item: any, index: any) => {
      if (item?.picType === "SKU_IMG") {
        img = item?.picPath ?? "";
      }
    });
    setSkuAmt(skuAmt);
    setLayoutAmt(layoutAmt);
    setImg(`${FILES_PUBLIC}${img}`);
    setSpuId(spuId);
    setStoreNo(storeNo);
  }, [props?.dataSource]);

  const _onPress = () => {
    toJumpGoodDetail(spuId, storeNo);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={_onPress}
    >
      <Image
        style={styles.image}
        source={{ uri: img }}
        placeholderSource={require("../../images/search_place.png")}
      />
      <View style={styles.price}>
        <Text style={styles.nowPricePre} numberOfLines={1}>
          {"¥ "}
          <Text style={styles.nowPricePreBehi}>{parseFloat(skuAmt)/100}</Text>
        </Text>
        {/* <Text style={styles.oldPrice}>{`¥${layoutAmt}`}</Text> */}
      </View>
    </TouchableOpacity>
  );
}

export default GoodItem;

const styles = StyleSheet.create({
  container: {
    width: px(88),
    marginRight: px(8),
  },
  image: {
    width: px(88),
    height: px(88),
    borderRadius: px(4),
    backgroundColor:'#F6F6F6'
  },
  price: {
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent:'center',
    alignItems: "center",
    marginTop: px(5),
  },
  nowPricePre: {
    color: "#FF4136",
    fontSize: px(12),
  },
  nowPricePreBehi: {
    fontSize: px(16),
    fontWeight: "bold",
  },
  oldPrice: {
    color: "#999990",
    fontSize: px(12),
    textDecorationLine: "line-through",
  },
});
