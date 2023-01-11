import { PageRouter, SchemeService } from '@rn-js-kit/lib';
import { NativeModules, Platform } from "react-native";

const { ConfigureModule } = NativeModules;

export function configureWithKey(keyStr: string) {
  let schemeStr = `taiyi://config/query?keys=${encodeURIComponent(JSON.stringify([keyStr]))}`
  return SchemeService.handleScheme(schemeStr)
}

export function onOpenDebuggingCenter() {
  return ConfigureModule && ConfigureModule.onOpenDebuggingCenter();
}

export function onOpenFileDirectory() {
  return ConfigureModule && ConfigureModule.onOpenFileDirectory();
}

export function onOpenRNDebug() {
  return ConfigureModule && ConfigureModule.onOpenRNDebug();
}

export function onOpenVideo() {
  return ConfigureModule && ConfigureModule.onOpenVideo();
}
