import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button } from "app/components"
import { AppStyles } from "app/theme/AppStyles"
import { Image, TouchableOpacity, View, Text, FlatList, StyleSheet, ScrollView } from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import { Drawer } from "react-native-drawer-layout"
import cameraRoll from "app/utils/Album/cameraRoll"
const icon = require("../../assets/images/iconplaceholder.webp")
const photoPlaceholder = require("../../assets/images/PhotoPlaceholder.png")

interface InitialAccountSetupScreenProps extends AppStackScreenProps<"InitialAccountSetup"> {}

export const InitialAccountSetupScreen: FC<InitialAccountSetupScreenProps> = observer(
  function InitialAccountSetupScreen({ navigation }) {
    const [photos, setPhotos] = useState<{ uri: string }[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<string>("")
    const [editing, setEditing] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
    const [pillarIndex, setPillarIndex] = useState<number>(0)
    const [pillars, setPillars] = useState<string[]>([])
    const save = async () => {
      toggleEditing()
    }
    const toggleEditing = () => {
      if (!editing) {
        setEditing(true)
      } else {
        3
        setEditing(false)
      }
    }

    const toggleDrawer = () => {
      if (!open) {
        handleDrawerOpened()
      } else {
        setOpen(false)
      }
    }
    const fetchPhotos = async () => {
      await cameraRoll
        .Photos()
        .then((photos) => {
          photos !== "error" && setPhotos(photos)
        })
        .catch((error) => {
          console.log("Error getting Photos:", error)
        })
    }

    const handleDrawerOpened = async () => {
      fetchPhotos()
      setOpen(true)
    }
    const openImageInFullScreen = (uri: string) => {}

    const closeImageModal = () => {}

    // const toggleSelection = (uri: string) => {
    //   setSelectedPhotos((prevSelected) => {
    //     const newSelected = new Set(prevSelected)
    //     if (newSelected.has(uri)) {
    //       newSelected.delete(uri)
    //     } else {
    //       newSelected.add(uri)
    //     }
    //     return newSelected
    //   })
    // }
    const Select = (uri: string) => {
      setSelectedPhoto(uri)
      setPillars((pillars) => {
        const newPillars = [...pillars]
        newPillars.splice(pillarIndex, 0, uri)
        return newPillars
      })
      toggleDrawer()
    }

    const selectPhoto = (index: number) => {
      setPillarIndex(index)
      toggleDrawer()
    }

    // TODO add

    return (
      // TODO add bottom drawer to show album and choose pics to add to your profile (first the three pillars)
      // TODO make the user icon editable (only when editing === true)
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType={"slide"}
        drawerPosition={"right"}
        drawerStyle={{ width: 500 }}
        renderDrawerContent={() => {
          return (
            <View style={AppStyles.Drawer}>
              <View style={{ flex: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate("InitialAccountSetup")}>
                  <Image
                    style={[
                      AppStyles.UserIcon,
                      { height: 150, width: 150, borderRadius: 75, alignSelf: "center", top: 0 },
                    ]}
                    source={icon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 85 }}>
                {photos.length > 0 ? (
                  <FlatList
                    data={photos}
                    keyExtractor={(item) => item.uri}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => Select(item.uri, pillarIndex)}>
                        <Image source={{ uri: item.uri }} style={[styles.image]} />
                      </TouchableOpacity>
                    )}
                    numColumns={2}
                  />
                ) : (
                  <Text>No photos found in this album.</Text>
                )}
              </View>
              <View style={{ flex: 5 }}>
                <Button
                  text="Camera"
                  textStyle={AppStyles.ButtonText}
                  onPress={() => navigation.navigate("Camera")}
                  style={AppStyles.MainButton}
                  pressedStyle={AppStyles.MainButton}
                />
              </View>
            </View>
          )
        }}
      >
        <Screen
          preset="fixed"
          contentContainerStyle={AppStyles.container}
          safeAreaEdges={["top", "bottom"]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={AppStyles.CameraGoBackButton}
          >
            <FontAwesome name={"home"} size={80} color={"#242038"} />
          </TouchableOpacity>
          <View style={{ flex: 30 }}>
            <Image style={AppStyles.UserIcon} source={icon} resizeMode="contain" />
            <TouchableOpacity onPress={toggleDrawer} style={AppStyles.UserAccoutSettings}>
              <FontAwesome name={"edit"} size={80} color={"#242038"} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 60, flexDirection: "row" }}>
            {[0, 1, 2].map((index) => {
              const uri = pillars[index] // Access the corresponding photo or placeholder
              return (
                <TouchableOpacity key={index} onPress={() => selectPhoto(index)}>
                  <Image
                    style={{
                      width: 250,
                      height: 450,
                      marginRight: 10,
                      borderColor: "#242038",
                      borderWidth: 5,
                    }}
                    source={uri ? { uri } : photoPlaceholder} // If uri exists, show that, otherwise show placeholder
                  />
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={{ flex: 10 }}>
            {editing && (
              <Button
                text="Save"
                textStyle={AppStyles.ButtonText}
                onPress={save}
                style={[AppStyles.MainButton, { marginTop: "auto" }]}
                pressedStyle={[AppStyles.MainButton, { marginTop: "auto" }]}
              />
            )}
          </View>
        </Screen>
      </Drawer>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
    borderRadius: 15,
  },
  selectedImage: {
    borderColor: "blue",
    borderWidth: 3,
  },
  selectedPhotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  selectedImageDisplay: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
})
