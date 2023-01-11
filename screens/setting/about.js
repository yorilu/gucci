/*
 * @Author: your name
 * @Date: 2021-03-03 10:20:22
 * @LastEditTime: 2021-03-03 10:23:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /rn_im_doctor/src/pages/setting/Protocol.js
 */
import React from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    NativeModules,
    Image,
    Text
} from "react-native";
import { px } from "../../kit/Util";
import { Header } from './index'

const { RouterModule } = NativeModules

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: '',
            build: ''
        }
    }
    async componentDidMount() {
        try {
            let versionInfo = await RouterModule.appVersionInfo()
            this.setState({
                version: versionInfo.Version,
                build: versionInfo.Build
            })
        } catch (error) {
            console.log(error)
        }

    }


    render() {
        const { version, build } = this.state;
        return (<View style={{ flex: 1, }}>
            <Header title={"关于"} />
            <ScrollView contentContainerStyle={styles.contaner}>
                <Image style={{ width: px(100), height: px(100) }} source={require('../images/home/about.png')} />
                <Text style={{ color: '#333', fontSize: 20, fontWeight: 'bold', marginTop: px(30) }}>太医管家</Text>
                <Text style={{ fontSize: '#333', fontSize: 14, marginVertical: px(10) }}>Version {version}</Text>
                <Text style={{ fontSize: '#333', fontSize: 14 }}>build {build}</Text>
            </ScrollView>
        </View>)
    }
}

const styles = StyleSheet.create({
    contaner: {
        paddingTop: px(10),
        backgroundColor: '#FFF',
        alignItems: 'center',
        // justifyContent: 'center', 
        flex: 1,
        borderTopWidth: px(1),
        borderTopColor: '#eee',
        paddingTop: px(100)
    }
})