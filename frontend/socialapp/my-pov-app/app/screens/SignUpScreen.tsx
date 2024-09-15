import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, Text, TouchableOpacity, Image } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button } from "app/components"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import hashPassword from "app/utils/Crypto/hashPassword"
import AuthService from "app/services/auth/AuthService"
import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"
import { Picker } from "@react-native-picker/picker"

const logo = require("../../assets/images/LogoTemp.png")
interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({ navigation }) {
  const { loggedIn } = useAuth()
  // const [name, setName] = React.useState<string>("");
  // const [sirname, setSirname] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const [confirmPassword, setConfirmPassword] = React.useState<string>("")
  const [emailError, setEmailError] = React.useState<string>("")
  const [usernameError, setUsernameError] = React.useState<string>("")
  const [passwordError, setPasswordError] = React.useState<string>("")
  const [passwordMatchError, setPasswordMatchError] = React.useState<string>("")
  const [userError, setUserError] = React.useState<boolean>(false)

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
    return usernameRegex.test(username)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword
  }

  const handleSignUp = async () => {
    setUserError(false)
    setEmailError(!validateEmail(email) ? "Invalid email format" : "")
    setUsernameError(!validateUsername(username) ? "Username must start with a letter" : "")
    setPasswordError(
      !validatePassword(password) ? "Password must be at least 6 characters and match" : "",
    )
    setPasswordMatchError(
      !validatePasswordMatch(password, confirmPassword) ? "Passwords do not match" : "",
    )

    if (
      validateEmail(email) &&
      validateUsername(username) &&
      validatePassword(password) &&
      validatePasswordMatch(password, confirmPassword)
    ) {
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
      } catch (error: any) {
        setUserError(true)
        setUsernameError(error.message)
        console.log(error.message)
      }
    } else {
      setUserError(true)
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

      <View style={AppStyles.PickerContainer}>
        <Picker
          placeholder="Gender"
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
        >
          <Picker.Item style={AppStyles.PickerItem} label="Other" value="M" />
          <Picker.Item style={AppStyles.PickerItem} label="Female" value="F" />
          <Picker.Item style={AppStyles.PickerItem} label="Male" value="O" />
        </Picker>
      </View>

      <View>
        <Button
          text="Register"
          textStyle={AppStyles.ButtonText}
          onPress={handleSignUp}
          style={AppStyles.MainButton}
          pressedStyle={AppStyles.MainButton}
        ></Button>
        <Button
          text="LogIn"
          textStyle={AppStyles.ButtonText}
          onPress={() => navigation.navigate("Login")}
          style={AppStyles.SecondaryButton}
          pressedStyle={AppStyles.SecondaryButton}
        ></Button>
      </View>
      {userError ? <Text style={AppStyles.ErrorText}>{emailError}</Text> : null}
      {userError ? <Text style={AppStyles.ErrorText}>{usernameError}</Text> : null}
      {userError ? <Text style={AppStyles.ErrorText}>{passwordError}</Text> : null}
      {userError ? <Text style={AppStyles.ErrorText}>{passwordMatchError}</Text> : null}
    </Screen>
  )
})
