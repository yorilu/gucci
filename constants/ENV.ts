

const CONFIG = {
  dev: {
    api: "https://interests-m-dev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/"
  },
  test: {
    api: "https://interests-m-test.billbear.vip/api/",
    assetsHost: "http://ka-img-test.billbear.cn/"
  },
  prev: {
    api: "https://interests-m-prev.billbear.vip/api/",
    assetsHost: "http://ka-img-dev.billbear.cn/"
  },
  prod: {
    api: "https://interests-m.billbear.vip/api",
    assetsHost: "http://ka-img.billbear.cn/"
  }
}

export default function(){
  return CONFIG["prev"]
}