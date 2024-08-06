import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, View, TextInput, TouchableOpacity, Text } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Button, Screen } from "app/components"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"
import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"

const logo = require("../../assets/images/LogoTemp.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const { loggedIn } = useAuth()
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
  const [hasError, setHasError] = React.useState<boolean | undefined>(false)
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogIn = async () => {
    if (username === "" || password === "") {
      setHasError(true)
    } else {
      const hashedPassword = hashPassword(password)
      const userData = {
        username: username,
        password: hashedPassword,
      }
      try {
        const response = await AuthService.login(userData)
        if (response.error) {
          console.log(response.error)
          throw new Error(response.error)
        }
        loggedIn()
      } catch (error: any) {
        setHasError(true)
        setErrorMessage(error.message)
      }
    }
  }
  // ! debug only
  const handleDebugLogIn = async () => {
    const hashedPassword = hashPassword("arxidia")
    const userData = {
      username: "kolias",
      password: hashedPassword,
    }
    try {
      const response = await AuthService.login(userData)
      if (response.error) {
        console.log(response.error)
        throw new Error(response.error)
      }
      loggedIn()
    } catch (error: any) {
      setHasError(true)
      setErrorMessage(error.message)
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
          placeholder="Username"
          placeholderTextColor={"#CAC4CE"}
          onChangeText={setUsername}
        />
      </View>

      <View style={AppStyles.InputContainer}>
        <TextInput
          style={AppStyles.input}
          placeholder="Password"
          placeholderTextColor={"#CAC4CE"}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        {hasError ? <Text style={AppStyles.ErrorText}>{errorMessage}</Text> : null}
        <TouchableOpacity onPress={togglePasswordVisibility} style={AppStyles.showHideButton}>
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={38} color={"#CAC4CE"} />
        </TouchableOpacity>
      </View>

      <Button
        text="Log In"
        textStyle={AppStyles.ButtonText}
        onPress={handleLogIn}
        style={AppStyles.MainButton}
        pressedStyle={AppStyles.MainButton}
      />
      <Button
        text="Debug Log In"
        textStyle={AppStyles.ButtonText}
        onPress={handleDebugLogIn}
        style={[AppStyles.MainButton, { backgroundColor: "red" }]}
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
