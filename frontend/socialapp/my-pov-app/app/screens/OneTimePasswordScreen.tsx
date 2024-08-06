import React, { FC, useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, Image, TextStyle } from 'react-native';
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"

import { AppStyles } from "app/theme/AppStyles";

const logo = require("../../assets/images/LogoTemp.png");

interface OneTimePasswordScreenProps extends AppStackScreenProps<"OneTimePassword"> {}

export const OneTimePasswordScreen: FC<OneTimePasswordScreenProps> = observer(function OneTimePasswordScreen({
  route, navigation,
}) {

  const OTP = "1234";//HARDCODE
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs: Array<React.RefObject<TextInput> | null> = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  
  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];

    if (!isNaN(Number(value)) || value === '') {
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 3 && inputRefs[index + 1]?.current) {
        inputRefs[index + 1]?.current?.focus(); 
      } else if (index === 3 && value !== '') {
        onEnterLastDigit(newOtp.join(''));
      }
    }

    if (value === '' && index > 0 && inputRefs[index - 1]?.current) {
      newOtp[index] = '';
      setOtp(newOtp);
      inputRefs[index - 1]?.current?.focus(); // backspace
    }
  };

  const onEnterLastDigit = (enteredOtp: string) => {
    if ( enteredOtp === OTP){
      //handle OTP logic 
      navigation.navigate("ResetPassword");
    }else{
      setOtp(['', '', '', '']);
      inputRefs[0]?.current?.focus();
    }
  };
  
  return (
    <Screen 
      preset="fixed"
      contentContainerStyle={AppStyles.container}
      safeAreaEdges={["top", "bottom"]}
    >
      <Image style={AppStyles.welcomeLogo} source={logo} resizeMode="contain" />
      <Text style={AppStyles.text}>OTP sent to your email</Text>
      <View style={$otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={$otpInput}
            value={digit}
            onChangeText={(val) => handleChange(index, val)}
            keyboardType="numeric"
            maxLength={1}
            ref={inputRefs[index]}
          />
       ))}
      </View>
    </Screen>
    
  );
})
  
const $otpContainer: TextStyle = {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
   } 

const $otpInput: TextStyle = {
  ...AppStyles.input,
     width: 120,
     height: 120,
     borderWidth: 2,
     borderColor:"#CAC4CE",
     backgroundColor:"#725AC1",
     marginHorizontal: 5,
     textAlign: 'center',
     fontSize: 50
   }   