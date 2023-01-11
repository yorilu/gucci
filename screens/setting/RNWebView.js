import React, { forwardRef, useEffect } from "react";
import {
    View,
} from "react-native";
import { Header, } from './index'
import { WebView } from 'react-native-webview';


export default class RNWebView extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { navigation } = this.props
        const { title, url } = this.props.route.params
        return (<View style={{ flex: 1,backgroundColor:'#F7F7F7' }}>
            <Header title={title} />
            <WebView source={{ uri: url }} style={{backgroundColor:"#F7F7F7"}} />
        </View>)
    }
}