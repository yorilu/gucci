import React, { PureComponent } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { PageRouter, px, ScreenInfo } from "@rn-js-kit/lib";
import {
  profileGetTrackPoint,
  profileRegistraction,
} from "../../logic/ProfileHTTPServer";
import { Image } from "@rn-js-kit/ui";
import { layoutTransfer } from "../../../../layout";
import { FILES_PUBLIC } from "../../../../config";
import { openFloorUrl } from "../../logic/ProfileUtils";

const reg = /\\/g;
interface Props {
  dataSource: any;
}

export default class ServiceFloor extends PureComponent<Props> {
  state = {
    badgeInfo: 0,
  };

  refreshShow = () => {
    profileGetTrackPoint()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            badgeInfo: res?.result ?? 0,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.refreshShow();
  }

  render() {
    const { dataSource } = this.props;
    const { badgeInfo } = this.state;
    // 取出标题 ,副标题
    let { title = "", subTitle = "", elements = [] } = dataSource;
    if (!elements) elements = [];
    // 楼层布局描述
    let style = {};
    try {
      // 转义前 json
      let escape = dataSource?.layoutDescribe ?? "";
      style = layoutTransfer(
        JSON.parse(escape.replace(reg, "")),
        ScreenInfo.width - px(12 * 2)
      );
    } catch (err) {
      console.log(err);
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleC}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
        <View style={[styles.itemContainer, style]}>
          {elements.map((item: any, index: number) => {
            const { image = "", title = "", jumpUrl = "" } = item;
            let styleItem = {};
            try {
              // 转义前 json
              let escapeItem = item?.layoutDescribe ?? "";
              styleItem = layoutTransfer(
                JSON.parse(escapeItem.replace(reg, "")),
                ScreenInfo.width - px(12 * 2)
              );
            } catch (err) {
              console.log(err);
            }
            return (
              <TouchableOpacity
                key={index}
                style={[styles.itemC, styleItem]}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.elementKey === "挂号记录") {
                    profileRegistraction()
                      .then((res: any) => {
                        // console.log(res);
                        let success = res?.success ?? false;
                        success && PageRouter.openURLPage(res.result);
                      })
                      .catch((err: any) => {
                        console.log(err);
                      });
                  } else {
                    openFloorUrl(jumpUrl);
                  }
                }}
              >
                <View>
                  <Image
                    style={styles.icon}
                    placeholderStyle={styles.icon}
                    source={{ uri: FILES_PUBLIC + image }}
                  />
                  {item.elementKey === "我的处方" && badgeInfo > 0 ? (
                    <View style={styles.badge} />
                  ) : null}
                </View>
                <Text style={styles.itemTitle}>{title}</Text>
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
    paddingTop: px(20),
    paddingBottom: px(13),
  },
  itemContainer: {
    flexWrap: "wrap",
    alignItems: "center",
  },
  titleC: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: px(16),
    marginBottom: px(10),
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
    // width: (ScreenInfo.width - px(12) * 2) / 4,
    marginTop: px(22),
  },
  icon: {
    width: px(24),
    height: px(24),
  },
  itemTitle: {
    color: "#222222",
    fontSize: px(12),
    marginTop: px(13),
  },
  badge: {
    backgroundColor: "#FF391D",
    width: px(5),
    height: px(5),
    position: "absolute",
    right: px(-2),
    top: px(-2),
    borderRadius: px(2.5),
  },
});
