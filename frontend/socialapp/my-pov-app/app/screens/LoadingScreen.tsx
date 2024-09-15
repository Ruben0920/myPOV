import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import useFetch from "app/services/api/useFetch"
import  {useRef } from 'react';
import { View,StyleSheet, Animated, Easing } from 'react-native';
import { saveData } from "app/utils/storage/securestore"


interface LoadingScreenProps extends AppStackScreenProps<"Loading"> {}

export const LoadingScreen: FC<LoadingScreenProps> = observer(function LoadingScreen({
  route,navigation,
}) {

  const params = route.params
  
  
  const userData = {
    username : params?.username,
    password : params?.password
  }
  const link = params?.url
  const {data, error} = useFetch(link, userData); // should throw error 
  


  useEffect(() => {
    console.log("Inside useEffect");
    console.log("URL:", params?.url);
    console.log("User Data:", userData);
    
    if (error === null && data !== null) {
      console.log(data.access)
      
      navigation.navigate("Home");
    }
    if (error) {
      console.error('Error fetching data:', data);
      if (params?.type === "Login"){
        navigation.navigate("Login",{error : "Wrong Credentials", hasError : true});
      }else{
        navigation.navigate("SignUp",{error : "Wrong Credentials", hasError : true});
      }
      
    }
  }, [data, error]); 
  

 const rotation = useRef(new Animated.Value(0)).current;

 useEffect(() => {
   // Start rotating animation
   Animated.loop(
     Animated.timing(rotation, {
       toValue: 2,
       duration: 5000,
       easing: Easing.linear,
       useNativeDriver: true,
     })
   ).start();
 }, []);
  
  
  return (
    <View style={styles.container}>
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [
            {
              rotateY: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.logoText}>POV</Text>
      <Animated.View style={styles.sparkle}></Animated.View>
    </Animated.View>
  </View>
);
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  logoContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#800080',
    borderRadius: 150, // Half of the width/height for a perfect circle
  },
  logoText: {
    color: '#FFF',
    fontSize: 80, // Increase the font size for a larger logo
    fontWeight: 'bold',
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Sparkling color
    width: 10, // Width of the sparkles
    height: 10,
    borderRadius: 5,
    top: 0,
    left: 0,
  },
});
