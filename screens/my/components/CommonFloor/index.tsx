import React, { createRef, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native";
import { px, ScreenInfo } from "@rn-js-kit/lib";
import { Image } from "@rn-js-kit/ui";
import { transform } from "../../../../layout";
import { FILES_PUBLIC } from "../../../../config";
import { SCROLLVIEW_ONSCROLL } from "../../../../config/constants";

interface Props {
  dataSource: any;
  name: string;
}
export default class CommonFloor extends PureComponent<Props> {
  state = {
    idle: true,
  };
  listener: EmitterSubscription | null = null;
  instanceRef = createRef<View>();
  timer: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { name } = this.props;
    this.listener = DeviceEventEmitter.addListener(
      SCROLLVIEW_ONSCROLL + name,
      () => {
        const { instanceRef } = this;
        instanceRef?.current?.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            if (pageY < ScreenInfo.height) {
              this.setState({ idle: false });
            }
          }
        );
      }
    );

    this.timer = setTimeout(() => {
      const { instanceRef } = this;
      instanceRef?.current?.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          if (pageY < ScreenInfo.height) {
            this.setState({ idle: false });
          }
        }
      );
    }, 300);
  }
  componentWillUnmount() {
    this.listener && this.listener.remove();
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { dataSource } = this.props;
    const { idle } = this.state;
    // 取出标题 ,副标题
    let { title = "", subTitle = "", subImage = "" } = dataSource;
    if (!subImage) {
      subImage = "";
    } else {
      subImage = FILES_PUBLIC + subImage;
    }
    return (
      <View
        ref={this.instanceRef}
        style={idle ? styles.idle : styles.container}
      >
        {idle ? null : (
          <View>
            <View style={styles.titleC}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.rightC}>
                <Text style={styles.subTitle}>{subTitle}</Text>
                {subImage.length ? (
                  <Image
                    style={styles.subImage}
                    placeholderStyle={styles.subImage}
                    source={{ uri: subImage }}
                  />
                ) : null}
              </View>
            </View>
            {transform(dataSource)}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  idle: {
    width: ScreenInfo.width - px(12 * 2),
    height: px(100),
    marginHorizontal: px(12),
    marginTop: px(10),
    backgroundColor: "white",
    borderRadius: px(8),
  },
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
    alignItems: "center",
  },
  titleC: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: px(16),
  },
  rightC: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    color: "#666666",
    fontSize: px(12),
  },
  subImage: {
    width: px(12),
    height: px(12),
    marginLeft: px(1),
  },
  title: {
    color: "#333333",
    fontSize: px(16),
    fontWeight: "800",
  },
  itemC: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: ScreenInfo.width - px(12) * 2,
    paddingVertical: px(13),
    paddingHorizontal: px(16),
  },
  leftC: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: px(26),
    height: px(26),
  },
  itemTitle: {
    color: "#666666",
    fontSize: px(12),
    marginLeft: px(13),
  },
  arrow: {
    width: px(12),
    height: px(12),
  },
});
