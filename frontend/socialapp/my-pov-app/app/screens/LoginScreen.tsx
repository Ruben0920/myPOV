import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, View, TextInput, TouchableOpacity, Text, Keyboard } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Button, Screen } from "app/components"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"

import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"

const logo = require("../../assets/images/welcome-face.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const { loggedIn } = useAuth()
  const [hasError, setHasError] = React.useState<boolean | undefined>(false)
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogIn = async () => {
    Keyboard.dismiss()
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
        setPassword("")
      }
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
          onFocus={() => {
            setHasError(false)
          }}
          value={username}
          style={AppStyles.input}
          placeholder="Username"
          placeholderTextColor={"#CAC4CE"}
          onChangeText={setUsername}
        />
      </View>

      <View style={AppStyles.InputContainer}>
        <TextInput
          onFocus={() => {
            setHasError(false)
          }}
          value={password}
          style={AppStyles.input}
          placeholder="Password"
          placeholderTextColor={"#CAC4CE"}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />

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
        text="Create New Account"
        textStyle={AppStyles.ButtonText}
        onPress={() => navigation.navigate("SignUp")}
        style={AppStyles.SecondaryButton}
        pressedStyle={AppStyles.SecondaryButton}
      />
      <Button
        text="Forgot Password"
        textStyle={AppStyles.ButtonText}
        onPress={() => console.log("ForgotPassword Placeholder")}
        style={AppStyles.SecondaryButton}
        pressedStyle={AppStyles.SecondaryButton}
      />
      {hasError ? (
        <Text style={AppStyles.ErrorText}>
          Login failed. Please check your username and password and try again.
        </Text>
      ) : null}
    </Screen>
  )
})
