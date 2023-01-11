import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";

interface Props {
  dataSource: any;
  containerStyle?: ViewStyle; // 容器样式扩展属性
}

function QualityEnsureFloor(props: Props) {
  return <View style={[styles.container, props?.containerStyle ?? {}]}></View>;
}

export default QualityEnsureFloor;

const styles = StyleSheet.create({
  container: {
      width: ScreenInfo.width,
  },
});
