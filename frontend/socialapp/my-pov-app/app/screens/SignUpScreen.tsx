import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, Text, TouchableOpacity, Image, Alert, Keyboard } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button } from "app/components"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"
import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"
import { Picker } from "@react-native-picker/picker"
import formValidation from "app/utils/formValidation"
import { colors } from "app/theme/colors"

const logo = require("../../assets/images/welcome-face.png")
interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({ navigation }) {
  const { loggedIn } = useAuth()
  // const [name, setName] = React.useState<string>("");
  // const [sirname, setSirname] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("Gender")
  const [email, setEmail] = React.useState<string>("")
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [confirmPassword, setConfirmPassword] = React.useState<string>("")
  const [emailError, setEmailError] = React.useState<string>("")
  const [usernameError, setUsernameError] = React.useState<string>("")
  const [passwordError, setPasswordError] = React.useState<string>("")
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  useEffect(() => {
    validateForm()
  }, [username, password, email, confirmPassword])

  const validateForm = async () => {
    setUsernameError(formValidation.usernameValidator(username))
    setEmailError(formValidation.emailValidator(email))
    setPasswordError(formValidation.passwordValidator(password, confirmPassword))
    return passwordError == "" && emailError == "" && usernameError == ""
  }

  const invalidAlert = () => {
    Alert.alert("Invalid form", ` ${usernameError} \n ${emailError} \n ${passwordError}`, [], {
      cancelable: true,
    })
  }

  const handleSignUp = async () => {
    const valid = await validateForm()
    if (!valid) {
      invalidAlert()
    } else {
      const hashedPassword = hashPassword(password)
      const userData = {
        email: email,
        username: username,
        password: hashedPassword,
      }
      try {
        await AuthService.register(userData)
          .then((Status) => {
            console.log(Status), loggedIn()
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error: any) {}
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
      <View style={{ flex: 3 }}>
        <View style={AppStyles.InputContainer}>
          <TextInput
            style={AppStyles.input}
            placeholder="Email"
            placeholderTextColor={colors.text}
            onChangeText={setEmail}
          />
        </View>

        <View style={AppStyles.InputContainer}>
          <TextInput
            style={AppStyles.input}
            placeholder="Username"
            placeholderTextColor={colors.text}
            onChangeText={setUsername}
          />
        </View>

        <View style={AppStyles.InputContainer}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={AppStyles.input}
              placeholder="Password"
              placeholderTextColor={colors.text}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={AppStyles.InputContainer}>
          <View style={{ flex: 3 }}>
            <TextInput
              style={AppStyles.input}
              placeholder="Re enter Password"
              placeholderTextColor={colors.text}
              secureTextEntry={!showPassword}
              onChangeText={setConfirmPassword}
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
        <View style={AppStyles.InputContainer}>
          <TextInput
            style={AppStyles.input}
            placeholder={gender}
            onFocus={() => {
              Alert.alert("Choose Gender", "Select one:", [
                {
                  text: "Male",
                  onPress: () => {
                    setGender("Male")
                  },
                },
                {
                  text: "Female",
                  onPress: () => {
                    setGender("Female")
                  },
                },
              ])
              Keyboard.dismiss()
            }}
            placeholderTextColor={colors.text}
          />
        </View>

        <View>
          <Button
            text="Register"
            textStyle={AppStyles.ButtonText}
            onPress={handleSignUp}
            style={AppStyles.MainButton}
            pressedStyle={AppStyles.MainButton}
          ></Button>
        </View>
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end" }}>
          <Button
            text="Log In"
            textStyle={AppStyles.ButtonText}
            onPress={() => navigation.navigate("Login")}
            style={AppStyles.SecondaryButton}
            pressedStyle={AppStyles.SecondaryButton}
          ></Button>
        </View>
      </View>
    </Screen>
  )
})
