import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"
import { deleteData } from "app/utils/storage/securestore"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({
  navigation,
}) { 
  const handleDeleteTokens = () =>{
    deleteData("accessToken")
    deleteData("refreshToken")
    navigation.navigate("Login")
  }
  

  return (
    <Screen style={$root} preset="scroll">
      <Button 
          text="Camera" 
          onPress={() => navigation.navigate("CameraTemp")} 
          />
      <Button 
          text="LogOut" 
          onPress={handleDeleteTokens}
          />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
