import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  LayoutChangeEvent,
  FlatList,
} from "react-native";
import StickyHeader from "react-native-stickyheader";
import {
  isIOS,
  isIPhoneX,
  px,
  ScreenInfo,
  statusBarHeight,
} from "@rn-js-kit/lib";
import {
  getPreviewFlagAndLoadConfig,
  getDetailsWithFloorConfig,
  isHasFloorWithType,
  comparisonArr,
} from "./utils";
import { CONSTANTS } from "./constants";
import CommonFloor from "./components/CommonFloor";
import BannerFloor from "./components/BannerFloor";
import ActivityFloor from "./components/ActivityFloor";
import LimitTimeFloor from "./components/LimitTimeFloor";
import VipSpecialFloor from "./components/VipSpecialFloor";
import ScrollTabbar from "./components/ScrollTabbar";
import NavBarFloor from "./components/NavBarFloor";
import FloatNavBarFloor from "./components/FloatNavBarFloor";
import GuessLikeItem from "./components/GuessLickFloor/GuessLikeItem";

interface Props {
  preview: string;
}

export default function Shopping(props: Props) {
  const [dataLeft, setDataLeft] = useState<Array<any>>([]);
  const [dataRight, setDataRight] = useState<Array<any>>([]);
  const [headHeight, setHeadHeight] = useState(0);
  const [configFloors, setConfigFloors] = useState([]);
  const [name, setName] = useState<any>({});
  const [details, setDetails] = useState<Array<any>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0));

  useEffect(() => {
    getPreviewFlagAndLoadConfig(props)
      .then((res: any) => {
        // console.log("getPreviewFlagAndLoadConfig---", res);
        if (res?.success) {
          setConfigFloors(res?.result?.configFloor ?? []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let { isHasFloor, floorConfig } = isHasFloorWithType(
      CONSTANTS.FLOOR_TYPE.GUESS_LIKE,
      configFloors
    );
    if (isHasFloor) {
      getDetailsWithFloorConfig(floorConfig)
        .then((res: any) => {
          // console.log("getDetailsWithFloorConfig---", res);
          let name = res?.name ?? {};
          let details = res?.details ?? [];
          let compareDetails = comparisonArr(details);
          setName(name);
          setDetails(compareDetails);
          let left = compareDetails?.[currentIndex]?.[0] ?? [];
          let right = compareDetails?.[currentIndex]?.[1] ?? [];
          setDataLeft(left);
          setDataRight(right);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [configFloors]);

  useEffect(() => {
    let left = details?.[currentIndex]?.[0] ?? [];
    let right = details?.[currentIndex]?.[1] ?? [];
    setDataLeft(left);
    setDataRight(right);
  }, [currentIndex]);

  const _onHeadLayout = useCallback((e: LayoutChangeEvent) => {
    setHeadHeight(e.nativeEvent.layout.height);
  }, []);

  const renderItem = useCallback((info) => {
    return <GuessLikeItem dataSource={info.item} isMarginLeft={false} />;
  }, []);

  const keyExtractor = useCallback((item, index) => {
    let skuId = item?.skuId ?? "";
    return skuId + index + String(currentIndex);
  }, []);

  return (
    <View style={styles.container}>
      <FloatNavBarFloor scrollY={scrollY.current} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY.current } },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.back} source={require("./images/back.png")} />
        <View onLayout={_onHeadLayout}>
          <NavBarFloor />
          {configFloors?.map?.((item: any, index) => {
            if (item?.configKey === CONSTANTS.FLOOR_TYPE.COMMON) {
              return (
                <CommonFloor
                  key={index}
                  dataSource={item}
                  marginHorizen={px(16)}
                  containerStyle={{
                    borderRadius: px(8),
                    paddingVertical: px(7),
                    paddingHorizontal: px(4),
                    width: ScreenInfo.width - px(12 * 2),
                    marginHorizontal: px(12),
                    marginTop: px(10),
                    backgroundColor: "#FFF",
                  }}
                  titleStyle={{ fontSize: px(13), marginTop: px(10) }}
                />
              );
            } else if (item?.configKey === CONSTANTS.FLOOR_TYPE.BANNER) {
              let elements = item?.elements ?? [];
              return (
                <BannerFloor
                  key={index}
                  dataSource={item}
                  marginHorizen={px(12)}
                  isUseNativeImg={elements?.length === 1}
                  containerStyle={{
                    marginTop: px(10),
                    // borderRadius: elements?.length === 1?0:px(4),
                  }}
                />
              );
            } else if (item?.configKey === CONSTANTS.FLOOR_TYPE.COMPOSITE_V) {
              return (
                <ActivityFloor
                  key={index}
                  dataSource={item}
                  containerStyle={{
                    marginTop: px(10),
                    width: ScreenInfo.width - px(12) * 2,
                    marginHorizontal: px(12),
                  }}
                  marginHorizen={px(12)}
                  space={px(9)}
                />
              );
            } else if (item?.configKey === CONSTANTS.FLOOR_TYPE.LIMIT_TIME) {
              return (
                <LimitTimeFloor
                  key={index}
                  dataSource={item}
                  containerStyle={{
                    width: ScreenInfo.width - px(12) * 2,
                    marginHorizontal: px(12),
                    marginTop: px(10),
                    paddingTop: px(13),
                    paddingBottom: px(11),
                    borderRadius: px(8),
                    backgroundColor: "#FFF",
                    overflow: "hidden",
                  }}
                />
              );
            } else if (item?.configKey === CONSTANTS.FLOOR_TYPE.VIP_SPECIAL) {
              return (
                <VipSpecialFloor
                  key={index}
                  dataSource={item}
                  containerStyle={{
                    width: ScreenInfo.width - px(12) * 2,
                    marginHorizontal: px(12),
                    marginTop: px(10),
                    paddingVertical: px(13),
                    borderRadius: px(8),
                    backgroundColor: "#FFF",
                    overflow: "hidden",
                  }}
                />
              );
            }
          })}
          {Object.values(name)?.length && details?.length ? (
            <Image style={styles.icon} source={require("./images/icon.png")} />
          ) : null}
        </View>
        <StickyHeader
          stickyHeaderY={
            headHeight - statusBarHeight() - px(52) > 0
              ? headHeight - statusBarHeight() - px(52)
              : headHeight
          }
          stickyScrollY={scrollY.current}
        >
          {Object.values(name)?.length ? (
            <ScrollTabbar
              dataSource={Object.values(name)}
              selectCb={(index: number) => {
                setCurrentIndex(index);
              }}
            />
          ) : null}
        </StickyHeader>
        {details?.length ? (
          <View
            style={{
              paddingHorizontal: px(12),
              flexDirection: "row",
            }}
          >
            <FlatList
              contentContainerStyle={{
                width: (ScreenInfo.width - px(33)) / 2,
              }}
              data={dataLeft}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
            />
            <FlatList
              contentContainerStyle={{
                width: (ScreenInfo.width - px(33)) / 2,
                marginLeft: px(9),
              }}
              data={dataRight}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
            />
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
  },
  back: {
    width: ScreenInfo.width,
    height: isIPhoneX() ? px(270) : px(250),
    position: "absolute",
    left: 0,
    top: 0,
  },
  icon: {
    width: px(142),
    height: px(18),
    marginTop: px(20),
    alignSelf: "center",
  },
});
