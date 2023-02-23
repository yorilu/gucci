import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import Webview from './webview/index'
import { Text, View } from '../components/Themed';
import Utils from '../utils/index'
import WebView from '../components/WebView/index';
import getEnv from '../constants/ENV';

const {customerId, INCOME_URL} = getEnv();
const { getUrlWithHost , goWebView} = Utils;
const uri = getUrlWithHost("mall/pages/category/index");
console.log("==uri===", uri);

export default function TabTwoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <WebView uri={INCOME_URL} navigation={navigation}></WebView>
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    height: 500,
    width: 500
  },
  container: {
    flex: 1
  }
});
