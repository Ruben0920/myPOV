import React, { FC, useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { View, Image, TouchableOpacity, Modal, StyleSheet, Text, TextInput } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button } from "app/components"
import AuthService from "app/services/auth/AuthService"
import { useAuth } from "app/services/auth/useAuth"
import { AppStyles } from "app/theme/AppStyles"
import { Drawer } from "react-native-drawer-layout"
import { spacing } from "../theme"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"

const UserIcon = require("../../assets/images/iconplaceholder.webp")
const AlterUserIcon = require("../../assets/images/AlterIcon.png")

interface MainFeedScreenProps extends AppStackScreenProps<"MainFeed"> {}

export const MainFeedScreen: FC<MainFeedScreenProps> = observer(function MainFeedScreen({
  navigation,
}) {
  const [openModal, setOpenModal] = useState(false)
  const [open, setOpen] = useState(false)
  const { loggedOut } = useAuth()
  const handleLogOut = async () => {
    try {
      await AuthService.logout()
        .then(loggedOut())
        .catch((error) => {
          throw new Error(error)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const openAlter = () => {
    setOpenModal(true)
  }

  // !!! alter secret field
  const OTP = "1234" //HARDCODE
  const [otp, setOtp] = useState(["", "", "", ""])
  const inputRefs: Array<React.RefObject<TextInput> | null> = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ]

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp]

    if (!isNaN(Number(value)) || value === "") {
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 3 && inputRefs[index + 1]?.current) {
        inputRefs[index + 1]?.current?.focus()
      } else if (index === 3 && value !== "") {
        onEnterLastDigit(newOtp.join(""))
      }
    }

    if (value === "" && index > 0 && inputRefs[index - 1]?.current) {
      newOtp[index] = ""
      setOtp(newOtp)
      inputRefs[index - 1]?.current?.focus() // backspace
    }
  }

  const onEnterLastDigit = (enteredOtp: string) => {
    if (enteredOtp === OTP) {
      //handle OTP logic
      setOpenModal(false)
      setOtp(["", "", "", ""])
      inputRefs[0]?.current?.focus()
      navigation.navigate("AlterFeed")
    } else {
      setOtp(["", "", "", ""])
      inputRefs[0]?.current?.focus()
    }
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={"slide"}
      drawerPosition={"left"}
      renderDrawerContent={() => {
        return (
          <View style={AppStyles.Drawer}>
            <TouchableOpacity onPress={() => navigation.navigate("MainAccount")}>
              <Image
                style={[
                  AppStyles.UserIcon,
                  { height: 150, width: 150, borderRadius: 75, alignSelf: "center", top: 0 },
                ]}
                source={UserIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Button
              text="HomeOld"
              textStyle={[AppStyles.ButtonText, { fontSize: 32 }]}
              onPress={() => navigation.navigate("Home")}
              style={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
              pressedStyle={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
            />
            <Button
              text="Friendlist"
              textStyle={[AppStyles.ButtonText, { fontSize: 32 }]}
              onPress={() => navigation.navigate("MainFriendlist")}
              style={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
              pressedStyle={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
            />
            <Button
              text="InitialScreenTemp"
              textStyle={[AppStyles.ButtonText, { fontSize: 32 }]}
              onPress={() => navigation.navigate("InitialScreenTemp")}
              style={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
              pressedStyle={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
            />
            <Button
              text="LogOut"
              textStyle={[AppStyles.ButtonText, { fontSize: 42, color: "#242038" }]}
              onPress={handleLogOut}
              style={[
                [AppStyles.MainButton, { paddingHorizontal: spacing.xxl }],
                {
                  marginTop: "auto",
                  marginBottom: 16,
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                },
              ]}
              pressedStyle={[
                [AppStyles.MainButton, { paddingHorizontal: spacing.xxl }],
                {
                  marginTop: "auto",
                  marginBottom: 16,
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                },
              ]}
            />
          </View>
        )
      }}
    >
      <Screen preset="fixed" contentContainerStyle={AppStyles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Modal
            visible={openModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setOpenModal(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={AppStyles.text}>Enter Secret</Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(val) => handleChange(index, val)}
                      keyboardType="numeric"
                      maxLength={1}
                      ref={inputRefs[index]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={toggleDrawer}>
            {!open && (
              <Image
                style={[
                  AppStyles.UserIcon,
                  {
                    height: 250,
                    width: 250,
                    borderRadius: 75,
                    alignSelf: "flex-start",
                  },
                ]}
                source={UserIcon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={openAlter}>
            {!open && (
              <Image
                style={[
                  AppStyles.UserIcon,
                  {
                    height: 250,
                    width: 250,
                    borderRadius: 75,
                    opacity: 0.3,
                    alignSelf: "flex-end",
                  },
                ]}
                source={AlterUserIcon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera")}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 125,
              alignSelf: "center",
              top: 1375,
            }}
          >
            <FontAwesome5Icon
              name={!open ? "camera" : "facebook"}
              size={200}
              color={"rgba(25, 16, 21, 1)"}
            />
          </TouchableOpacity>
        </View>
      </Screen>
    </Drawer>
  )
})

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    ...AppStyles.input,
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: "#CAC4CE",
    backgroundColor: "#725AC1",
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 50,
  },
})
