/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"

//custom 
import Icon from "react-native-vector-icons/FontAwesome5"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  // 🔥 Your screens go here
  CameraTemp: undefined
	// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}
//tab navigator
const Tab = createBottomTabNavigator<AppStackParamList>()

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
      headerShown:false,
      tabBarShowLabel:false,
      tabBarStyle:{height:50},
      tabBarActiveTintColor: '#e91e63',
      lazy:false
    }}
    initialRouteName="Welcome">

        <Tab.Screen
        name="Welcome"
        component={Screens.WelcomeScreen}
        options={{
          tabBarIcon: ({color, size}) => <Icon name="home" size={size} color={color} />,
          title: "Home",
        }}
      />
      
        <Tab.Screen
        name="CameraTemp"
        component={Screens.CameraTempScreen}
        options={{
          tabBarIcon: ({color, size}) => <Icon name="camera" size={size} color={color}  />,
          title: "Camera",
        }}
      />

    </Tab.Navigator>

  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
