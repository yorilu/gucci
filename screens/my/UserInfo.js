import React, { forwardRef, Component, createRef } from "react";
import {
  StyleSheet,
  NativeModules,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { px, setphoneNumer } from "../../kit/Util";
import { ScreenInfo, statusBarHeight } from "../../kit/PlotformOS";
import { closeCurrentView } from "../../bridge/RouterBridge";
import {
  showPickPicture,
  toastStr,
  showLoading,
  destroyModal,
  openPicturePicker,
} from "../../component/TipModal";
import { httpFileUpload, httpPost } from "../../bridge/CommonRequestBridge";
import { getUser, Logoff, updateUserInfo } from "../../bridge/IMUserBridge";
import Drawer from "../../component/common/Drawer";
import {
  requestCameraPermission,
  requestPhotoPermission,
} from "../../tools/permissionUtil";
import { IsAndroid } from "../../tools/device";
import { profileGetSelfPatientInfo } from "./logic/ProfileHTTPServer";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: "个人信息",
      name: global.nickName,
      phoneNum: setphoneNumer(global.mobileNo),
      headPic: global.headPic ? global.headPic : "default",
      sex: "-",
    };
    this.getNativeUser();
    this.drawerRef = createRef();
  }

  componentDidMount() {
    this.getSex();
  }

  getSex = () => {
    profileGetSelfPatientInfo()
      .then((res) => {
        // console.log("getSex---", res);
        if (res?.success) {
          let sex = res?.result?.sex ?? "";
          let sexStr = "-";
          if (sex === "MALE") {
            sexStr = "男";
          } else if (sex === "FEMALE") {
            sexStr = "女";
          }
          this.setState({
            sex: sexStr,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //获取公有云图片路径
  getbasePublicImgUrl = (headpic, isNeedUpload) => {
    NativeModules.RNCloudFileModule.getPublicFileURL(headpic).then(
      (baseUri) => {
        this.setState(
          {
            headPic: baseUri,
          },
          () => {
            if (isNeedUpload == true) {
              global.headPic = baseUri;
              toastStr("修改头像成功");
              this.updateInfo();
            }
          }
        );
      }
    );
  };

  getNativeUser() {
    getUser()
      .then((infoData) => {
        if (IsAndroid) {
          var userobj = JSON.parse(infoData);
          this.setState({
            name: userobj.nickName,
            phoneNum: setphoneNumer(userobj.mobile),
          });
          if (userobj.hasOwnProperty("avatar")) {
            this.getbasePublicImgUrl(userobj.avatar, false);
          }
        } else {
          var userobj = JSON.parse(infoData);
          this.setState({
            name: userobj.nickName,
            phoneNum: setphoneNumer(userobj.mobileNo),
          });
          if (userobj.hasOwnProperty("headPic")) {
            this.getbasePublicImgUrl(userobj.headPic, false);
          }
        }
      })
      .catch((error) => {
        this.setState({
          name: global.nickName,
          phoneNum: setphoneNumer(global.mobileNo),
          headPic: global.headPic ? global.headPic : "default",
        });
      });
  }

  /**
   * 打开系统相册或选择图片
   */
  selectPic = () => {
    // showPickPicture(this.uploadAvator, { multiple: false })
    this.drawerRef.current.push();
  };

  openCameraClick = (type) => {
    if (0 === type) {
      requestCameraPermission()
        .then((result) => {
          if (result) {
            openPicturePicker(
              "carmera",
              { multiple: false },
              this.uploadAvator
            );
          } else {
            toastStr("暂无相机授权，请前往授权");
          }
        })
        .catch((err) => {
          toastStr("暂无相机授权，请前往授权");
        });
    } else {
      requestPhotoPermission().then((result) => {
        if (result === true || result === RESULTS.GRANTED) {
          openPicturePicker(
            "gallery",
            {
              multiple: false,
              cropperChooseText: "选择",
              cropperCancelText: "取消",
            },
            this.uploadAvator
          );
        } else {
          toastStr("暂无读取相册授权，请前往授权");
        }
      });
    }
  };

  /**
   * 拿到图片本地路径进行上传和修改个人信息
   */
  uploadAvator = (data) => {
    showLoading("修改头像中..");
    httpFileUpload(data)
      .then((remotefile) => {
        httpPost(
          "api/cif-core/cif/operatorInfoService/updateUserInfo",
          {},
          {
            userId: global.userId,
            traceLogId: "12345678",
            headPic: remotefile,
          }
        )
          .then((res) => {
            destroyModal();
            if (JSON.parse(res).success == true) {
              this.getbasePublicImgUrl(remotefile, true);
            } else {
              toastStr("修改头像失败，请稍后再试");
              console.log("修改个人信息失败--" + res);
            }
          })
          .catch((err) => {
            destroyModal();
            toastStr("修改头像失败，请稍后再试");
            console.log("修改头像error--" + err);
          });
      })
      .catch((e) => {
        destroyModal();
        toastStr("修改头像失败，请稍后再试");
        console.log("上传文件error--" + e);
      });
  };

  updateInfo = () => {
    updateUserInfo()
      .then((infoData) => {})
      .catch((error) => {});
  };

  copyUserId = () => {
    let userId = global?.userId ?? "";
    Clipboard.setString(userId?.length ? userId : "");
    toastStr("复制成功");
  };

  render() {
    const { header, name, phoneNum, sex } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <Header
          title={header}
          onBack={() => {
            closeCurrentView();
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.container, { marginTop: px(10) }]}
          onPress={async () => {
            this.selectPic();
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>头像</Text>
          </View>

          <View style={styles.buttonContainer}>
            {this.state.headPic != "default" ? (
              <Image
                style={{ width: px(30), height: px(30), borderRadius: 100 }}
                source={{ uri: this.state.headPic }}
              />
            ) : (
              <Image
                style={{ width: px(30), height: px(30), borderRadius: 100 }}
                source={require("../images/defaultAvator.png")}
                resizeMode={"contain"}
              />
            )}
            <Image
              style={styles.iconRight}
              source={require("../images/right_icon.png")}
              resizeMode={"contain"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.8}
          onPress={() => {
            navigation &&
              navigation.push("NameEdit", {
                refreshNickName: (name) => {
                  this.setState({
                    name: name,
                  });
                },
                kkk: "llll",
              });
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>昵称</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.infoText} numberOfLines={0}>
              {name}
            </Text>
            <Image
              style={styles.iconRight}
              source={require("../images/right_icon.png")}
              resizeMode={"contain"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>用户ID</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={[styles.infoText, { marginRight: px(7) }]}>
              {global.userId}
            </Text>
            <Pressable hitSlop={10} onPress={this.copyUserId}>
              <Image
                style={styles.copy}
                source={require("./images/copy.png")}
              />
            </Pressable>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>性别</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={[styles.infoText, { marginRight: px(24) }]}>
              {sex}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>手机号码</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={[styles.infoText, { marginRight: px(24) }]}>
              {phoneNum}
            </Text>
          </View>
        </TouchableOpacity>
        <Drawer onPress={this.openCameraClick} ref={this.drawerRef} />
      </View>
    );
  }
}

export const Header = forwardRef((props, ref) => {
  return (
    <View style={styles.nav}>
      <View style={{ width: ScreenInfo.width, height: statusBarHeight() }} />
      <View style={styles.navBarContain}>
        <TouchableOpacity
          style={styles.leftPosit}
          onPress={() => {
            if (props.onBack) {
              props.onBack();
            } else {
              navigation.pop();
            }
          }}
        >
          <Image
            resizeMode={"contain"}
            style={styles.leftIcon}
            source={require("../images/home/arrowBack.png")}
          />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{
            color: "#333",
            fontSize: 18,
            fontWeight: "bold",
            width: px(300),
            textAlign: "center",
          }}
        >
          {props.title}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: ScreenInfo.width,
    // height: px(52),
    paddingVertical: px(15),
    backgroundColor: "#FFF",
    borderBottomWidth: px(1),
    borderBottomColor: "#EAE9E9",
  },

  nav: {
    width: ScreenInfo.width,
    backgroundColor: "#FFF",
  },
  navBarContain: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: px(45),
  },
  leftIcon: {
    width: px(11),
    height: px(20),
    tintColor: "#666",
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
  leftPosit: {
    position: "absolute",
    width: px(40),
    height: px(45),
    justifyContent: "center",
    alignItems: "center",
    left: 0,
  },

  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: px(16),
    paddingRight: px(10),
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: px(10),
    paddingRight: px(18),
  },
  copy: {
    width: px(16),
    height: px(16),
  },
  title: {
    color: "#666666",
    fontSize: 14,
  },
  infoText: {
    color: "#000000",
    fontSize: 14,
    maxWidth: px(250),
  },
  navigate: {
    width: px(50),
    height: px(44),
    justifyContent: "center",
    paddingLeft: px(15),
  },
  icon: {
    width: px(18.5),
    height: px(18.5),
    tintColor: "#ccc",
    marginLeft: px(6),
  },
  iconRight: {
    width: px(17),
    height: px(17),
    tintColor: "#ccc",
    marginLeft: px(6),
  },
  avator: {
    width: px(36),
    height: px(36),
  },
});
