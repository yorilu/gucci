import React, { forwardRef,Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { px } from "../../kit/Util";
import { ScreenInfo,statusBarHeight } from "../../kit/PlotformOS";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { type = "left", navigation, onBack, title, backgroundColor = "#FAFAFA", rightContent, style } = this.props;
        let icon;
        if (type == "left") {
            icon = require("../images/home/arrowBack.png");
        }else if(type=="closePage"){
            icon = require("../images/right_icon.png");
        }else {
            icon = require("../images/right_icon.png");
        }
        return (
            <View style={styles.nav}>
                <View style={{ width: ScreenInfo.width, height: statusBarHeight() }} />
                <View style={styles.navBarContain}>
                    <TouchableOpacity style={styles.leftPosit}
                        onPress={() => {
                            if (onBack) {
                                onBack();
                            } else {
                                navigation && navigation.pop()
                            }
                        }}
                    >
                        <Image resizeMode={'contain'} style={styles.leftIcon} source={icon} />
                    </TouchableOpacity>
                    <Text style={{ alignSelf: "center", fontSize: 18, color: "#333" }}>{title}</Text>
                    {rightContent ? <View style={styles.rightContent}>{rightContent}</View> : null}
                </View>
            </View>   
        );
  }
}

  const styles = StyleSheet.create({
    nav: {
      width: ScreenInfo.width,
      backgroundColor: '#FFF'
    },
    navBarContain: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: px(45)
    },
    leftIcon: {
      width: px(11),
      height: px(20),
      tintColor: '#666',
      transform: [{
          rotate: '180deg'
      }]
    },
    leftPosit: {
        position: 'absolute',
        width: px(40),
        height: px(45),
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
    },
    rightContent: {
        position: "absolute",
        right: px(22),
    },
})