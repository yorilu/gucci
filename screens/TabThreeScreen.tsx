import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import Webview from './webview/index'
import { Text, View } from '../components/Themed';
import Utils from '../utils/index'
import WebView from '../components/WebView/index';
import getEnv from '../constants/ENV';

const { getUrlWithHost , goWebView} = Utils;
const {customerId, TELE_BILL_URL} = getEnv();
const uri = `${TELE_BILL_URL}?customerId=${customerId}`;

export default function TabTwoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <WebView uri={uri} navigation={navigation}></WebView>
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
