import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, View, TextInput, TouchableOpacity, Text, Keyboard, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Button, Screen } from "app/components"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"
import { colors } from "app/theme/colors"
import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"

const logo = require("../../assets/images/welcome-face.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const { loggedIn } = useAuth()
  const [hasError, setHasError] = React.useState<boolean | undefined>(false)
  const [username, setUsername] = React.useState<string>("Username")
  const [password, setPassword] = React.useState<string>("Password")
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
        Alert.alert("Error:", ` ${error}`, [], {
          cancelable: true,
        })
      }
    }
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={AppStyles.container}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={{ flex: 1 }}>
        <Image style={AppStyles.welcomeLogo} source={logo} resizeMode="contain" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={AppStyles.InputContainer}>
          <TextInput
            onFocus={() => {
              setHasError(false)
              if (username == "Username") {
                setUsername("")
              }
            }}
            onBlur={() => {
              if (username == "") {
                setUsername("Username")
              }
            }}
            value={username}
            style={AppStyles.input}
            placeholder={username}
            placeholderTextColor={colors.border}
            onChangeText={setUsername}
          />
        </View>

        <View style={AppStyles.InputContainer}>
          <View style={{ flex: 3 }}>
            <TextInput
              onFocus={() => {
                if (hasError) {
                  setPassword
                }
                setHasError(false)
                if (password == "Password") {
                  setPassword("")
                }
              }}
              onBlur={() => {
                if (password == "") {
                  setPassword("Password")
                }
              }}
              value={password}
              style={AppStyles.input}
              placeholder={password}
              placeholderTextColor={colors.border}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={togglePasswordVisibility} style={AppStyles.showHideButton}>
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          text="Log In"
          textStyle={AppStyles.ButtonText}
          onPress={handleLogIn}
          style={AppStyles.MainButton}
          pressedStyle={AppStyles.MainButton}
        />
        <Button
          text="Forgot  Password?"
          textStyle={AppStyles.ButtonText}
          onPress={() => console.log("ForgotPassword Placeholder")}
          style={AppStyles.SecondaryButton}
          pressedStyle={AppStyles.SecondaryButton}
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end" }}>
          <Button
            text="Create New Account"
            textStyle={AppStyles.ButtonText}
            onPress={() => navigation.navigate("SignUp")}
            style={AppStyles.SecondaryButton}
            pressedStyle={AppStyles.SecondaryButton}
          />
        </View>
      </View>
    </Screen>
  )
})
