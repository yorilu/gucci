
const env = 'test';

const CONFIG = {
  dev: {
    env,
    api: "https://huafei-dev.billbear.vip",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-dev.billbear.vip/",
    customerId: "1579784156951166977",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login",
    BYN_APP_KEY:"nkvdqe",
    BYN_APP_SECRET:"2d0063ff9424ec1cb9cc3c3d6cdd420f",
    BYN_MIDDLE_PAGE: "https://interests-m-dev.billbear.vip/mall/pages/app-middle/index/?customerId={customerId}",
    TELE_BILL_URL: "https://interests-m-test.billbear.vip/recharge-center/pages/order/index",
    INCOME_URL: "https://46mkls.sda4.top/user/reports?app_key=ejdwle&invite_code=ABLK3Q3",
    OSS_PATH: "https://gucci-app.oss-cn-shanghai.aliyuncs.com",
    REDBAG_URL: "https://engine.tuifish.com/index/activity?appKey=46e6cizaFQyQPGuuxK1wvSvCpTV3&adslotId=444023"
  },
  test: {
    env,
    api: "https://huafei-test.billbear.vip",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-test.billbear.vip/",
    customerId: "1500708711805132802",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login",
    BYN_APP_KEY:"ejdwle",
    BYN_APP_SECRET:"d5a9f83b35b43e1b8b142357ee6bbe39",
    BYN_MIDDLE_PAGE: "https://interests-m-test.billbear.vip/mall/pages/app-middle/index/?customerId={customerId}",
    TELE_BILL_URL: "https://interests-m-test.billbear.vip/recharge-center/pages/order/index",
    INCOME_URL: "https://46mkls.sda4.top/user/reports?app_key=ejdwle&invite_code=ABLK3Q3",
    OSS_PATH: "https://gucci-app.oss-cn-shanghai.aliyuncs.com",
    REDBAG_URL: "https://engine.tuifish.com/index/activity?appKey=46e6cizaFQyQPGuuxK1wvSvCpTV3&adslotId=444023"
  },
  prev: {
    env,
    api: "https://interests-m-prev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-prev.billbear.vip/",
    customerId: "1579784156951166977",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login",
    BYN_APP_KEY:"ejdwle",
    BYN_APP_SECRET:"d5a9f83b35b43e1b8b142357ee6bbe39",
    BYN_MIDDLE_PAGE: "https://interests-m-prev.billbear.vip/mall/pages/app-middle/index/?customerId={customerId}",
    TELE_BILL_URL: "https://interests-m.shanghaibinyu.top/recharge-center/pages/order/index",
    INCOME_URL: "https://46mkls.sda4.top/user/reports?app_key=ejdwle&invite_code=ABLK3Q3",
    OSS_PATH: "https://gucci-app.oss-cn-shanghai.aliyuncs.com",
    REDBAG_URL: "https://engine.tuifish.com/index/activity?appKey=46e6cizaFQyQPGuuxK1wvSvCpTV3&adslotId=444023"
  },
  prod: {
    env,
    api: "https://interests-m.billbear.vip/api/",
    assetsHost: "https://ka-img-dev.billbear.cn/",
    host: "https://interests-m.shanghaibinyu.top/",
    customerId: "1553282691992756226",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login",
    BYN_APP_KEY:"ejdwle",
    BYN_APP_SECRET:"d5a9f83b35b43e1b8b142357ee6bbe39",
    BYN_MIDDLE_PAGE: "https://interests-m.shanghaibinyu.top/mall/pages/app-middle/index/?customerId={customerId}",
    TELE_BILL_URL: "https://interests-m.shanghaibinyu.top/recharge-center/pages/order/index",
    INCOME_URL: "https://46mkls.sda4.top/user/reports?app_key=ejdwle&invite_code=ABLK3Q3",
    OSS_PATH: "https://gucci-app.oss-cn-shanghai.aliyuncs.com",
    REDBAG_URL: "https://engine.tuifish.com/index/activity?appKey=46e6cizaFQyQPGuuxK1wvSvCpTV3&adslotId=444023"
  }
}

const COMMOON = {
  
}

export default function(){
  return CONFIG[env]
}