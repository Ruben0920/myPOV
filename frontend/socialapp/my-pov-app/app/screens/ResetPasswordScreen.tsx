import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, Image } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"

import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { AppStyles } from "app/theme/AppStyles"

const logo = require("../../assets/images/LogoTemp.png")

interface ResetPasswordScreenProps extends AppStackScreenProps<"ResetPassword"> {}

export const ResetPasswordScreen: FC<ResetPasswordScreenProps> = observer(
  function ResetPasswordScreen() {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [password, setPassword] = React.useState<string>("")
    const [confirmPassword, setConfirmPassword] = React.useState<string>("")
    const [hasError, setHasError] = React.useState<boolean | undefined>(false)
    const [userError, setUserError] = React.useState<string>("")

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
    const validatePassword = (password: string): boolean => {
      return password.length >= 6
    }

    const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
      return password === confirmPassword
    }
    const handleResetPassword = async () => {
      setHasError(false)
      setUserError(
        !validatePassword(password) ? "Password must be at least 6 characters and match" : "",
      )
      setUserError(
        !validatePasswordMatch(password, confirmPassword) ? "Passwords do not match" : "",
      )
      if (validatePassword(password) && validatePasswordMatch(password, confirmPassword)) {
        //api reset password
        //reset password on success move to login page else throw error to user
      } else {
        setHasError(true)
        setUserError("Wrong Input") // need to finish error hanlding
      }
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={AppStyles.container}
        safeAreaEdges={["top", "bottom"]}
      >
        <Image style={AppStyles.welcomeLogo} source={logo} resizeMode="contain" />
        <Text style={AppStyles.text}>Enter New Password</Text>
        <View style={AppStyles.InputContainer}>
          <TextInput
            style={AppStyles.input}
            placeholder="New Password"
            placeholderTextColor={"#CAC4CE"}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
        </View>

        <View style={AppStyles.InputContainer}>
          <TextInput
            style={AppStyles.input}
            placeholder="Re enter Password"
            placeholderTextColor={"#CAC4CE"}
            secureTextEntry={!showPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={AppStyles.showHideButton}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={38} color={"#CAC4CE"} />
          </TouchableOpacity>
        </View>
        <Button
          text="Reset Password"
          textStyle={AppStyles.ButtonText}
          onPress={handleResetPassword}
          style={AppStyles.MainButton}
          pressedStyle={AppStyles.MainButton}
        />
        {hasError ? <Text style={AppStyles.ErrorText}>{userError}</Text> : null}
      </Screen>
    )
  },
)
