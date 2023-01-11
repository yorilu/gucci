import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image as RNImage,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import {
  EventEmitter,
  isAndroid,
  PageRouter,
  px,
  SchemeService,
  ScreenInfo,
} from "@rn-js-kit/lib";
import { FILES_PUBLIC, ENV } from "../../../../config";
import { configureWithKey } from "../../logic/ProfileConfigure";
import { CONSTANTS } from "./constants";
import {
  profileAccountInfo,
  profileGETHealthCoin,
  profileGETUserById,
} from "../../logic/ProfileHTTPServer";
import { rnHandleScheme } from "../../../../bridge/rn-scheme";
const { RNMessageModule } = NativeModules;

interface Props {}

function UserHeader(props: Props, ref: any) {
  const [userInfo, setUserInfo] = useState<any>({});
  const [isShowBadge, setIsShowBadge] = useState(false);
  const [isShowCoin, setIsShowCoin] = useState(false);
  const [healthCoinUrl, setHealthCoinUrl] = useState("");
  const [accountValue, setAccountValue] = useState(0);

  useEffect(() => {
    refreshShowFun();
    let listener = EventEmitter.addListener(
      RNMessageModule,
      "MessageUnreadCountDidChange",
      () => {
        queryAllCount();
      }
    );
    return () => {
      listener && EventEmitter.removeListener(listener);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    refreshShow: refreshShowFun,
  }));

  const messageListScheme =
    "taiyi://page-router/native/open?viewName=MessageList";
  let name = userInfo?.nickName ?? "--";
  let headPic: string = userInfo?.headPic ?? "";
  if (!headPic.startsWith("http")) {
    headPic = FILES_PUBLIC + headPic;
  }
  let u = headPic.length ? { uri: headPic } : require("./images/default.png");

  // 刷新数据
  function refreshShowFun() {
    // 用户信息
    profileGETUserById()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success && setUserInfo(res?.result ?? {});
      })
      .catch((err) => {
        console.log(err);
      });

    // 消息小红点
    queryAllCount();

    // 健康币展示逻辑
    profileGETHealthCoin(ENV)
      .then((res: any) => {
        // console.log("健康币:---", res);
        let success = res?.success ?? false;
        if (success) {
          let content = res?.result?.content ?? "";
          try {
            let contentObj = JSON.parse(content);
            let isShowCoin = contentObj?.show ?? false;
            let healthCoinUrl = contentObj?.url ?? "";
            setIsShowCoin(isShowCoin);
            setHealthCoinUrl(healthCoinUrl);
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch((err) => console.log(err));

      profileAccountInfo().then((res:any) => {
        let success = res?.success ?? false;
        if (success) {
          let accountValue = res?.result?.accountValue ?? "";
          setAccountValue(accountValue);
        }
      }).catch((err) => console.log(err));
  }

  function queryAllCount() {
    SchemeService.handleScheme("taiyi://message/queryAllCount")
      .then((res: any) => {
        let result;
        if (isAndroid()) {
          result = JSON.parse(res.result);
        } else {
          result = res.result;
        }
        setIsShowBadge(result?.count !== 0 ?? false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  return (
    <ImageBackground
      style={styles.container}
      resizeMode={"cover"}
      source={require("./images/background.png")}
    >
      <TouchableOpacity
        style={styles.nameC}
        onPress={() => {
          PageRouter.openRNPage("Medical_Consult_Home", "UserInfoPage", {});
        }}
      >
        <RNImage style={styles.header} source={u} />
        <View style={styles.healthCOut}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={styles.tagContainer}>
            <TouchableOpacity
              style={styles.healthC}
              activeOpacity={0.8}
              onPress={() => {
                configureWithKey(CONSTANTS.healthArchivesUrl)
                  .then((res: any) => {
                    let result = res?.result;
                    if (isAndroid()) {
                      result = JSON.parse(result);
                    }
                    PageRouter.openURLPage(result[CONSTANTS.healthArchivesUrl]);
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
              }}
            >
              <Text style={styles.health}>{"健康档案"}</Text>
              <RNImage
                style={styles.arrow}
                source={require("./images/health_arrow.png")}
              />
            </TouchableOpacity>
            {isShowCoin && (
              <TouchableOpacity
                style={[styles.coinC, { marginLeft: px(6) }]}
                activeOpacity={0.8}
                onPress={() => {
                  rnHandleScheme(healthCoinUrl);
                }}
              >
                <RNImage
                  style={styles.coin}
                  source={require("./images/coin.png")}
                />
                <Text style={styles.health}>{`健康币 ${accountValue}`}</Text>
                <RNImage
                  style={styles.arrow}
                  source={require("./images/health_arrow.png")}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.settingC}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            PageRouter.openRNPage("Medical_Consult_Home", "SettingStack", {})
          }
        >
          <RNImage
            style={styles.setting}
            source={require("./images/setting.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => SchemeService.handleScheme(messageListScheme)}
        >
          <RNImage
            style={styles.message}
            source={require("./images/message.png")}
          />
          {isShowBadge ? <View style={styles.badge} /> : null}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default forwardRef(UserHeader);

const styles = StyleSheet.create({
  container: {
    width: ScreenInfo.width,
    height: px(158),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: px(12),
    paddingTop: px(84),
  },
  nameC: {
    flexDirection: "row",
  },
  header: {
    width: px(54),
    height: px(54),
    borderWidth: 2,
    borderColor: "white",
    borderRadius: px(27),
  },
  name: {
    color: "#333333",
    fontSize: px(20),
    fontWeight: "800",
    marginBottom: px(7),
    maxWidth: px(220),
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  healthCOut: {
    justifyContent: "space-between",
    height: px(54),
    marginLeft: px(16),
    paddingVertical: px(3),
  },
  healthC: {
    borderRadius: px(13),
    borderColor: "#CCCCCC",
    borderWidth: px(1),
    paddingLeft: px(7),
    paddingRight: px(4),
    height: px(20),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  coinC: {
    borderRadius: px(13),
    borderColor: "#CCCCCC",
    borderWidth: px(1),
    paddingLeft: px(2),
    paddingRight: px(4),
    height: px(20),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  health: {
    fontSize: px(12),
    color: "#222222",
  },
  coin: {
    width: px(15),
    height: px(15),
    marginRight: px(2),
  },
  arrow: {
    width: px(12),
    height: px(12),
  },
  settingC: {
    flexDirection: "row",
  },
  setting: {
    width: px(20),
    height: px(20),
    marginRight: px(12),
    marginBottom: px(25),
  },
  message: {
    width: px(20),
    height: px(20),
  },
  badge: {
    position: "absolute",
    right: px(0),
    top: px(0),
    backgroundColor: "#FF391D",
    width: px(6),
    height: px(6),
    borderRadius: px(3),
  },
});
