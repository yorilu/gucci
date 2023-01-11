/*
 * @Description: 
 * @Version: 2.0
 * @Autor: cmg
 * @Date: 2021-07-05 10:44:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-23 11:24:03
 */
import React from "react";
import {
    View,
    Dimensions,
    StyleSheet,
    Platform,
    NativeModules,
    ActivityIndicator,
    Modal,
    DeviceEventEmitter,
    Image,
    AsyncStorage,
    TouchableOpacity,
} from "react-native";
import Text from "../../../component/Text";
import { px } from "../../../kit/Util";
import { screenWidth, screenHeight } from "../../../tools/device";
import { FILES_PUBLIC, SHANTAI_DOMAIN } from '../../../config'
import { PageRouter } from '@rn-js-kit/lib'
import PlaceholderImage from '../../../component/common/PlaceholderImage';
import DialogModal from './DialogModal'


const rightSteps = [
    {
        title: '选择家人',
        iconUrl: require("./images/familyMember.png"),
        showNext: true
    },
    {
        title: '微信分享',
        iconUrl: require('./images/wechatIcon.png'),
        showNext: true
    },
    {
        title: '授权绑定',
        iconUrl: require('./images/bindRights.png'),
        showNext: true
    },
    {
        title: '共享权益',
        iconUrl: require('./images/shareRights.png'),
        showNext: false
    },
]



export default class FamilyMember extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isNotShowTips: false,
            isShowDialog:false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("isNotShowFMTips").then((value) => {
            if (!value) {
                this.setState({
                    isNotShowTips: false
                })
            } else {
                this.setState({
                    isNotShowTips: true
                })
            }

        })
    }

    didPressAvatar = (person) => {
        AsyncStorage.setItem("isNotShowFMTips", '1');
        if (!this.state.isNotShowTips) {
            this.setState({
                isNotShowTips: true
            })
        }

        const { doctor, bound, group, vip = false } = this.props.right;
        if (!group || !person) {
            return null;
        }
        const {
            groupId
        } = group || {};

        const { personId, headPic ,userId} = person

        let jumpurl = SHANTAI_DOMAIN + `health_report/#/report?pid=${personId}&gid=${groupId}&op=${userId}&avatar=${headPic || ''}`
        PageRouter.openH5Page(jumpurl)
    }

    didPressAdd = () => {
        const { familyInterestsId,group={},doctor={} } = this.props.right;
        const jumpUrl = `/subpackages/invite-family/choose-relation/index?doctorId=${doctor.doctorId}&groupId=${group.groupId}&interestsId=${familyInterestsId}`;
        PageRouter.openMiniPage(jumpUrl);
        // let jumpurl = SHANTAI_DOMAIN + `commonh5/index.html#/inviteaddtag?interestsId=${familyInterestsId}`
        // PageRouter.openH5Page(jumpurl)

    }

    renderBottomtips() {
        return (
            <View>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: px(300), height: px(12) }} source={require("./images/share-right.png")} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: px(22), marginBottom: px(15) }}>
                    {rightSteps.map((item, index) => {
                        const { title, iconUrl, showNext } = item;
                        return (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <View style={{ height: px(60), width: px(60), justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ height: px(20), width: px(20) }} source={iconUrl} />
                                    <Text style={{ color: '#666666', fontFamily: "PingFangSC-Regular", fontSize: px(10), marginTop: px(12) }}>{title}</Text>
                                </View>
                                {showNext && <Image style={{ width: 6, height: 10, marginHorizontal: px(6), marginBottom: 20 }} source={require("./images/invite-arrow.png")} />}
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    render() {
        const { doctor, bound, group, vip = false } = this.props.right;
        if (!group) {
            return null;
        }
        const { name = "", title, levelName, workYears, imgUrl } = doctor || {};
        const {
            groupName,
            persons = [],
            personLimit,
            personCount,
            addPersonRemainder,
        } = group || {};

        //新增逻辑判断当前如果的权益只有一个坑就不展示添加家人入口
        if (personLimit <= 1) {
            return null;
        }

        let ps = [].concat(persons || []) || [];
        if (addPersonRemainder) {
            for (let i = 0; i < Math.min(personLimit, 8) - personCount; i++) {
                ps.push({
                    isAddBtn: true,
                    name: "亲友",
                    imgUrl: "",
                });
            }
        }

        //显示addbutton
        let isShowAdd = addPersonRemainder && (personLimit < 8);

        let itemWidth = { width: (screenWidth - px(61)) / 4 }

        return (
            <View style={Styles.mainContainer}>
                <View style={Styles.mainHeader}>
                    <Text style={Styles.titleText}>我的家
                        {/* <Text style={Styles.titleSubText}>{' | 家人的权益'}</Text> */}
                    </Text>
                    <TouchableOpacity style={{height:px(28),flexDirection:'row',alignItems:'center',justifyContent:'center'}} onPress={this.showDialog} activeOpacity={0.8}>
                        <Text style={{color:'#999',fontSize:12}}>{'如何与亲友共享权益'}</Text>
                        <Image style={{width:px(14),height:px(14),marginLeft:5}} source={require('./images/right_tag_icon.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={Styles.subContainerBg}>
                    <View style={Styles.itemContainerBG}>
                        {ps.map((person, index) => {
                            let remind = index % 4
                            let marginLeftAdd = remind == 0 ? { marginLeft: px(14) } : {}
                            if (!person.isAddBtn) {
                                let url = FILES_PUBLIC + person.headPic
                                return (
                                    <TouchableOpacity key={index + '21'} style={[Styles.itemContainer, itemWidth, marginLeftAdd]} onPress={() => {
                                        this.didPressAvatar(person)
                                    }}>
                                        <PlaceholderImage style={Styles.itemAvatar} source={{ uri: url }} placeholderStyle={Styles.itemAvatar} placeholderSource={require("./images/avatar-default.png")} />
                                        <Text numberOfLines={1} style={Styles.itemPersonText} >{person.name}</Text>
                                    </TouchableOpacity>)
                            } else {
                                return (
                                    <TouchableOpacity key={index + '2'} style={[Styles.itemContainer, itemWidth, marginLeftAdd]} onPress={this.didPressAdd}>
                                        <View style={{ width: px(44), height: px(44), borderRadius: px(22), backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image style={{ width: px(12), height: px(13) }} source={require("./images/family_member_plus.png")} />
                                        </View>
                                        <Text style={Styles.itemAddText} >{person.name}</Text>
                                    </TouchableOpacity>)
                            }
                        })}
                    </View>
                    {!this.state.isNotShowTips && < Image style={{ position: 'absolute', left: px(16), width: px(136), height: px(34) }} source={require("./images/guide_tips.png")} />
                    }
                    {/* {isShowAdd && <View>
                        <TouchableOpacity onPress={this.didPressAdd} style={{ height: px(44), marginHorizontal: px(22), backgroundColor: '#FCE8C4', borderRadius: px(22), marginBottom: px(20), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'PingFangSC-Semibold', color: '#6D4024', fontSize: px(14) }}>邀请家人共享权益</Text>
                        </TouchableOpacity>
                    </View>} */}
                    {/* {vip && this.renderBottomtips()} */}
                    
                </View>
                <DialogModal
                    confirm={this.ensureDialog}
                    cancel={this.cancelDialog}
                    visible={this.state.isShowDialog}/>
            </View >
        )
    }

    // 确认
    ensureDialog=()=> {
        this.setState({isShowDialog: false});
    }

    //取消
    cancelDialog=()=> {
        this.setState({isShowDialog: false});
    }

    showDialog=()=>{
        this.setState({isShowDialog: true});
    }
}

const Styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        marginTop: px(20),
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: {
            width: px(0),
            height: px(5),
        },
        shadowOpacity: 0.4,
    },
    mainHeader: {
        flexDirection: 'row',
        marginHorizontal: px(19),
        justifyContent: 'space-between',
        alignItems:'center'
    },
    titleText: {
        color: '#222222',
        fontSize: px(18),
        textAlignVertical: 'bottom',
        fontWeight: 'bold',
        includeFontPadding:false,
    },
    titleSubText: {
        color: '#B1B2B1',
        fontSize: 14,
        marginLeft: px(5),
    },
    subContainerBg: {
        backgroundColor: '#ffffff',
        borderRadius: px(8),
        marginHorizontal: px(19),
        marginTop: px(10),
        elevation: px(2),
    },
    itemContainerBG: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: px(30),
        marginBottom: px(20)
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px(90),
    },
    itemAvatar: {
        width: px(44),
        height: px(44),
        borderRadius: px(22)
    },
    itemPersonText: {
        paddingTop: px(15),
        fontSize: 14,
        color: "#222222",
        fontFamily: 'PingFangSC-Medium'
    },
    itemAddText: {
        paddingTop: px(15),
        fontSize: 14,
        color: "#999999",
        fontFamily: 'PingFangSC-Regular'
    }

})