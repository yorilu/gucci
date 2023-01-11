import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import { px } from "../../kit/Util";
import { ScreenInfo, statusBarHeight } from "../../kit/PlotformOS";
import Header from "./Header";
import LinearGradient from "react-native-linear-gradient";
import { httpPost } from "../../bridge/CommonRequestBridge";
import { toastStr, showLoading, destroyModal } from "../../component/TipModal";
import { updateUserInfo } from "../../bridge/IMUserBridge";

export default class NameEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "昵称",
      name:
        global.nickName?.length > 16
          ? global.nickName.substring(0, 16)
          : global.nickName,
      userID: global.userId,
    };
  }
  editNickName = () => {
    const { navigation } = this.props;

    if (this.state.name.length < 2 || this.state.name.length > 16) {
      toastStr("昵称长度需要在2-16个字符范围内");
      return;
    }

    var reg = /^[a-zA-z0-9\u4E00-\u9FA5]*$/;
    if (!reg.test(this.state.name)) {
      toastStr("昵称只能包含中文、英文字母和数字，长度2-16个字符");
      return;
    }
    showLoading("修改中..");
    httpPost(
      "api/cif-core/cif/operatorInfoService/updateUserInfo",
      {},
      {
        userId: global.userId,
        traceLogId: "12345678",
        nickName: this.state.name,
      }
    )
      .then((res) => {
        destroyModal();
        if (JSON.parse(res).success == true) {
          toastStr("修改昵称成功");
          updateUserInfo();
          console.log("修改昵称success--" + res);
          global.nickName = this.state.name;
          this.props.route.params.refreshNickName(this.state.name);
          DeviceEventEmitter.emit("_FRESH_USER_INFO_");
          navigation && navigation.pop();
        } else {
          toastStr(JSON.parse(res).errorMsg);
        }
      })
      .catch((err) => {
        destroyModal();
        toastStr("修改昵称失败，请稍后重试");
        console.log("修改昵称err--" + err);
      });
  };
  render() {
    const { navigation } = this.props;
    const { title, name } = this.state;
    return (
      <View>
        <Header
          title={"昵称"}
          navigation={navigation}
          backgroundColor={"#FFF"}
          rightContent={
            <LinearGradient
              colors={["#0ADDA4", "#02C0CB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <TouchableOpacity
                onPress={() => {
                  this.editNickName();
                }}
              >
                <Text style={styles.submitText}>完成</Text>
              </TouchableOpacity>
            </LinearGradient>
          }
        />
        <TextInput
          style={styles.TextInput}
          allowFontScaling={false}
          placeholder={"只支持中文、英文、数字，长度2-16个字符"}
          placeholderTextColor={"#999999"}
          value={name}
          onChangeText={(name) => {
            if (name.length <= 16) {
              this.setState({
                name,
              });
            }
          }}
          clearButtonMode={"while-editing"} //IOS
        />
        {/* <Text
          style={{
            color: "#999999",
            fontSize: 12,
            width: ScreenInfo.width,
            paddingLeft: px(22),
          }}
        >
          2-16个字符，仅支持中文、英文大小写和数字
        </Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TextInput: {
    color: "#666",
    width: ScreenInfo.width,
    height: px(52),
    fontSize: 14,
    paddingLeft: px(22),
    paddingRight: px(22),
    marginTop: px(10),
    marginBottom: px(10),
    backgroundColor: "#fff",
  },
  submitBtn: {
    width: px(44),
    height: px(21),
    borderRadius: px(10),
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 12,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#892093",
  },
  title: {
    fontSize: 16,
    color: "#FFF",
  },
  btn: {
    fontSize: 20,
    margin: 15,
    fontWeight: "bold",
  },
});
