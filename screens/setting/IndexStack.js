import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react'
import ProtoCols from './Protocol'
import Setting from './index'
import RNWebView from './RNWebView'
import { View } from 'react-native'
import About from './about'
import ComplaintFeedback from './ComplaintFeedback'

const Stack = createStackNavigator();

export default class AppRNStack extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"setting"} screenOptions={
                    { header: () => null, animationEnabled: true }
                }>
                    <Stack.Screen name={"protocols"} component={ProtoCols} />
                    <Stack.Screen name={"setting"} component={Setting} />
                    <Stack.Screen name={"rnWebView"} component={RNWebView} />
                    <Stack.Screen name={"about"} component={About} />
                    <Stack.Screen name={"complaintFeedback"} component={ComplaintFeedback} />
                </Stack.Navigator >
            </NavigationContainer>
        )
    }
}