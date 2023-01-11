import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { px } from "@rn-js-kit/lib";
import GuessLikeItem from "./GuessLikeItem";

interface Props {
  dataSource: Array<any>;
}

function GuessLikeFloor(props: Props) {
  return (
    <View style={styles.container}>
      {props?.dataSource?.map?.((item, index) => {
        return (
          <GuessLikeItem
            key={index}
            dataSource={item}
            isMarginLeft={!!(index % 2)}
          />
        );
      })}
    </View>
  );
}

export default GuessLikeFloor;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: px(12),
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
