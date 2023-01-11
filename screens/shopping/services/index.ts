import { isAndroid, isIOS, Network, NetworkCacheMode } from "@rn-js-kit/lib";
import { RNVERSION } from "../../../../RNVERSION";
import { getRNVersionNum } from "../../../../VERSION";
import { getLogid, getUserId } from "../utils";
import {
  LOAD_CONFIG,
  QUERY_STORE_SKU,
  QUERY_STORE_FREE_SKU,
} from "./constants";

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

export const shoppingLoadConfig = (viewFlag: string) => {
  let params = {
    scenario: "SHOPPING_PAGE",
    appId: isAndroid() ? "1" : "2",
    configVersion: getRNVersionNum(),
    viewFlag: viewFlag,
  };
  return commonHTTPPost(LOAD_CONFIG, params);
};

export const queryStoreSku = async (skus: Array<any>) => {
  let params = {
    operator: await getUserId(),
    queryInventor: true,
    querySkuImg: true,
    putawayStatus: "ONLINE",
    requestSystem: isIOS() ? "ios" : "android",
    traceLogId: getLogid(),
    skus,
  };
  return commonHTTPPost(QUERY_STORE_SKU, params);
};

export const queryFreeStoreSku = async (skus: Array<any>) => {
  let params = {
    operator: await getUserId(),
    queryInventor: true,
    querySkuImg: true,
    requestSystem: isIOS() ? "ios" : "android",
    traceLogId: getLogid(),
    skus,
  };
  return commonHTTPPost(QUERY_STORE_FREE_SKU, params);
};
