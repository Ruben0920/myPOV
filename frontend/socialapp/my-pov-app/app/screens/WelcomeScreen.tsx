import { observer } from "mobx-react-lite";
import React, { FC, useEffect } from "react";
import { AppStackScreenProps } from "../navigators";
import  {useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {};

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) { 

   useEffect(() => {
     const timer = setTimeout(() => {
       navigation.navigate('Login');
    }, 3000); // 3 seconds delay before navigating to the login screen

   return () => clearTimeout(timer);
   }, []);

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

  return (  <View style={styles.container}>
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





});

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

