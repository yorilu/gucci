/*
 * @Author: your name
 * @Date: 2021-11-25 19:21:53
 * @LastEditTime: 2021-12-07 10:25:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /rn-medical-home/src/pages/my/logic/ProfileUtils.ts
 */
import { PageRouter } from "@rn-js-kit/lib";
import { showToast } from "@rn-js-kit/ui";
import { Linking, Alert, NativeModules } from "react-native";
import { rnHandleScheme } from "../../../bridge/rn-scheme";
const { RNAppInfoModule } = NativeModules;

export const call = (phone: string) => {
  // const url = `tel:${phone}`;
  Linking.canOpenURL(phone)
    .then((supported) => {
      if (!supported) {
        return Alert.alert(
          "提示",
          `您的设备不支持该功能，请手动拨打 ${phone}`,
          [{ text: "确定" }]
        );
      }
      return Linking.openURL(phone);
    })
    .catch((err) => showToast(`出错了：${err}`, 1.5));
};

export const AppVersion = () => {
  let appinfo = RNAppInfoModule;
  if (appinfo && appinfo.appVersion) {
    let versionNumber = appinfo.appVersion.split(".");
    return (
      versionNumber[0] * 10000 + versionNumber[1] * 100 + versionNumber[2] * 1
    );
  }
  return 0;
};

export const openFloorUrl = (url: string = "") => {
  rnHandleScheme(url);
};
