import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity
} from 'react-native';
import { px } from "../../../kit/Util";

interface State {
}

interface Props {
    visible: boolean;
    cancel: any;
    confirm: any
}

export default class DialogModal extends Component<Props, State> {

    render() {
        return (
            <Modal style={styles.container}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.cancel()
                }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                    this.props.cancel()
                }}>
                    <View style={styles.dialogContainer}>
                        <Image style={{ width: px(270), height: px(342) }} source={require('./images/shared_steps_icon.png')} />
                        <Image style={{ width: 30, height: 30, marginTop: 40 }} source={require('./images/shared-step-close.png')} />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },

    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 270,
        height: 120
    },
    contentContainer: {
        flex: 1,
        width: 270,
        height: 75,
        flexDirection: 'row',
        position: "absolute",
        top: 0,
        borderTopColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialogContentTextStyle: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 25,
        marginRight: 25
    },
    btnContainer: {
        flex: 1,
        width: 270,
        height: 45,
        flexDirection: 'row',
        borderTopWidth: 1,
        position: "absolute",
        bottom: 0,
        borderTopColor: '#cccccc',
        alignItems: 'center'
    },
    dialogConfirmButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        borderLeftColor: '#cccccc',
        borderLeftWidth: 1
    },
    dialogCancelButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        borderRightColor: '#cccccc'
    },
    hidemodalTxt: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
        color: '#4fb7f1'
    },
});