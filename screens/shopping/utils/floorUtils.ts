import Storage from "../../../tools/Storage";
import { queryStoreSku, shoppingLoadConfig } from "../services";
import { CONSTANTS } from "../constants";
import { convertParams } from "./serviceUtils";

export const getPreviewFlagAndLoadConfig = async (props: any) => {
  return new Promise((resolve, reject) => {
    let params = props?.preview ?? "";
    let preview = params?.length ? params : "ON_LINE";
    // Storage.getMyPagePreview()
    //   .then((res) => {
    //     let viewFlag = "";
    //     if (!res) {
    //       viewFlag = "ON_LINE";
    //     } else if (res !== CONSTANTS.PAGE_NAME) {
    //       viewFlag = "ON_LINE";
    //     } else {
    //       viewFlag = "PRE_VIEW";
    //       Storage.setMyPagePreview("");
    //     }
        shoppingLoadConfig(preview)
          .then((res: any) => {
            if (res?.success) {
              resolve(res);
              Storage.setShoppingPageFloorConfig(res);
            } else {
              Storage.getShoppingPageFloorConfig()
                .then((res) => {
                  if (res?.length) {
                    resolve(res);
                  } else {
                    resolve([]);
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            }
          })
          .catch((err) => {
            Storage.getShoppingPageFloorConfig()
              .then((res) => {
                if (res?.length) {
                  resolve(res);
                } else {
                  resolve([]);
                }
              })
              .catch((err) => {
                reject(err);
              });
          });
      // })
      // .catch((err) => reject(err));
  });
};

export const isHasFloorWithType = (type: string, config: Array<any>) => {
  let isHasFloor = false;
  let floorConfig: any = {};
  config?.map((item: any, index) => {
    if (item?.configKey === type) {
      isHasFloor = true;
      floorConfig = item;
    }
  });
  return { isHasFloor, floorConfig };
};

export const getDetailsWithFloorConfig = (config: any) => {
  return new Promise((resolve, reject) => {
    try {
      let data = config?.elements ?? [];
      let details: Array<any> = [];
      let name: any = {};
      data?.map?.((item: any, index: number) => {
        let tabKey = item?.tabKey ?? "";
        let tabName = item?.tabName ?? "";
        let innerConfigElements = item?.innerConfigElements ?? [];
        if (tabKey?.length && tabName?.length && innerConfigElements) {
          name[tabKey] = tabName;
          if (innerConfigElements?.length) {
            let params = convertParams(innerConfigElements);
            queryStoreSku(params)
              .then((res: any) => {
                if (res?.success) {
                  // console.log(res, index);
                  let result = res?.result ?? [];
                  details[index] = result;
                  if (
                    !details.includes(undefined) &&
                    details?.length === data?.length
                  ) {
                    resolve({
                      name,
                      details,
                    });
                  }
                }
              })
              .catch((err) => {
                console.log(err);
                details[index] = [];
                if (
                  !details.includes(undefined) &&
                  details?.length === data?.length
                ) {
                  resolve({
                    name,
                    details,
                  });
                }
              });
          } else {
            details[index] = [];
            if (
              !details.includes(undefined) &&
              details?.length === data?.length
            ) {
              resolve({
                name,
                details,
              });
            }
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const comparisonArr = (arr: Array<any>) => {
  let comparison: Array<any> = [];
  arr?.map?.((item: any, index: number) => {
    let leftArr: Array<any> = [];
    let rightArr: Array<any> = [];
    item?.map?.((item: any, index: number) => {
      index % 2 ? rightArr?.push?.(item) : leftArr?.push?.(item);
    });
    comparison[index] = [leftArr, rightArr];
  });
  return comparison;
};
