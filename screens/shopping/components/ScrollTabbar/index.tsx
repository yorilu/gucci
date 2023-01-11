import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";

interface Props {
  dataSource: Array<any>;
  selectCb: Function;
}

function ScrollTabbar(props: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  let els = useRef<Array<any>>([]).current;

  const _tabbarPress = (index: number) => {
    props?.selectCb?.(index);
    setActiveIndex(index);
    let sum = 0;
    els?.map((item, indey) => {
      if (indey < index) {
        sum = sum + item;
      }
    });
    (scrollViewRef?.current as any)?.scrollTo({
      x: sum - ScreenInfo.width / 2 + els?.[index] / 2,
      y: 0,
      animated: true,
    });
  };

  const _renderItem = () => {
    return props.dataSource.map((item, index) => (
      <View
        key={index}
        style={styles.tabbarItem}
        onLayout={(e) => {
          els[index] = e.nativeEvent.layout.width;
        }}
      >
        <TouchableOpacity
          style={styles.tabbarItemButton}
          activeOpacity={1}
          onPress={() => {
            _tabbarPress(index);
          }}
        >
          <Text
            style={[
              styles.tabbarItemTitle,
              {
                color: index === activeIndex ? "#222222" : "#999999",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.tabbarItemUnderline,
            {
              backgroundColor: index === activeIndex ? "#00AD78" : "#F6F6F6",
            },
          ]}
        />
      </View>
    ));
  };

  return (
    <View style={[styles.container, { width: ScreenInfo.width }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {_renderItem()}
      </ScrollView>
    </View>
  );
}

export default ScrollTabbar;

const styles = StyleSheet.create({
  container: {
    height: px(42),
    backgroundColor: "#F6F6F6",
  },
  rightButton: {
    backgroundColor: "#FFF",
    width: px(48),
    height: px(44),
    borderTopRightRadius: px(10),
  },
  contentContainer: {
    borderTopLeftRadius: px(10),
  },
  tabbarItem: {
    alignItems: "center",
  },
  tabbarItemButton: {
    backgroundColor: "rgba(0,0,0,0)",
    paddingHorizontal: px(12),
    height: px(42),
    justifyContent: "center",
    alignItems: "center",
  },
  tabbarItemTitle: { fontSize: px(16), fontWeight: "500" },
  tabbarItemUnderline: {
    width: px(26),
    height: px(3),
    borderRadius: px(2.5),
    position: "absolute",
    bottom: px(4),
  },
});
