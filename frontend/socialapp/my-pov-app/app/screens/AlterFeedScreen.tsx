import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, Image, TouchableOpacity } from "react-native"
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

interface AlterFeedScreenProps extends AppStackScreenProps<"AlterFeed"> {}

export const AlterFeedScreen: FC<AlterFeedScreenProps> = observer(function AlterFeedScreen({
  navigation,
}) {
  const [open, setOpen] = useState(false)
  const { loggedOut } = useAuth()
  const handleLogOut = async () => {
    AuthService.logout()
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

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={"slide"}
      drawerPosition={"right"}
      renderDrawerContent={() => {
        return (
          <View style={AppStyles.Drawer}>
            <TouchableOpacity onPress={() => navigation.navigate("MainAccount")}>
              <Image
                style={[
                  AppStyles.UserIcon,
                  { height: 150, width: 150, borderRadius: 75, alignSelf: "center", top: 0 },
                ]}
                source={AlterUserIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Button
              text="Chat"
              textStyle={[AppStyles.ButtonText, { fontSize: 32 }]}
              onPress={() => navigation.navigate("AlterChat")}
              style={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
              pressedStyle={[AppStyles.MainButton, { paddingHorizontal: spacing.xxl }]}
            />
            <Button
              text="Friendlist"
              textStyle={[AppStyles.ButtonText, { fontSize: 32 }]}
              onPress={() => navigation.navigate("AlterFriendlist")}
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
          <TouchableOpacity onPress={() => navigation.navigate("MainFeed")}>
            {!open && (
              <Image
                style={[
                  AppStyles.UserIcon,
                  {
                    height: 250,
                    width: 250,
                    borderRadius: 75,
                    alignSelf: "flex-start",
                    opacity: 0.3,
                  },
                ]}
                source={UserIcon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDrawer}>
            {!open && (
              <Image
                style={[
                  AppStyles.UserIcon,
                  {
                    height: 250,
                    width: 250,
                    borderRadius: 75,
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
