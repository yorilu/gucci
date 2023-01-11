import React, { useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import { px, ScreenInfo, statusBarHeight } from "@rn-js-kit/lib";
import { toJumpCart, toJumpSearch } from "../../utils";

interface Props {
  scrollY: any;
}

function FloatNavBarFloor(props: Props) {
  const viewRef = useRef<View>(null);

  const containerOpacity = useMemo(() => {
    return props?.scrollY.interpolate({
      inputRange: [0, 30],
      outputRange: [0, 1],
    });
  }, [props?.scrollY]);

  return (
    <Animated.View
      ref={viewRef}
      style={[styles.container, { opacity: containerOpacity }]}
    >
      <View style={styles.navContent}>
        <TouchableOpacity
          style={styles.search}
          activeOpacity={1}
          onPress={toJumpSearch}
        >
          <Image
            style={styles.searchIcon}
            source={require("./images/search.png")}
          />
          <Text style={styles.searchTip}>{"请输入商品关键词"}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={toJumpCart}>
          <Image
            style={styles.searchGoodIcon}
            source={require("./images/good.png")}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default FloatNavBarFloor;

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
    backgroundColor: "#20CA92",
    paddingTop: statusBarHeight(),
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 89,
    opacity: 0,
  },
  navTitle: {
    color: "#FFFFFF",
    fontSize: px(18),
    fontWeight: "500",
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px(12),
    marginVertical: px(10),
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: px(18),
    height: px(32),
    paddingHorizontal: px(12),
    flex: 1,
  },
  searchIcon: {
    width: px(15),
    height: px(15),
    marginRight: px(12),
  },
  searchTip: {
    color: "#BBB",
    fontSize: px(14),
  },
  searchGoodIcon: {
    width: px(24),
    height: px(24),
    marginLeft: px(20),
  },
});
