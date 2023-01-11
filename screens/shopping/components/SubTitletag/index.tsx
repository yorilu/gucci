import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { px } from "@rn-js-kit/lib";

const colors = [
  {
    containerFrontColor: "#FFE0D1",
    containerBackColor: "#FFF",
    titleColor: "#F47A40",
  },
  {
    containerFrontColor: "#FFE4C7",
    containerBackColor: "#FFF2C6",
    titleColor: "#C99D4D",
  },
];

interface Props {
  title: string;
  type: number;
  containerStyle: any;
}

function SubTitleTag(props: Props) {
  let type = props?.type ?? -1;
  let title = props?.title ?? "";
  if (type !== -1 && title?.length) {
    return (
      <LinearGradient
        colors={[
          colors[props.type]?.containerFrontColor,
          colors[props.type]?.containerBackColor,
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        locations={[0.5, 1]}
        style={[styles.container, props?.containerStyle ?? {}]}
      >
        <Text style={[styles.title, { color: colors[props.type]?.titleColor }]}>
          {props?.title ?? ""}
        </Text>
      </LinearGradient>
    );
  } else {
    return null;
  }
}

export default SubTitleTag;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: px(5),
    paddingVertical: px(0.5),
    backgroundColor: "red",
    borderRadius: px(10),
    borderColor: "#F8E3C1",
    borderWidth: px(1),
  },
  title: {
    fontSize: px(12),
    fontWeight: "600",
  },
});
