import { rnHandleScheme } from "../../../bridge/rn-scheme";
import { SHANTAI_DOMAIN } from "../../../config";

export const toJumpGoodDetail = (spuId: string, storeNo: string) => {
  let url = `${SHANTAI_DOMAIN}commonh5/#/goods-detail?spuId=${spuId}&storeNo=${storeNo}`;
  rnHandleScheme(url);
};

export const toJumpCart = () => {
  let url = `${SHANTAI_DOMAIN}universe/#/cart`;
  rnHandleScheme(url);
};

export const toJumpSearch = () => {
  let url = `${SHANTAI_DOMAIN}universe/#/search`;
  rnHandleScheme(url);
};
