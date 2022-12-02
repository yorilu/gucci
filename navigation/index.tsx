/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/index/index';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import TabFourScreen from '../screens/TabFourScreen';
import WebViewScreen from '../screens/webview/index'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';


//theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="WebView" component={WebViewScreen} options={{ title: 'webview' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="HOME"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: '商城',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} size={26}/>,
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate('Modal')}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}>
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
      <BottomTab.Screen
        name="Cata"
        component={TabTwoScreen}
        options={{
          title: '分类',
          tabBarIcon: ({ color }) => <Entypo name="grid" color={color} size={26}/>,
        }}
      />
      <BottomTab.Screen
        name="Cart"
        component={TabThreeScreen}
        options={{
          title: '购物车',
          tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" color={color} size={26}/>,
        }}
      />
      <BottomTab.Screen
        name="Mine"
        component={TabFourScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <AntDesign name="user" color={color}  size={26}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
