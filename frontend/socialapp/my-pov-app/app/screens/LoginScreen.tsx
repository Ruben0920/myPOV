import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Image, ImageStyle, View, ViewStyle, TextInput, TextStyle, TouchableOpacity } from "react-native";
import { AppStackScreenProps } from "../navigators";
import { spacing } from "../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Button } from 'app/components/Button';

const welcomeFace = require("../../assets/images/welcome-face.png");

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({
  navigation,
}) {
  

  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword)
  }



  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeFace} resizeMode="contain" />
        <TextInput 
        style={$input} 
        placeholder="Email" />
        <View style={$passwordInputContainer}>
          <TextInput
            style={$passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={$showHideButton}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color={"rgba(25, 16, 21, 0.5)"} />
          </TouchableOpacity>
        </View>
        
          <Button  
          text="Log In" 
          onPress={() => navigation.navigate("Home")} 
          style={$loginButton}
          />
        
        

        <View >
          <Button 
          text="Create New Account" 
          onPress={() => navigation.navigate("SignUp")} 
          style={$RegisterButton}
          />
        </View>
      </View>
    </View>
  );
});

const $container: ViewStyle = {
  flex: 1,
};

const $topContainer: ViewStyle = {
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: spacing.xl,
  paddingHorizontal: spacing.lg,
};

const $input: TextStyle = {
  width: "80%",
  borderWidth: 1,
  borderRadius: 8,
  padding: spacing.md,
  marginVertical: spacing.sm,
  fontSize: 28,
  
};

const $passwordInputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "80%",
  borderWidth: 1,
  borderRadius: 8,
  padding: spacing.md,
  marginVertical: spacing.sm,
};

const $passwordInput: TextStyle = {
  flex: 1,
  fontSize: 28,
};

const $showHideButton: ViewStyle = {
  padding: spacing.sm,
};

const $welcomeLogo: ImageStyle = {
  height: 500,
  width: 500,
  marginBottom: spacing.md,
};

const $RegisterButton: ViewStyle = {
  padding: spacing.md,
  borderRadius: 8,
  marginTop: spacing.md,
  justifyContent: "flex-end",
  backgroundColor:"transparent",
  borderColor:"transparent"
}
const $loginButton: ViewStyle = {
  padding: spacing.md,
  borderRadius: 8,
  marginTop: spacing.md,
};