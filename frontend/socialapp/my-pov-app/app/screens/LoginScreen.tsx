import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, View, TextInput, TouchableOpacity, Text } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Button, Screen } from "app/components"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"

import { useAuth } from "app/services/auth/useAuth"




const welcomeFace = require("../../assets/images/welcome-face.png");

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
  const [hasError, setHasError] = React.useState<boolean | undefined>(false)
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { loggedIn } = useAuth()

  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword)
  }

  const handleLogIn = async() => {
    if (username === "" || password === "") {
      setHasError(true)
    } else {
      const hashedPassword = hashPassword(password)
      const userData = {
        username: username,
        password: hashedPassword,
      }
      try {
        await AuthService.login(userData)
          .then(loggedIn())
          .catch((error) => {
            throw new Error(error)
          })
        loggedIn()
      } catch (error: any) {
        setHasError(true)
        setErrorMessage(error.message)
      }
    }
  }

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

      <Button
        text="Log In"
        textStyle={AppStyles.ButtonText}
        onPress={handleLogIn}
        style={AppStyles.MainButton}
        pressedStyle={AppStyles.MainButton}
      />
      <Button
        text="Create New Account"
        textStyle={AppStyles.ButtonText}
        onPress={() => navigation.navigate("SignUp")}
        style={AppStyles.SecondaryButton}
        pressedStyle={AppStyles.SecondaryButton}
      />
      <Button
        text="Forgot password?"
        textStyle={AppStyles.ButtonText}
        onPress={() => navigation.navigate("ForgotPassword")}
        style={AppStyles.SecondaryButton}
        pressedStyle={AppStyles.SecondaryButton}
      />
    </Screen>
  )
})
