/*
 * @Author: your name
 * @Date: 2021-03-18 14:00:48
 * @LastEditTime: 2021-03-25 12:56:23
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /rn-medical-home/src/pages/my/indexStack.js
 */
import React from 'react'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserInfo from './UserInfo'
import NameEdit from './NameEdit'

const Stack = createStackNavigator();

export default class UserRNStack extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"UserInfo"} screenOptions={
                    { header: () => null, animationEnabled: true }
                }>
                    <Stack.Screen name={"UserInfo"} component={UserInfo} />
                    <Stack.Screen name={"NameEdit"} component={NameEdit} />
                </Stack.Navigator >
            </NavigationContainer>
        )
    }
}