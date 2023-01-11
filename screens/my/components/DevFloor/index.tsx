import React, { createRef, PureComponent } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { DEV_CONSTANTS } from "./constants";
import {
  onOpenDebuggingCenter,
  onOpenFileDirectory,
  onOpenRNDebug,
  onOpenVideo,
} from "../../logic/ProfileConfigure";

interface Props {}

export default class DevFloor extends PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleC}>
          <Text style={styles.title}>{"开发工具"}</Text>
          <Text style={styles.subTitle}>{""}</Text>
        </View>
        <View style={styles.itemContainer}>
          {DEV_CONSTANTS.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemC}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.title === "调试中心") {
                    onOpenDebuggingCenter();
                  } else if (item.title === "文件目录") {
                    onOpenFileDirectory();
                  } else if (item.title === "打开视频") {
                    onOpenVideo();
                  } else if (item.title === "打开RN调试") {
                    onOpenRNDebug();
                  }
                }}
              >
                <Image
                  style={styles.icon}
                  source={require("./images/dev.png")}
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
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
    width: ScreenInfo.width - px(12 * 2),
    marginHorizontal: px(12),
    marginTop: px(10),
    backgroundColor: "white",
    borderRadius: px(8),
    paddingVertical: px(20),
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  titleC: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: px(16),
    marginBottom: px(8),
  },
  subTitle: {
    color: "#666666",
    fontSize: px(12),
  },
  title: {
    color: "#333333",
    fontSize: px(16),
    fontWeight: "800",
  },
  itemC: {
    alignItems: "center",
    justifyContent: "center",
    width: (ScreenInfo.width - px(12) * 2) / 4,
    paddingVertical: px(10),
  },
  icon: {
    width: px(20),
    height: px(20),
  },
  itemTitle: {
    color: "#222222",
    fontSize: px(12),
    marginTop: px(10),
  },
  badge: {
    backgroundColor: "#FF391D",
    width: px(5),
    height: px(5),
    position: "absolute",
    right: px(13),
    top: px(4),
    borderRadius: px(2.5),
  },
});
