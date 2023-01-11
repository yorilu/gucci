import { px, ScreenInfo } from "@rn-js-kit/lib";
import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

interface Props {
  onPress: Function;
}

function ErrorPage(props: Props) {
  const _onPress = () => {
    props?.onPress?.();
  };

  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={require("./images/error.png")} />
      <Text style={styles.tip}>{"出错啦~"}</Text>
      <TouchableOpacity
        style={styles.retryBtn}
        activeOpacity={0.8}
        onPress={_onPress}
      >
        <Text style={styles.retry}>{"重试"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ErrorPage;

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
    height: ScreenInfo.height,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: px(224),
    height: px(152),
  },
  tip: {
    color: "#666",
    fontSize: px(14),
  },
  retry: {
    color: "#fff",
    fontSize: px(18),
  },
  retryBtn: {
    width: px(300),
    height: px(44),
    backgroundColor: "#63A1FE",
    borderRadius: px(44),
    justifyContent: "center",
    alignItems: "center",
    marginTop: px(80),
  },
});
