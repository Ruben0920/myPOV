import { observer } from "mobx-react-lite";
import React, { FC, useState} from "react";
import { Image, View, TextInput, Text } from "react-native";
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen } from 'app/components';
import AuthService from "app/services/auth/AuthService";
import { useAuth } from "app/services/auth/useAuth";
import { AppStyles } from "app/theme/AppStyles";

const logo = require("../../assets/images/LogoTemp.png");


interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = observer(function ForgotPasswordScreen({
  route,navigation,
}) {
  const params = route.params;
  //const {loggedIn} = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [hasError, setHasError] = React.useState<boolean | undefined>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword);
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
 
  const handleResetPassword = async() =>{
    setHasError(false);
    if (validateEmail(email)){
      //get and set otp 
      navigation.navigate("OneTimePassword")

    }else{
      setHasError(true);
      setErrorMessage("Invalid Email");
    }
  }

  return (
    <Screen 
      preset="fixed"
      contentContainerStyle={AppStyles.container}
      safeAreaEdges={["top", "bottom"]}
    >
        <Image style={AppStyles.welcomeLogo} source={logo} resizeMode="contain" />
        <View style={AppStyles.InputContainer}>
          <TextInput 
        style={AppStyles.input} 
        placeholder="Email"
        placeholderTextColor={"#CAC4CE"}
        onChangeText={setEmail}
         />
        </View>
        
          <Button  
          text="Reset Password" 
          textStyle={AppStyles.ButtonText}
          onPress={handleResetPassword}
          style={AppStyles.MainButton}
          pressedStyle={AppStyles.MainButton}
          />
          <Button  
          text="Log In" 
          textStyle={AppStyles.ButtonText}
          onPress={() => navigation.navigate("Login")}
          style={AppStyles.SecondaryButton}
          pressedStyle={AppStyles.SecondaryButton}
          />
        <View >
          <Button 
          text="Create New Account" 
          textStyle={AppStyles.ButtonText}
          onPress={() => navigation.navigate("SignUp")} 
          style={AppStyles.SecondaryButton}
          pressedStyle={AppStyles.SecondaryButton}
          />
        </View>
        {hasError ? <Text style={AppStyles.ErrorText}>{errorMessage}</Text> : null}
    </Screen>
  );
});
