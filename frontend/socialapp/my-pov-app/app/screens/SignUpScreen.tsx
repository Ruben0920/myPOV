import React, { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import { ViewStyle, TextInput, View, TextStyle} from "react-native";
import { spacing } from "../theme";
import { AppStackScreenProps } from "app/navigators";
import { Screen, TextField, Button } from "app/components";
import { useStores } from "app/models";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({
  navigation,
}) {

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [reenterPassword, setReenterPassword] = React.useState("");

  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword)
  }

  const handleSignUp = () => {
    // Implement your sign-up logic here
    navigation.navigate("Home"); // Navigate to the main screen after successful sign-up
  };

  return (
    <View style={$topContainer}>
      <TextInput 
        style={$input} 
        placeholder="Full name" />
      <TextInput 
        style={$input} 
        placeholder="Email" />
      <TextInput 
        style={$input} 
        placeholder="Username" />
      <TextInput 
        style={$input} 
        placeholder="Password" />
      <View style={$passwordInputContainer}>
          <TextInput
            style={$passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
          />
          <Button onPress={togglePasswordVisibility} style={$showHideButton}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color={"rgba(25, 16, 21, 0.5)"} />
          </Button>
        </View>
      <Button 
      text="Register" 
      onPress={() => navigation.navigate("Home")}
      style={$RegisterButton}
      >
      </Button>
      <Button 
      text="LogIn" 
      onPress={() => navigation.navigate("Login")}
      style={$loginButton}
      >
      </Button>
    </View>
  );


});
const $root: ViewStyle = {
  flex: 1,
}

const $topContainer: ViewStyle = {
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: 450,
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

const $passwordInputContainer: ViewStyle = {
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

const $passwordInput: TextStyle = {
  flex: 1,
  fontSize: 28,
};