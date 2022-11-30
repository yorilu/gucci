

const CONFIG = {
  dev: {
    api: "https://interests-m-dev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-dev.billbear.vip/",
    customerId: "1579784156951166977"
  },
  test: {
    api: "https://interests-m-test.billbear.vip/api/",
    assetsHost: "http://ka-img-test.billbear.cn/",
    host: "https://interests-m-test.billbear.vip/",
    customerId: "1579784156951166977"
  },
  prev: {
    api: "https://interests-m-prev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/",
    host: "https://interests-m-prev.billbear.vip/",
    customerId: "1579784156951166977"
  },
  prod: {
    api: "https://interests-m.billbear.vip/api",
    assetsHost: "http://ka-img.billbear.cn/",
    host: "https://interests-m.billbear.vip/",
    customerId: "1579784156951166977"
  }
}

export default function(){
  return CONFIG["prev"]
}