import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { View, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

interface InitialScreenTempScreenProps extends AppStackScreenProps<"InitialScreenTemp"> {}

const { width, height } = Dimensions.get("window")

export const InitialScreenTempScreen: FC<InitialScreenTempScreenProps> = observer(
  function InitialScreenTempScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <View style={styles.diagonalContainer}>
        <TouchableOpacity
          style={styles.topLeftButton}
          onPress={() => navigation.navigate("ScreenA")}
        >
          <Text style={styles.buttonText}>Screen A</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomRightButton}
          onPress={() => navigation.navigate("ScreenB")}
        >
          <Text style={styles.buttonText}>Screen B</Text>
        </TouchableOpacity>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  diagonalContainer: {
    flex: 1,
    position: "relative",
  },
  topLeftButton: {
    position: "absolute",
    width: width * Math.sqrt(2),
    height: height * Math.sqrt(2),
    backgroundColor: "#ff6347",
    transform: [{ rotate: "-45deg" }],
    top: -(height * Math.sqrt(2) - height) / 2,
    left: -(width * Math.sqrt(2) - width) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomRightButton: {
    position: "absolute",
    width: width * Math.sqrt(2),
    height: height * Math.sqrt(2),
    backgroundColor: "#4682b4",
    transform: [{ rotate: "-45deg" }],
    top: (height * Math.sqrt(2) - height) / 2,
    left: (width * Math.sqrt(2) - width) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    transform: [{ rotate: "45deg" }],
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
