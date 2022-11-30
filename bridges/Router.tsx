/*
 * @Author: your name
 * @Date: 2021-03-18 14:00:48
 * @LastEditTime: 2021-04-07 18:16:14
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /rn-medical-home/src/bridge/RouterBridge.tsx
 */
import { NativeModules, Platform } from 'react-native'

const { RouterModule, RNRouterModule } = NativeModules
export enum VIEW_TYPE{
    RN = "rn",
    H5 = "h5",
    NATIVE = "native",
    WX_MINI ="wx_mini",
    CALLBack ="callback"

}

export enum VIEW_NAME{
    MAIN = "Main",
}

export function openPage(params: { pluginId: string, componentName: string, pageTag: string, params?: any | null }) {
    if(Platform.OS=="ios"){
        RouterModule &&RouterModule.openPage(params);
    }else{
        RNRouterModule &&RNRouterModule.openPage(params);
    }   
}
export function jumpToView(viewType:VIEW_TYPE,viewName:string,url:string,params:object){
    console.log("jumpToView", viewName, url);
    RouterModule && RouterModule.jumpToView(viewType,viewName,url,params)
    console.log("jumpToView end");
}
export function closeCurrentView(){
    RouterModule && RouterModule.closeCurrentView();
}
export function absoluteURLString(urlString:String,  callback: (res: any) => {}){
    RouterModule && RouterModule.absoluteURLString(urlString)
    .then((status: any) => {
        console.log('11122=='+JSON.stringify(status));
        callback(status);
    })
    .catch((e: any) => {
        console.log('11133=='+JSON.stringify(e));
    })
   
}