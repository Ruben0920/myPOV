import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Image, ImageStyle, View, ViewStyle, TextInput, TextStyle, TouchableOpacity, Text } from "react-native";
import { AppStackScreenProps } from "../navigators";
import { spacing } from "../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Button } from 'app/components/Button';
import { saveData} from "app/utils/storage/securestore";
import hashPassword from "app/utils/Crypto/hashPassword";




const welcomeFace = require("../../assets/images/welcome-face.png");

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({
  navigation,
}) {
    
 
  const [errorMessage, setErrorMessage] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword)
  }

  const handleLogIn = async() => {
    if (username === "" || password === "") {
       setErrorMessage(true)} else{
        const hashedPassword = hashPassword(password);
  
       
    
    
    const userData = {
      username: username,
      password: hashedPassword,  
    };
  

    console.log('UserData before fetch:', userData);
  try {
    console.log('Requestiong from "http://10.0.2.2:8000/users/login/"...')
    const response = await fetch('http://10.0.2.2:8000/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(response => {
      if(!response.ok){
        
        throw new Error("Repose failed (need to check errors)")
      }else{ return response.json()}
        
      
    }).then(data =>{
      const refresh = data.refresh;
      const access = data.access;
      saveData("refreshToken",refresh);
      saveData("accessToken",access);
      navigation.navigate("Home")
    });
     
  } catch (error) {
    console.error('Fetch error:', error);
  };
  
};
  };



  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeFace} resizeMode="contain" />
        <TextInput 
        style={$input} 
        placeholder="Username"
        onChangeText={setUsername}
         />
        <View style={$passwordInputContainer}>
          <TextInput
            style={$passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          {errorMessage?<Text style={$errorText}>{"Invalid credentials"}</Text> : null}
          <TouchableOpacity onPress={togglePasswordVisibility} style={$showHideButton}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color={"rgba(25, 16, 21, 0.5)"} />
          </TouchableOpacity>
        </View>
        
          <Button  
          text="Log In" 
          onPress={handleLogIn} 
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

const $errorText: TextStyle = {
  color: 'red',
  margin: spacing.md
};