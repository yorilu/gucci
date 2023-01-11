import { isAndroid } from "@rn-js-kit/lib";
import { ENV } from "../../../config";

export const MY_SERVICE = [
  {
    title: "我的问诊",
    key: "myInquiryUrl",
    icon: require('../images/my_visits.png'),
  },
  {
    title: "我的用药",
    key: "myPrescriptionUrl",
    icon: require('../images/my_prescription.png'),
  },
  {
    title: "挂号记录",
    key: "",
    icon: require('../images/my_register.png'),
  },
  {
    title: "我的就医",
    key: "myPhysicalUrl",
    icon: require('../images/my_expert.png'),
  },
  {
    title: "我的体检",
    key: "myHealthExaminationUrl",
    icon: require('../images/my_examination.png'),
  },
  {
    title: "我的齿科",
    key: "myDentistry",
    icon: require('../images/my_dentistry.png'),
  },
  {
    title: "企业服务",
    key: "enterpriseService",
    icon: require('../images/my_enterpriseService.png'),
  },
  {
    title: "我的医美",
    key: "myBeautiful",
    icon: require('../images/my_beautiful.png'),
  },
];

export const ORDER_CENTER = [
  {
    title: "待付款",
    key: "orderForPayUrl",
    icon: require('../images/my_paymenting.png'),
  },
  {
    title: "待发货",
    key: "orderSendUrl",
    icon: require('../images/my_delivering.png'),
  },
  {
    title: "待收货",
    key: "orderGoodsUrl",
    icon: require('../images/my_receiving.png'),
  },
  {
    title: "待评价",
    key: "orderCommentUrl",
    icon: require('../images/my_evaluating.png'),
  },
  {
    title: "退款/售后",
    key: "orderRefundUrl",
    icon: require('../images/my_refund.png'),
  },
];

export const TOOLS = (ENV === 'prod')?[
  {
    title: "我的地址",
    key: "myAddressUrl",
    icon: require('../images/my_address.png'),
  },
  {
    title: "健康档案",
    key: "healthArchivesUrl",
    icon: require('../images/my_healthrecord.png')
  },
  {
    title: "客服服务",
    key: "customerService",
    icon: require('../images/my_customerservice.png')
  },
]:(isAndroid()?[
  {
    title: "我的地址",
    key: "myAddressUrl",
    icon: require('../images/my_address.png'),
  },
  {
    title: "健康档案",
    key: "healthArchivesUrl",
    icon: require('../images/my_healthrecord.png')
  },
  {
    title: "客服服务",
    key: "customerService",
    icon: require('../images/my_customerservice.png')
  },
  {
    title: "调试中心",
    key: "",
    icon: require('../images/my_prescription.png')
  },
  {
    title: "打开RN调试",
    key: "",
    icon: require('../images/my_prescription.png')
  },
  {
    title: "打开视频",
    key: "",
    icon: require('../images/my_prescription.png')
  }
]:[
  {
    title: "我的地址",
    key: "myAddressUrl",
    icon: require('../images/my_address.png'),
  },
  {
    title: "健康档案",
    key: "healthArchivesUrl",
    icon: require('../images/my_healthrecord.png')
  },
  {
    title: "客服服务",
    key: "customerService",
    icon: require('../images/my_customerservice.png')
  },
  {
    title: "调试中心",
    key: "",
    icon: require('../images/my_prescription.png')
  },
  {
    title: "文件目录",
    key: "",
    icon: require('../images/my_prescription.png')
  },
]);

export const HEADER_BOTTOM = [
  {
    title: "卡包",
    key: "myCardsUrl",
  },
  {
    title: "优惠券",
    key: "couponUrl",
  },
  {
    title: "权益",
    key: "rightsUrl",
  },
];

export const BANNER = [
  {
    title: "购买",
    key: "buyRightsUrlv2",
  },
  {
    title: "查看",
    key: "jumpMemberUrlv2",
  },
];
