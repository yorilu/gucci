import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { px, ScreenInfo, statusBarHeight } from "@rn-js-kit/lib";
import { toJumpCart, toJumpSearch } from "../../utils";

interface Props {}

function NavBarFloor(props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.navTitle}>{"太医管家商城"}</Text>
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
    </View>
  );
}

export default NavBarFloor;

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
    paddingTop: statusBarHeight(),
    alignItems: "center",
  },
  navTitle: {
    color: "#FFFFFF",
    fontSize: px(18),
    fontWeight: "500",
    marginTop: px(9),
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px(12),
    marginTop: px(10),
    marginBottom: px(4),
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
