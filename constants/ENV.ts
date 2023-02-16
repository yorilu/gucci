

const CONFIG = {
  dev: {
    api: "https://interests-m-dev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-dev.billbear.vip/",
    customerId: "1579784156951166977",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login"
  },
  test: {
    api: "https://interests-m-test.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-test.billbear.vip/",
    customerId: "1500708711805132802",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login"
  },
  prev: {
    api: "https://interests-m-prev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-prev.billbear.vip/",
    customerId: "1579784156951166977",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login"
  },
  prod: {
    api: "https://interests-m.billbear.vip/api/",
    assetsHost: "https://ka-img-dev.billbear.cn/",
    host: "https://interests-m.shanghaibinyu.top/",
    customerId: "1553282691992756226",
    biyingApi: "http://v3.biyingniao.com/api/v3/auth/union_login"
  }
}

export default function(){
  return CONFIG["prod"]
}