import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image as RNImage,
  Text,
  TouchableOpacity,
} from "react-native";
import { isIOS, px } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { urlPretreatment } from "../../../../tools/utils";
import { FILES_PUBLIC } from "../../../../config";
import { toJumpGoodDetail } from "../../utils";

interface Props {
  dataSource: any;
  last?: boolean;
}

function GoodItem(props: Props) {
  const [skuAmt, setSkuAmt] = useState("");
  const [layoutAmt, setLayoutAmt] = useState("");
  const [img, setImg] = useState(FILES_PUBLIC + "");
  const [spuId, setSpuId] = useState("");
  const [storeNo, setStoreNo] = useState("");
  const [skuName, setSkuName] = useState("");
  const [memberPrice, setMemberPrice] = useState("");
  const [introduce, setIntroduce] = useState("");

  useEffect(() => {
    let skuName = props?.dataSource?.skuName ?? "";
    let skuAmt = props?.dataSource?.skuAmt ?? "";
    let layoutAmt = props?.dataSource?.layoutAmt ?? "";
    let picList = props?.dataSource?.picList ?? [];
    let spuId = props?.dataSource?.spuId ?? "";
    let storeNo = props?.dataSource?.storeNo ?? "";
    let memberPrice = props?.dataSource?.memberPrice ?? 0;
    let introduce = props?.dataSource?.introduce ?? "";
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
    setSkuName(skuName);
    setMemberPrice(memberPrice);
    setIntroduce(introduce);
  }, [props?.dataSource]);

  const _onPress = () => {
    toJumpGoodDetail(spuId, storeNo);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { marginBottom: props?.last ? 0 : px(12) }]}
      activeOpacity={1}
      onPress={_onPress}
    >
      <View style={styles.borderV}>
        <Image
          style={styles.image}
          source={{ uri: img }}
          placeholderSource={require("../../images/search_place.png")}
        />
      </View>
      <View style={styles.info}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {skuName}
          </Text>
          {/* <Text style={styles.subTitle} numberOfLines={1}>
            {introduce}
          </Text> */}
          <View
            style={{
              marginTop: memberPrice ? px(8) : px(11),
              alignItems: "flex-start",
            }}
          >
            <Text style={styles.skuAmtText} numberOfLines={1}>
              {`¥ ${parseFloat(skuAmt) / 100}`}
            </Text>
            {memberPrice ? (
              <View style={styles.tag}>
                <View style={styles.tagTitleC}>
                  <Text style={styles.tagTitle} numberOfLines={1}>
                    {"会员低至"}
                  </Text>
                </View>
                <Text style={styles.price} numberOfLines={1}>
                  {`¥ ${parseFloat(memberPrice) / 100}`}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default GoodItem;

const styles = StyleSheet.create({
  container: {
    marginRight: px(8),
    paddingLeft: px(12),
    flexDirection: "row",
  },
  borderV: {
    borderColor: "#E0F0EC",
    borderWidth: px(1),
    borderRadius: px(5),
  },
  image: {
    width: px(88),
    height: px(88),
    borderRadius: px(4),
    backgroundColor: "#F6F6F6",
  },
  info: { flex: 1, marginLeft: px(12), justifyContent: "space-between" },
  title: {
    color: "#222222",
    fontSize: px(14),
    fontWeight: "bold",
    lineHeight: px(18),
  },
  subTitle: {
    color: "#999999",
    fontSize: px(12),
    marginTop: px(4),
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE7A7",
    borderRadius: px(2),
    marginTop: px(5),
  },
  tagTitleC: {
    paddingHorizontal: isIOS() ? px(4) : px(2),
    paddingVertical: isIOS() ? px(3) : px(1),
    backgroundColor: "#464646",
    borderRadius: px(2),
  },
  tagTitle: {
    color: "#FFE7A7",
    fontSize: px(12),
  },
  price: {
    color: "#353535",
    fontSize: px(14),
    fontWeight: "bold",
    marginHorizontal: px(5),
  },
  skuAmtText: {
    color: "#FF4136",
    fontSize: px(16),
    fontWeight: "bold",
    marginRight: px(12),
  },
});
