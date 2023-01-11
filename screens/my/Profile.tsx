import React, { PureComponent, createRef } from "react";
import {
  View,
  ScrollView,
  EmitterSubscription,
  DeviceEventEmitter,
} from "react-native";
import { px, PageLife, TrackManager } from "@rn-js-kit/lib";
import { profileLoadConfig } from "./logic/ProfileHTTPServer";
import UserFloor from "./components/UserFloor";
import VipFloor from "./components/VipFloor";
import ServiceFloor from "./components/ServiceFloor";
import BannerFloor from "./components/BannerFloor";
import CommonFloor from "./components/CommonFloor";
import DevFloor from "./components/DevFloor";
import { CONFIG_KEY } from "./logic/ProfileTypes";
import Storage from "../../tools/Storage";
import { ENV } from "../../config";
import {
  MYPAGE_ONSCROLL_FLAG,
  SCROLLVIEW_ONSCROLL,
} from "../../config/constants";
import ErrorPage from "./components/ErrorPage";
interface Props {
  pageTag: any;
  preview?: string;
}

interface State {
  configFloor: Array<any>;
  loadConfigSuccess: boolean;
}
export default class Profile extends PureComponent<Props, State> {
  listener?: EmitterSubscription;
  tempRef = createRef<View>();
  userFloorRef = createRef<typeof UserFloor>();
  vipFloorRef = createRef<typeof VipFloor>();
  serviceFloorRef = createRef<ServiceFloor>();
  commonFloorRef = createRef<typeof CommonFloor>();
  bannerFloorRef = createRef<typeof BannerFloor>();
  state = {
    configFloor: [],
    loadConfigSuccess: true,
  };

  getConfig = () => {
    let params = this.props?.preview ?? "";
    let preview = params?.length ? params : "ON_LINE";
    // // 获取是否为预览的标志符
    // Storage.getMyPagePreview()
    //   .then((res) => {
    //     // console.log("getMyPagePreview:", res);
    //     let viewFlag = ""; // 'PRE_VIEW','ON_LINE'
    //     if (!res) {
    //       // 从未设置过
    //       viewFlag = "ON_LINE";
    //     } else if (res !== "MY_PAGE") {
    //       // 设置过,被清除
    //       viewFlag = "ON_LINE";
    //     } else {
    //       // 预览状态
    //       viewFlag = "PRE_VIEW";
    //       // 清除
    //       Storage.setMyPagePreview("");
    //     }
        // 获取动态配置信息
        profileLoadConfig(preview)
          .then((res: any) => {
            console.log("profileLoadConfig:", res);
            let configFloor = res?.result?.configFloor ?? [];
            let floorLength = configFloor?.length ?? 0;
            if (res?.success && configFloor?.length) {
              this.setState(
                {
                  configFloor: configFloor,
                  loadConfigSuccess: !!floorLength,
                },
                () => {
                  Storage.setMyPageFloorConfig(configFloor ?? []);
                }
              );
            } else {
              this.loadFloorConfigCache();
            }
          })
          .catch((err) => {
            console.log(err);
            this.loadFloorConfigCache();
          });
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.loadFloorConfigCache();
      // });
  };

  loadFloorConfigCache() {
    Storage.getMyPageFloorConfig()
      .then((res) => {
        if (res?.length) {
          let floorLength = res?.length ?? 0;
          this.setState({
            configFloor: res,
            loadConfigSuccess: !!floorLength,
          });
        } else {
          this.setState({
            loadConfigSuccess: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loadConfigSuccess: false,
        });
      });
  }

  componentDidMount() {
    this.getConfig();
    // 上报
    TrackManager.track("Myaccount", {
      current_page: "Myaccount",
      event_type: "onload",
      desc: "我的页面初始化",
    });
    // 监听页面展示
    PageLife.onShow(this.props.pageTag, () => {
      let userFloorCurrent: any = this.userFloorRef?.current;
      let vipFloorCurrent: any = this.vipFloorRef?.current;
      let serviceFloorCurrent: any = this.serviceFloorRef?.current;
      userFloorCurrent?.refreshShow();
      vipFloorCurrent?.refreshShow();
      serviceFloorCurrent?.refreshShow();
    });
  }

  render() {
    const { configFloor, loadConfigSuccess } = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F6F6F6" }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          DeviceEventEmitter.emit(SCROLLVIEW_ONSCROLL + MYPAGE_ONSCROLL_FLAG);
        }}
      >
        {configFloor.map((item, index) => {
          const { configKey } = item;
          let Cp = null;
          if (configKey === CONFIG_KEY.USE_RPROFILE) {
            Cp = <UserFloor ref={this.userFloorRef} key={index} />;
          } else if (configKey === CONFIG_KEY.VIP) {
            Cp = <VipFloor ref={this.vipFloorRef} key={index} />;
          } else if (configKey === CONFIG_KEY.MY_SERVICES) {
            Cp = (
              <ServiceFloor
                ref={this.serviceFloorRef}
                key={index}
                dataSource={item}
              />
            );
          } else if (configKey === CONFIG_KEY.BANNER) {
            Cp = <BannerFloor key={index} dataSource={item} />;
          } else if (configKey === CONFIG_KEY.COMMON) {
            Cp = (
              <CommonFloor
                key={index}
                name={MYPAGE_ONSCROLL_FLAG}
                dataSource={item}
              />
            );
          }
          return Cp;
        })}
        {!configFloor.length && (
          <View>
            <UserFloor ref={this.userFloorRef} />
            <VipFloor ref={this.vipFloorRef} />
          </View>
        )}

        {(ENV as "dev" | "test" | "pre" | "prod") !== "prod" ? (
          <DevFloor />
        ) : null}
        <View style={{ height: px(30), width: px(1) }} />
        {/* {!loadConfigSuccess && <ErrorPage onPress={this.getConfig} />} */}
      </ScrollView>
    );
  }
}
