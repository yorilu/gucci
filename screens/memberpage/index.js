/*
 * @Description:
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-01 11:24:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-10 15:20:20
 */

import React from "react";
import "react-native-gesture-handler";
import {
  isAndroid,
  px,
  TrackManager,
  PageLife,
  PageRouter,
  EventEmitter,
} from "@rn-js-kit/lib";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import MemberApi from "./MemberApi";
import MemberNoRightView from "./component/MemberNoRightView";
import CardList from "./component/CardList";
import Header from "../../component/memberPage/Header";
import TipView from "../../component/memberPage/TipView";
import FamilyMonthly from "../../component/memberPage/FamilyMonthly";
import DoctorCard from "../../component/memberPage/DoctorCard";
import MyInterests from "../../component/memberPage/MyInterests";
import Text from "../../component/Text";
import FamilyMember from "./component/FamilyMember";
import AdBanner from "./component/AdBanner";
import HeadersBack from "../../component/memberPage/HeadersBack";
import { RootSiblingParent } from "react-native-root-siblings";
import { FILES_PUBLIC, SHANTAI_DOMAIN } from "../../config";
import { Alert } from "@rn-js-kit/ui";
import Storage from "../../tools/Storage";
import { userLogoutEmitter } from "../../bridge/IMUserBridge";
// import DialogModal from "./component/DialogModal"

const RightStatus = {
  // 未确定
  undetermin: -1,
  // 没有权益
  none: 0,
  // 有权益，没有选择医生，去选择医生
  chooseDoctor: 1,
  // 有权益，且已选择医生，未加微信
  addWeChat: 2,
  // 有权益，且已加微信
  isFriend: 3,
};

export default class MemberPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //是否展示选卡列表
      showCardList: false,
      //记录头部卡片
      // disPlayCardModel: null,
      // 权益状态
      status: 0,
      // 当前权益id，默认为0
      rightId: 0,
      // 是否获取权益异常
      rightError: false,
      // 页面加载打点标记位
      logFlag: 0,
      showActivateCardsDialog: false,
      // 权益的列表
      activeRights: null,
      allActiveRights:null,
      pageElements: null,
      insuranceList: [],
      loadMoreCard:true
    };
    this.cacheGroupId = "";
  }

  componentDidMount() {
    Storage.getMemberPageSelectCardGroupId()
      .then((res) => {
        // console.log("Member-Storage:", res);
        this.cacheGroupId = res;
      })
      .catch((err) => {
        console.log(err);
      });
    this.getSelfInheritedRights();
    this.getElements();

    PageLife.onShow(this.props.pageTag, () => {
      this.getSelfInheritedRights();
      this.getElements();
    });
  }

  getSelfInheritedRights() {
    MemberApi.getSelfInheritedRights()
      .then((resp) => {
        if (resp) {
          console.log(resp);
          let respObjec = resp;
          const { success, result } = respObjec;
          if (success) {
            let isMore = false
            if(result&&result.length>5)
              isMore = true
            this.setState({
              activeRights: result,
              allActiveRights:result.slice(0,5),
              loadMoreCard:isMore
            });
            this.getInsuranceADBanner()
          }
        }
      })
      .catch((error) => { });
  }

  getElements() {
    let params = {
      appId: isAndroid() ? 1 : 2,
      scenario: "MEMBER_PAGE",
      appVersion: 12001,
    };

    MemberApi.getElements(params)
      .then((resp) => {
        if (resp) {
          let respObjec = resp;
          const { success, result } = respObjec;
          if (success) {
            this.setState({
              pageElements: result,
            });
          }
        }
      })
      .catch((error) => { });
  }

  getInsuranceADBanner() {
    const right = this.getCurrentRight();
    const { productCode = '', isInvalid = false } = right || {}
    if (!isInvalid) {
      let params = {
        productCode,
        scenario: 'MEMBER_PAGE'
      }
      MemberApi.getInsuranceBanner(params).then((resp) => {
        const { success, result } = resp
        const { INS_BANNER } = result || {}
        const  elements  = INS_BANNER?.elements ?? [];
        this.setState({
          insuranceList: elements,
        })
      }).catch()
    }
  }

  render() {
    const isRightStatus = this.getRightStatus() == RightStatus.none;
    return (
      <RootSiblingParent>
        <View style={styles.outContainer}>
          {isRightStatus ? (
            <MemberNoRightView />
          ) : (
            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}
            >
              {this.renderContent()}
            </ScrollView>
          )}
          {this.renderCardList()}
          {/* <DialogModal/> */}
        </View>
      </RootSiblingParent>
    );
  }

  _renderBackImg = () => {
    return (
      <Image
        style={styles.backImg}
        source={require("../../component/memberPage/images/header_back.png")}
      />
    );
  };

  _renderHeader = () => {
    const rightStatus = this.getCurrentRight();
    const { activeRights } = this.state;
    return (
      <Header
        title={rightStatus.productName}
        onPress={this.showCardListfunc}
        isShowExchange={activeRights && activeRights.length > 1}
      />
    );
  };

  _renderHeadersBack = () => {
    const rightStatus = this.getRightStatus();
    const right = this.getCurrentRight();
    return (
      <HeadersBack
        chooseRightNowOnPress={this.chooseRightNowOnPress}
        currentRight={right}
      />
    );
  };

  chooseRightNowOnPress = () => {
    const right = this.getCurrentRight();
    const { familyInterestsId } = right;
    let jumpurl =
      SHANTAI_DOMAIN + `tahiti/signdoctor-doctor.html?sid=${familyInterestsId}`;
    PageRouter.openH5Page(jumpurl);
  };

  _renderCompanyTitle = () => {
    const right = this.getCurrentRight();
    let title = right?.showPrefix ?? '';
    if (title?.length) {
      return <Text style={styles.companyTitle}>{title}</Text>;
    } else {
      return null;
    }
  }

  _renderTip = () => {
    const right = this.getCurrentRight();
    let type = -1; // -1 太保卡(null) 0 升级 1 续费
    let tipText = "";
    const doctorId = right?.doctor?.doctorId ?? "";
    const groupId = right?.group?.groupId ?? "";
    if (right.type !== 1) {
      if (right.vip) {
        // 会员
        if (right.expired) {
          // 已过期
          type = 1;
          tipText = "您的会员已过期了";
        } else if (right.renewRemainder && right.remainingDays > 0) {
          // 未过期,判断是否需要过期提示(几天后过期)
          type = 1;
          tipText = `您的会员将在${right.remainingDays}天后过期`;
        } else {
          return <Text style={{color:'#999',fontSize:14,marginLeft:px(20),marginTop:px(5)}}>{'有效期至:'+right.expireTime}</Text>;
        }
      } else {
        // 非会员
        if (right.expired) {
          // 已过期
          type = 1;
          tipText = "您的会员已过期了";
        } else {
          // 未过期
          type = 0;
          tipText = "升级为正式版会员，尊享更多专属权益";
        }
      }
      return (
        <TipView
          type={type}
          title={tipText}
          onPress={() => {
            if (doctorId && groupId && doctorId.length && groupId.length) {
              let jumpurl =
                SHANTAI_DOMAIN +
                `m-active/index.html#/redirect?doctorId=${doctorId}&groupId=${groupId}&type=1&source=10`;
              PageRouter.openH5Page(jumpurl);
            } else {
              Alert.show({
                title: "请先选择绑定医生",
                message: "",
                rightButton: {
                  text: "确定",
                  textStyle: {
                    color: "#00AD78",
                  },
                  onPress: () => {
                    Alert.hide();
                    this.chooseRightNowOnPress();
                  },
                },
                leftButton: {
                  text: "取消",
                  textStyle: {
                    color: "black",
                    fontWeight: "normal",
                  },
                  onPress: () => {
                    Alert.hide();
                  },
                },
              });
            }
          }}
        />
      );
    } else {
      return null;
    }
  };

  _renderDoctorCard = () => {
    const right = this.getCurrentRight();
    const { pageElements, activeRights } = this.state;

    return <DoctorCard currentRight={right} pageElements={pageElements} />;
  };

  _renderMyInterests = () => {
    const rightStatus = this.getRightStatus();
    const right = this.getCurrentRight();
    return <MyInterests currentRights={right} />;
  };

  _renderFamilyMonthly = () => {
    const right = this.getCurrentRight();
    return <FamilyMonthly currentRights={right} />;
  };

  renderContent = () => {
    const rightStatus = this.getRightStatus();
    const right = this.getCurrentRight();
    let status = 0;
    let contentView = null;
    switch (rightStatus) {
      case RightStatus.chooseDoctor:
        contentView = this.renderChooseDoctor();
        status = RightStatus.chooseDoctor;
        break;
      case RightStatus.addWeChat:
        contentView = this.renderHasRights();
        status = RightStatus.addWeChat;
        break;
      case RightStatus.isFriend:
        contentView = this.renderHasRights();
        status = RightStatus.isFriend;
        break;
      default:
        break;
    }

    if (!this.logFlag && right) {
      const { isInvalid, noRight, id: content_id, name: content_name } = right;
      if (!isInvalid || (isInvalid && noRight)) {
        this.logFlag = true;
        TrackManager.track("ProjectTJK", { status, content_id, content_name });
        // track("ProjectTJK", { status, content_id, content_name });
      }
    }

    return contentView;
  };

  renderCardList() {
    const { showCardList,loadMoreCard } = this.state;
    if (!showCardList) return null;
    const { allActiveRights } = this.state;
    const right = this.getCurrentRight();
    return (
      <CardList
        activeRights={allActiveRights}
        loadMoreCard={loadMoreCard}
        right={right}
        onClick={this.vipCardsOnSwitch}
        onClose={this.cardListOnClose}
        onEndReached={this._onEndReached}
      ></CardList>
    );
  }


  _onEndReached = () => {
    const { loadMoreCard, activeRights,allActiveRights} = this.state;
    if (!loadMoreCard) return;
    let isMore = false
    const mLength = activeRights.length+5
    if(activeRights.length>allActiveRights.length){
      isMore = true
      let temp = []
      temp = activeRights.slice(0,mLength)
      this.setState({ 
        loadMoreCard: isMore,
        allActiveRights: temp
      });
    }else{
      this.setState({ 
        loadMoreCard: isMore,
      });
    }
  };

  renderAdBanner() {
    const { pageElements, activeRights } = this.state;
    const { BANNER = {} } = pageElements || {};
    let items = this.state.insuranceList.length ? this.state.insuranceList : BANNER.elements
    if (items && items.length > 0) {
      return <AdBanner dataArray={items} />;
    } else {
      return null;
    }
  }

  renderFamilyMember() {
    const right = this.getCurrentRight();
    if (right) {
      return <FamilyMember right={right}></FamilyMember>;
    } else {
      return null;
    }
  }

  //获取当前权益的状态
  getRightStatus = () => {
    let rightStatus = RightStatus.none;
    const right = this.getCurrentRight();
    if (right) {
      const { doctor, isInvalid } = right;
      if (doctor && doctor.doctorId > 0) {
        rightStatus = right.addWechatFriend
          ? RightStatus.isFriend
          : RightStatus.addWeChat;
      } else if (isInvalid) {
        rightStatus = RightStatus.none;
      } else {
        rightStatus = RightStatus.chooseDoctor;
      }
    }
    return rightStatus;
  };

  /**
   * 获取当前权益
   */
  getCurrentRight() {
    const { rightError, activeRights,allActiveRights } = this.state;
    if (rightError) {
      return { isInvalid: true };
    }

    if (!activeRights) {
      return { isInvalid: true, noRight: true };
    }

    if (activeRights.length == 0) {
      return { isInvalid: true, noRight: true };
    }
    // 有权益id，返回当前权益id对应的权益信息
    const { rightId } = this.state;
    if (rightId > 0) {
      const rights = activeRights.filter((item) => {
        const { group } = item;
        return group.groupId == rightId;
      });
      if (rights && rights.length > 0) {
        return rights[0];
      } else if (activeRights.length) {
        return activeRights[0];
      }
    }
    // 无权益id，取第一条信息
    if (this.cacheGroupId && this.cacheGroupId.length) {
      const rights = activeRights.filter((item, index) => {
        let groupId = item?.group?.groupId ?? "";
        return groupId === this.cacheGroupId;
      });
      if (rights && rights.length > 0) {
        return rights[0];
      } else if (activeRights.length) {
        return activeRights[0];
      }
    } else {
      return activeRights[0];
    }
  }

  renderChooseDoctor() {
    const rightStatus = this.getRightStatus();
    const right = this.getCurrentRight();
    const { activeRights } = this.state;
    return (
      <View>
        {this._renderBackImg()}
        {this._renderHeader()}
        {this._renderCompanyTitle()}
        {this._renderTip()}
        {this._renderHeadersBack()}
      </View>
    );
  }

  renderHasRights() {
    const rightStatus = this.getRightStatus();
    const right = this.getCurrentRight();
    const { activeRights } = this.state;
    return (
      <View>
        {this._renderBackImg()}
        {this._renderHeader()}
        {this._renderCompanyTitle()}
        {this._renderTip()}
        {this._renderDoctorCard()}
        {rightStatus != RightStatus.chooseDoctor && this.renderFamilyMember()}
        {this.renderAdBanner()}
        {this._renderMyInterests()}
        {this._renderFamilyMonthly()}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            marginTop: px(30),
            marginBottom: px(30),
          }}
        >
          <Image
            style={{ width: px(169), height: px(37) }}
            source={require("./component/images/member_tips.png")}
          />
        </View>
      </View>
    );
  }

  cardListOnClose = () => {
    this.setState({
      showCardList: false,
    });
  };

  showCardListfunc = () => {
    this.setState({
      showCardList: true,
    });
  };

  /**
   * 切换卡片回调
   */
  vipCardsOnSwitch = (right) => {
    const { rightId } = this.state;
    const { group } = right;
    if (right && rightId != group.groupId) {
      this.setState(
        {
          rightId: group.groupId,
        },
        () => {
          Storage.setMemberPageSelectCardGroupId(group.groupId || "");
        }
      );

      //重新刷新页面
      this.getInsuranceADBanner()

      const rightStatus = this.getRightStatus();
      const { id: content_id, name: content_name } = right;
    }

    this.setState({
      showCardList: false,
    });
  };
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#F3F6F5",
    width: "100%",
    height: "100%",
  },
  backImg: {
    width: "100%",
    height: px(362),
    position: "absolute",
    left: 0,
    top: 0,
  },
  companyTitle: {
    color: '#999999',
    fontSize: px(14),
    marginHorizontal: px(18),
    marginTop: px(5),
  },
});
