import { observer } from "mobx-react-lite";
import React, { FC, useEffect } from "react";
import { View,Text, ViewStyle } from "react-native";
import { AppStackScreenProps } from "../navigators";


interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {};

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) { 

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // 3 seconds delay before navigating to the login screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={$container}>
      <Text>MyPOV</Text>
    </View>
  )





});

const $container: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
 }