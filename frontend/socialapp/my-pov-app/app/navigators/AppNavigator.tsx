/**
 * The app navigator is used for the primary
 * navigation flows of your app.
 * Generally speaking, it contains an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { useColorScheme } from "react-native";
import * as Screens from "app/screens"; // ensure this path is correct
import Config from "../config";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";

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
  Welcome: undefined;
  CameraTemp: undefined;
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={Screens.WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Screens.LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={Screens.SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Screens.HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraTemp"
        component={Screens.CameraTempScreen}
        options={{ headerShown: false }}
      />
      {/* Add other main screens here */}
    </Stack.Navigator>
  );
};

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps
) {
  const colorScheme = useColorScheme();
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));
  

  return (  
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >   
          <>
            <Stack.Screen name="Home" component={MainNavigator} />
          </>
        
          <Stack.Screen name="Login" component={AuthNavigator} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
});
