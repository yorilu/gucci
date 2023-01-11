import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  createRef,
} from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { isAndroid, PageRouter, px, ScreenInfo } from "@rn-js-kit/lib";
import { configureWithKey } from "../../logic/ProfileConfigure";
import { BANNER, CONSTANTS } from "./constants";
import {
  profileGetSimpleBoundRight,
  profileQueryMallOrderStatusNum,
  profileSelectMember,
} from "../../logic/ProfileHTTPServer";
import { isShowExaminePage } from "../../../main/logic/MainConfigure";

interface Props {}

function VipFloor(props: Props, ref: any) {
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [rank, setRank] = useState(0);
  const [isExamine, setIsExamine] = useState(-1); // -1 不展示 0 审核页面 1 正常页面

  useEffect(() => {
    refreshShowFun();
    // isShowExaminePage()
    //   .then((res) => {
    //     setIsExamine(res? 0:1);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  useImperativeHandle(ref, () => ({
    refreshShow: refreshShowFun,
  }));

  // 刷新数据
  function refreshShowFun() {
    // 会员等级查券
    profileSelectMember()
      .then((res: any) => {
        console.log(res);
        let success = res?.success ?? false;
        success && setRank(res?.result?.rank ?? 0);
      })
      .catch((err: any) => {
        console.log(err);
      });

    // 订单相关
    profileQueryMallOrderStatusNum()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success && setOrderInfo(res?.result ?? {});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let bannerRequire =
    rank > 0
      ? require("./images/my_rightbanner.png")
      : require("./images/my_buyrightbanner.png");
  let waitPayCount = orderInfo?.waitPayCount ?? 0;
  let waitSendCount = orderInfo?.waitSendCount ?? 0;
  let waitGoodsCount = orderInfo?.waitGoodsCount ?? 0;
  let waitCommentCount = orderInfo?.waitCommentCount ?? 0;
  let sum = waitPayCount + waitSendCount + waitGoodsCount + waitCommentCount;

  return (
    <View style={styles.container}>
      {/* {isExamine === 1 ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            let keyStr = BANNER[rank > 0 ? 1 : 0].key;
            configureWithKey(keyStr)
              .then((res: any) => {
                let result = res?.result;
                if (isAndroid()) {
                  result = JSON.parse(result);
                }
                PageRouter.openURLPage(result[keyStr]);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }}
        >
          <Image style={styles.vipImg} source={bannerRequire} />
        </TouchableOpacity>
      ):null} */}
      <View style={styles.itemC}>
        {CONSTANTS.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={styles.item}
              onPress={() => {
                configureWithKey(item.key)
                  .then((res: any) => {
                    let result = res?.result;
                    if (isAndroid()) {
                      result = JSON.parse(result);
                    }
                    PageRouter.openURLPage(result[item.key]);
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
              }}
            >
              <Image style={styles.img} source={item.icon} />
              <Text style={styles.title}>{item.title}</Text>
              {index === 2 && sum ? <View style={styles.badge} /> : null}
            </TouchableOpacity>
          );
        })}
        <View style={styles.spe} />
      </View>
    </View>
  );
}

export default forwardRef(VipFloor);

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width - px(24),
    marginHorizontal: px(12),
    borderRadius: px(8),
    overflow: "hidden",
    marginTop: px(12),
  },
  vipImg: {
    width: ScreenInfo.width - px(24),
    height: px(44),
  },
  itemC: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
  item: {
    width: (ScreenInfo.width - px(24)) / 3,
    paddingVertical: px(13),
    alignItems: "center",
  },
  img: {
    width: px(24),
    height: px(24),
  },
  title: {
    color: "#222222",
    fontSize: px(12),
    marginTop: px(11),
  },
  badge: {
    position: "absolute",
    right: px(46),
    top: px(13),
    backgroundColor: "#FF391D",
    width: px(6),
    height: px(6),
    borderRadius: px(3),
  },
  spe: {
    backgroundColor: "#DEDEDE",
    width: StyleSheet.hairlineWidth,
    height: px(50),
    position: "absolute",
    top: px(14),
    right: (ScreenInfo.width - px(24)) / 3,
  },
});
