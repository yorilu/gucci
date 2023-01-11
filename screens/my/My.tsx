import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  px,
  PageLife,
  ScreenInfo,
  PageRouter,
  isAndroid,
  TrackManager,
} from "@rn-js-kit/lib";
import ProfileHeader from "./components/ProfileHeader";
import {
  profileGetHealthRecord,
  profileGetSimpleBoundRight,
  profileGetTrackPoint,
  profileGETUserById,
  profileQueryCardNumber,
  profileQueryMallOrderStatusNum,
  profileQueryMyEquityCollectPage,
  profileQueryMyVoucher,
} from "./logic/ProfileHTTPServer";
import FamilyHealthRecord from "./components/FamilyHealthRecord";
import MyService from "./components/MyService";
import OrderCenter from "./components/OrderCenter";
import Tools from "./components/Tools";
import {
  BANNER,
  MY_SERVICE,
  ORDER_CENTER,
  TOOLS,
} from "./logic/ProfileConstants";
import { configureWithKey } from "./logic/ProfileConfigure";
// import { transform } from "../../layout";
// import { layoutData } from "../../layout/data";

interface Props {
  pageTag: any;
}
export default class My extends PureComponent<Props> {
  state = {
    userInfo: {},
    totalCollect: 0,
    totalVoucher: 0,
    cardNumber: 0,
    rights: [],
    healthRecord: [],
    orderInfo: {},
    badgeInfo: 0,
  };

  request() {
    profileGETUserById()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            userInfo: res?.result ?? {},
          });
      })
      .catch((err) => {
        console.log(err);
      });

    profileQueryMyEquityCollectPage()
      .then((res: any) => {
        // console.log("profileQueryMyEquityCollectPage:", res);
        if (isAndroid()) {
          let success = res?.status ?? "";
          success === "SUCCESS" &&
            this.setState({
              totalCollect: res?.result?.total ?? 0,
            });
        } else {
          let success = res?.success ?? false;
          success &&
            this.setState({
              totalCollect: res?.result?.total ?? 0,
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    profileQueryMyVoucher()
      .then((res: any) => {
        // console.log("profileQueryMyVoucher:", res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            totalVoucher: res?.result?.total ?? 0,
          });
      })
      .catch((err) => {
        console.log(err);
      });

    profileQueryCardNumber()
      .then((res: any) => {
        // console.log("profileQueryCardNumber:", res);
        if (isAndroid()) {
          let success = res?.status ?? "";
          success === "SUCCESS" &&
            this.setState({
              cardNumber: res?.result ?? 0,
            });
        } else {
          let success = res?.success ?? false;
          success &&
            this.setState({
              cardNumber: res?.result ?? 0,
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    profileGetSimpleBoundRight()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            rights: res?.result ?? [],
          });
      })
      .catch((err) => {
        console.log(err);
      });

    profileGetHealthRecord()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            healthRecord: res?.result ?? [],
          });
      })
      .catch((err) => {
        console.log(err);
      });

    profileQueryMallOrderStatusNum()
      .then((res: any) => {
        // console.log(res);
        let success = res?.success ?? false;
        success &&
          this.setState({
            orderInfo: res?.result ?? {},
          });
      })
      .catch((err) => {
        console.log(err);
      });

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
  }

  componentDidMount() {
    this.request();
    TrackManager.track("Myaccount", {
      current_page: "Myaccount",
      event_type: "show",
    });
    PageLife.onShow(this.props.pageTag, () => {
      this.request();
    });
  }

  render() {
    const {
      userInfo,
      totalCollect,
      totalVoucher,
      cardNumber,
      rights,
      healthRecord,
      orderInfo,
      badgeInfo,
    } = this.state;
    let bannerRequire = rights.length
      ? require("./images/my_rightbanner.png")
      : require("./images/my_buyrightbanner.png");
    return (
      <ScrollView style={{ backgroundColor: "rgb(244,244,244)" }}>
        <ProfileHeader
          userInfo={userInfo}
          totalCollect={totalCollect}
          totalVoucher={totalVoucher}
          cardNumber={cardNumber}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            let keyStr = BANNER[rights.length ? 1 : 0].key;
            configureWithKey(keyStr)
              .then((res: any) => {
                let result = res?.result;
                if (isAndroid()) {
                  result = JSON.parse(result);
                }
                PageRouter.openURLPage(result[keyStr]);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }}
        >
          <Image style={styles.banner} source={bannerRequire} />
        </TouchableOpacity>
        <FamilyHealthRecord healthRecord={healthRecord} />
        <View
          style={{
            width: ScreenInfo.width - px(24),
            backgroundColor: "white",
            marginLeft: px(12),
            marginTop: px(12),
            borderRadius: px(8),
            padding: px(16),
          }}
        >
          <Text
            style={{ color: "#333333", fontSize: px(20), marginBottom: px(8) }}
          >
            {"我的服务"}
          </Text>
          {/* {transform(layoutData)} */}
        </View>
        <MyService itemArr={MY_SERVICE} badgeInfo={badgeInfo} />
        <OrderCenter itemArr={ORDER_CENTER} orderInfo={orderInfo} />
        <Tools itemArr={TOOLS} />
        <View style={{ height: px(50), width: px(1) }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    width: ScreenInfo.width - px(12 * 2),
    marginHorizontal: px(12),
    marginTop: px(5),
    height: px(54),
  },
});
