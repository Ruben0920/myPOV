/**
 * The app navigator is used for the primary
 * navigation flows of your app.
 * Generally speaking, it contains an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens" // ensure this path is correct
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAuth } from "app/services/auth/useAuth"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, refer to this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  // * Initial
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  ForgotPassword: undefined
  ResetPassword: undefined
  OneTimePassword: undefined

  // * Logged In

  //! Main
  MainFeed: undefined
  MainChat: undefined
  MainFriendlist: undefined
  MainAccount: undefined

  //! Alter
  AlterFeed: undefined
  AlterChat: undefined
  AlterFriendlist: undefined
  AlterAccount: undefined

  //! Common
  Camera: undefined
  PhotoEditing: undefined
  PostCreation: undefined

  //! Debug / Deprecated
  Home: undefined
  CameraTemp: undefined
  Pillars: undefined
  InitialAccountSetup: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  const { isLoggedIn } = useAuth()

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="MainFeed" component={Screens.MainFeedScreen} />
            <Stack.Screen name="MainChat" component={Screens.MainChatScreen} />
            <Stack.Screen name="MainFriendlist" component={Screens.MainFriendlistScreen} />
            <Stack.Screen name="MainAccount" component={Screens.MainAccountScreen} />

            <Stack.Screen name="AlterFeed" component={Screens.AlterFeedScreen} />
            <Stack.Screen name="AlterChat" component={Screens.AlterChatScreen} />
            <Stack.Screen name="AlterFriendlist" component={Screens.AlterFriendlistScreen} />
            <Stack.Screen name="AlterAccount" component={Screens.AlterAccountScreen} />

            <Stack.Screen name="Camera" component={Screens.CameraScreen} />
            <Stack.Screen name="PhotoEditing" component={Screens.PhotoEditingScreen} />
            <Stack.Screen name="PostCreation" component={Screens.PostCreationScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
            <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={Screens.ForgotPasswordScreen} />
            <Stack.Screen name="OneTimePassword" component={Screens.OneTimePasswordScreen} />
            <Stack.Screen name="ResetPassword" component={Screens.ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
})
