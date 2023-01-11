import { NativeModules } from "react-native";

const { RNLoginModule } = NativeModules;

export const convertParams = (arr: Array<any>) => {
  let res: Array<any> = [];
  arr?.map?.((item, index) => {
    let merchantId = item?.merchantId ?? "";
    let storeId = item?.storeId ?? "";
    res?.push?.({
      skuId: merchantId,
      storeNo: storeId,
    });
  });
  return res;
};

export const getLogid = () => {
  try {
    return `ntfd_${new Date().getTime()}${getRandom(0, 1000)}`;
  } catch (err) {
    return new Date().getTime();
  }
};

export const getUserId = async () => {
  try {
    let data = await RNLoginModule.getUserInfo();
    const userInfo = JSON.parse(data) || {};
    return userInfo.operatorNo;
  } catch (error) {
    return error;
  }
};

function getRandom(min: number, max: number) {
  let res = 0;
  switch (arguments.length) {
    case 1:
      res = parseInt(String(Math.random() * min + 1), 10);
      break;
    case 2:
      res = parseInt(String(Math.random() * (max - min + 1) + min), 10);
      break;
    default:
      res = 0;
      break;
  }
  return res;
}
