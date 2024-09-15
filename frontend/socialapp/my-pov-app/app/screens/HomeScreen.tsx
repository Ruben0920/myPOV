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

const UserIcon = require("../../assets/images/welcome-face.png")
interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const [open, setOpen] = useState(false)
  const { loggedOut } = useAuth()
  const LogOut = () => {
    try {
      AuthService.logout()
        .then(loggedOut)
        .catch((error) => {
          throw new Error(error)
        })
    } catch (error: any) {
      console.log("Error logging out :", error)
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
      drawerPosition={"left"}
      renderDrawerContent={() => {
        return (
          <View style={AppStyles.Drawer}>
            <Button
              text="LogOut"
              textStyle={[AppStyles.ButtonText, { fontSize: 42, color: "#242038" }]}
              onPress={LogOut}
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
        <TouchableOpacity onPress={toggleDrawer}>
          {!open && (
            <Image
              style={[
                AppStyles.UserIcon,
                { height: 150, width: 150, borderRadius: 75, alignSelf: "center", top: 0 },
              ]}
              source={UserIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Screen>
    </Drawer>
  )
})
