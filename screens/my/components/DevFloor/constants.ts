import { isAndroid } from "@rn-js-kit/lib";
import { ENV } from "../../../../config";

export const DEV_CONSTANTS = isAndroid()
  ? [
      {
        title: "调试中心",
        key: "",
      },
      {
        title: "打开RN调试",
        key: "",
      },
      {
        title: "打开视频",
        key: "",
      },
    ]
  : [
      {
        title: "调试中心",
        key: "",
      },
      {
        title: "文件目录",
        key: "",
      },
    ];
