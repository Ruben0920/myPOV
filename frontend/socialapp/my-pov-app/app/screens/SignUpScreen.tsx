import React, { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import { ViewStyle, TextInput, View, TextStyle, Text} from "react-native";
import { spacing } from "../theme";
import { AppStackScreenProps } from "app/navigators";
import { Screen, TextField, Button,} from "app/components";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { saveData } from "app/utils/storage/securestore";
import hashPassword from "app/utils/Crypto/hashPassword";



interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({
  navigation,
}) {

  // const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = React.useState<string>("");
  const [userError, setUserError] = React.useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword)
  };
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    return usernameRegex.test(username);
};

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};





  const handleSignUp = async() => {
    setUserError(false)
    setEmailError(!validateEmail(email) ? 'Invalid email format' : '');
    setUsernameError(!validateUsername(username) ? 'Username must start with a letter' : '');
    setPasswordError(!validatePassword(password) ? 'Password must be at least 6 characters and match' : '');
    setPasswordMatchError(!validatePasswordMatch(password, confirmPassword)? "Passwords do not match" : '');

    if (validateEmail(email) && validateUsername(username) && validatePassword(password) && validatePasswordMatch(password, confirmPassword)) {
    
      const hashedPassword = hashPassword(password);

    const userData = {
        email: email,
        username: username,
        password: hashedPassword,  
      };

      console.log('UserData before fetch:', userData);
    try {
      console.log('Requestiong from "http://10.0.2.2:8000/users/signup/"...')
      const response = await fetch('http://10.0.2.2:8000/users/signup/', {
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
    <Screen 
    preset="auto"
    contentContainerStyle={$topContainer}
    safeAreaEdges={["top", "bottom"]}
    >
      <View style={$InputContainer}>
        <TextField 
        style={$input}
        placeholder="Email" 
        onChangeText={setEmail}
        />{userError ? <Text style={$errorText}>{emailError}</Text> : null}
      </View>

      <View style={$InputContainer}>
        <TextInput 
        style={$input} 
        placeholder="Username"
        onChangeText={setUsername} 
        />{userError ? <Text style={$errorText}>{usernameError}</Text> : null}
      </View>
      
      <View style={$InputContainer}>
        <TextInput 
        style={$input} 
        placeholder="Password"
        secureTextEntry={!showPassword}
        onChangeText={setPassword} 
        />{userError ? <Text style={$errorText}>{passwordError}</Text> : null}
      </View>
      
       <View style={$InputContainer}>
        <TextInput
        style={$input}
        placeholder="Re enter Password"
        secureTextEntry={!showPassword}
        onChangeText={setConfirmPassword}
        />{userError ? <Text style={$errorText}>{passwordMatchError}</Text> : null}
          
          <Button onPress={togglePasswordVisibility} style={$showHideButton}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color={"rgba(25, 16, 21, 0.5)"} />
          </Button>
        </View>
      <Button 
      text="Register" 
      onPress={handleSignUp}
      style={$RegisterButton}
      >
      </Button>
      <Button 
      text="LogIn" 
      onPress={() => navigation.navigate("Login")}
      style={$loginButton}
      >
      </Button>
    </Screen>
  );


});


const $topContainer: ViewStyle = {
  paddingVertical: spacing.xxxl,
  paddingHorizontal: spacing.lg,
  alignItems:"center"
};


const $loginButton: ViewStyle = {
  padding: spacing.md,
  borderRadius: 8,
  marginTop: spacing.md,
  justifyContent: "flex-end",
  backgroundColor:"transparent",
  borderColor:"transparent"
}
const $RegisterButton: ViewStyle = {
  padding: spacing.md,
  borderRadius: 8,
  marginTop: spacing.md,
};

const $InputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "80%",
  borderWidth: 1,
  borderRadius: 8,
  padding: spacing.md,
  marginVertical: spacing.sm,
};

const $showHideButton: ViewStyle = {
  padding: spacing.sm,
  backgroundColor: "transparent",
  borderColor: "transparent"
};

const $input: TextStyle = {
  flex: 1,
  fontSize: 28,
};

const $errorText: TextStyle = {
  color: 'red',
  margin: spacing.md
};