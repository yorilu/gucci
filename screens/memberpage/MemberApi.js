/*
 * @Description: 
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-01 11:50:35
 * @LastEditors: cmg
 * @LastEditTime: 2021-09-07 16:56:23
 */

import { Network } from "@rn-js-kit/lib";
import { httpPost } from "../../bridge/CommonRequestBridge";


export default class MemberApi {

    static getElements(params) {
        // 获取页面的元素接口  params 包含以下的参数
        // appId: getAppId(),
        // scenario: "MEMBERPAGE",
        // appVersion: getAppVersion(),
        // return httpPost("api/active-query/familyMember/getMemberConfig", {}, params)
        return Network.post({ url: "api/active-query/familyMember/getMemberConfig", params });

    }

    //获取权益信息
    static getSelfInheritedRights() {
        return Network.post({ url: "api/active-query/familyMember/getSelfInheritedRights", params: { limit: 100 } });
    }

    //领取权益
    static currentMarketing(params) {
        return Network.post({ url: "api/marketing-product/marketing/current/currentMarketing", params });
    }

    //获取banner数据
    static getInsuranceBanner(params) {
        return Network.post({ url: "api/active-query/familyMember/getInsuranceBanner", params });
    }

}
