import { httpPost } from "../../../bridge/CommonRequestBridge";
import { isAndroid, Network, NetworkCacheMode } from "@rn-js-kit/lib";
import * as ProfileHTTPPath from "./ProfileHTTPPath";
import moment from "moment";
import { AppVersion } from "./ProfileUtils";
import { RNVERSION } from "../../../../RNVERSION";
import { getRNVersionNum } from "../../../../VERSION";

interface CommonHttpPostCacheParams {
  cacheMode: NetworkCacheMode;
  cacheCallback: (response: any) => void;
}

const commonHTTPPost = async (
  url: string,
  param: any = {},
  cacheParams?: CommonHttpPostCacheParams
) => {
  const { cacheMode, cacheCallback } = cacheParams || {};
  return Network.post({
    url: url,
    params: param,
    cacheMode: cacheMode || NetworkCacheMode.Normal,
    cacheCallback,
  });
};

const commonHTTPGet = async (
  url: string,
  param: any = {},
  cacheParams?: CommonHttpPostCacheParams
) => {
  const { cacheMode, cacheCallback } = cacheParams || {};
  return Network.get({
    url: url,
    params: param,
    cacheMode: cacheMode || NetworkCacheMode.Normal,
    cacheCallback,
  });
};

export const profileGETUserById = () => {
  return commonHTTPPost(ProfileHTTPPath.GET_USER_BY_ID, {
    userId: global.userId,
    traceLogId: parseInt(Date.parse(new Date()) / 1000),
  });
};

export const profileGETHealthCoin = (env: string) => {
  let envStr = "PROD";
  switch (env) {
    case "dev":
      envStr = "DEV";
      break;
    case "test":
      envStr = "TEST";
      break;
    case "pre":
      envStr = "PRE";
      break;
    default:
      break;
  }
  return commonHTTPPost(ProfileHTTPPath.GET_SECRET_CONTENT, {
    resourceId: "mobile.mine.coin",
    groupId: "MOBILE-CONFIG",
    environment: envStr,
  });
};

export const profileQueryMyEquityCollectPage = () => {
  return commonHTTPPost(ProfileHTTPPath.QUERY_MY_EQUITY_COLLECTPAGE, {
    userId: global.userId,
    operatorNo: global.userId,
    requestSource: "APPPlatform",
  });
};

export const profileQueryMyVoucher = () => {
  return commonHTTPPost(ProfileHTTPPath.QUERY_MY_VOUCHER, {
    operatorNo: global.userId,
    requestSource: "APPPlatform",
  });
};

export const profileQueryCardNumber = () => {
  return commonHTTPPost(ProfileHTTPPath.QUERY_CARD_NUMBER, {
    userId: global.userId,
  });
};

export const profileGetSimpleBoundRight = () => {
  return commonHTTPPost(ProfileHTTPPath.GET_SIMPLE_BOUND_RIGHT, {});
};

export const profileGetHealthRecord = () => {
  return commonHTTPPost(ProfileHTTPPath.GET_Health_Record, {
    path: "/ads/family/family_group_month",
    requestParam: {
      operator_no: global.userId,
      month: moment().subtract(1, "months").format("YYYYMM"),
    },
  });
};

export const profileQueryMallOrderStatusNum = () => {
  return commonHTTPPost(ProfileHTTPPath.QUERY_MALL_ORDER_STATUS_NUM, {
    buyerNo: global.userId,
  });
};

export const profileGetTrackPoint = () => {
  return commonHTTPPost(ProfileHTTPPath.GET_TRACK_POINT, {});
};

export const profileRegistraction = () => {
  return commonHTTPPost(ProfileHTTPPath.GET_REGISTRACTION, {
    type: 0,
    action: "order-list",
  });
};

export const profileLoadConfig = (viewFlag: string) => {
  let params = {
    scenario: "MY_PAGE",
    appId: isAndroid() ? "1" : "2",
    configVersion: getRNVersionNum(),
    viewFlag: viewFlag, // 'PRE_VIEW','ON_LINE'
  };
  return commonHTTPPost(ProfileHTTPPath.LOAD_CONFIG, params);
};

export const profileSelectMember = () => {
  const GLOBAL: any = global;
  return commonHTTPPost(ProfileHTTPPath.SELECT_MEMBER, {
    operatorNo: GLOBAL.userId,
  });
};

export const profileAccountInfo = () => {
  return commonHTTPPost(ProfileHTTPPath.ACCONUT_INFO, {
    integralNo: 'JKB0001',
    queryExpireFlag: 0,
  });
};

export const profileGetSelfPatientInfo = () => {
  const GLOBAL: any = global;
  return commonHTTPPost(ProfileHTTPPath.GET_SELF_PATIENT_INFO, {
    operatorNo: GLOBAL.userId,
    traceLogId: parseInt(String(Date.parse(String(new Date())) / 1000)),
  });
};
