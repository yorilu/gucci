/*
 * @Author: your name
 * @Date: 2021-03-03 10:20:22
 * @LastEditTime: 2021-08-26 11:23:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rn_im_doctor/src/pages/setting/Protocol.js
 */
import React from "react";
import { View, ScrollView, StyleSheet, NativeModules } from "react-native";
import { px } from "../../kit/Util";
import { ItemView, Header } from "./index";
import { addrConfig } from "./protocolAddr";
import { jumpToView, VIEW_TYPE } from "../../bridge/RouterBridge";
import { isAndroid, SchemeService } from "@rn-js-kit/lib";
import { versionCompare } from '../main/logic/MainUtils';

const { RouterModule } = NativeModules;

const VERSION = "1.4.2";

export default class ProtoCols extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: "",

      userProtocalUrl: "",
      userProtocalPrivateUrl: "",
      userProtocalLegalUrl: "",
    };
    //this.getFileUrl()
  }

  getFileUrl = () => {
    this.setState({
      userProtocalUrl:addrConfig.fwxy,
      userProtocalPrivateUrl:addrConfig.ysxy,
      userProtocalLegalUrl:addrConfig.flsm,
    });
  };

  getUrlFromConfig = () => {
    SchemeService.handleScheme(
      "taiyi://config/query?keys=" +
        encodeURIComponent(
          JSON.stringify([
            "userProtocalUrl",
            "userProtocalPrivateUrl",
            "userProtocalLegalUrl",
          ])
        )
    )
      .then((res) => {
        let userProtocalUrl;
        let userProtocalPrivateUrl;
        let userProtocalLegalUrl;
        if(isAndroid()){
          let resJson = res?.result ?? '';
          console.log(resJson);
          try {
            let result = JSON.parse(resJson);
            userProtocalUrl = result?.userProtocalUrl ?? "";
            userProtocalPrivateUrl = result?.userProtocalPrivateUrl ?? "";
            userProtocalLegalUrl = result?.userProtocalLegalUrl ?? "";
          } catch (e) {
            console.log(e);
          }
        }else{
          userProtocalUrl = res?.result?.userProtocalUrl ?? "";
          userProtocalPrivateUrl = res?.result?.userProtocalPrivateUrl ?? "";
          userProtocalLegalUrl = res?.result?.userProtocalLegalUrl ?? "";
        }
        this.setState({
          userProtocalUrl,
          userProtocalPrivateUrl,
          userProtocalLegalUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    // RouterModule &&
    //   RouterModule.appVersionInfo()
    //     .then((versionInfo) => {
    //       versionCompare(versionInfo.Version, VERSION)
    //         .then((res) => {
    //           if (res === -1) {
    //             this.getFileUrl();
    //           } else {
                this.getUrlFromConfig();
        //       }
        //     })
        //     .catch((e) => {
        //       console.log(e);
        //     });
        // })
        // .catch((err) => {
        //   console.log(err);
        // });
  }

  render() {
    const { navigation } = this.props;
    const { userProtocalUrl, userProtocalPrivateUrl, userProtocalLegalUrl } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header title={"协议分类"} />
        <ScrollView contentContainerStyle={{ paddingTop: px(10) }}>
          <ItemView
            title={"用户服务协议"}
            showArrowIcon={true}
            onPress={() => {
              jumpToView(
                VIEW_TYPE.H5,
                "",
                userProtocalUrl,
                {}
              );
            }}
          />
          <ItemView
            title={"隐私政策"}
            showArrowIcon={true}
            onPress={() => {
              jumpToView(
                VIEW_TYPE.H5,
                "",
                userProtocalPrivateUrl,
                {}
              );
            }}
          />
          <ItemView
            title={"法律声明"}
            showArrowIcon={true}
            onPress={() => {
              jumpToView(
                VIEW_TYPE.H5,
                "",
                userProtocalLegalUrl,
                {}
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
