import React, { FC, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"
import { AppStyles } from "app/theme/AppStyles"
import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import normalizedURI from "app/utils/normalizeURI"
import { useFocusEffect } from "@react-navigation/native"
import cameraRoll from "app/utils/Album/cameraRoll"

interface PillarsScreenProps extends AppStackScreenProps<"Pillars"> {}

export const PillarsScreen: FC<PillarsScreenProps> = observer(function PillarsScreen({
  navigation,
}) {
  const [photos, setPhotos] = useState<{ uri: string }[]>([]) // Update state type as an array of objects with `uri`.
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

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

  useFocusEffect(
    useCallback(() => {
      fetchPhotos()
    }, []),
  )

  const openImageInFullScreen = (uri: string) => {
    setSelectedImage(uri)
    setModalVisible(true)
  }

  const closeImageModal = () => {
    setModalVisible(false)
    setSelectedImage(null)
  }

  const addImageToSelection = async () => {
    if (selectedImage && !selectedImages.includes(selectedImage)) {
      const currectURI = await normalizedURI(selectedImage)
      if (currectURI) {
        setSelectedImages([...selectedImages, currectURI])
      }
    }
    closeImageModal()
  }
  const deletePopUp = (uri: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancelPressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteImage(uri),
        },
      ],
      {
        cancelable: true,
      },
    )
  }
  const deleteImage = async (uri: string) => {
    await cameraRoll.Delete(uri)
    await fetchPhotos()
    closeImageModal()
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={AppStyles.container}
      safeAreaEdges={["top", "bottom"]}
    >
      <Button
        text="Camera"
        textStyle={AppStyles.ButtonText}
        onPress={() => navigation.navigate("Camera")}
        style={AppStyles.MainButton}
        pressedStyle={AppStyles.MainButton}
      />

      <Button
        text="Home"
        textStyle={AppStyles.ButtonText}
        onPress={() => navigation.navigate("Home")}
        style={AppStyles.MainButton}
        pressedStyle={AppStyles.MainButton}
      />

      <View style={styles.container}>
        {photos.length > 0 ? (
          <FlatList
            data={photos}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openImageInFullScreen(item.uri)}>
                <Image source={{ uri: item.uri }} style={styles.image} />
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        ) : (
          <Text>No photos found in this album.</Text>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          {selectedImage && ( // Check for selectedImage
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity onPress={closeImageModal} style={AppStyles.CameraGoBackButton}>
            <FontAwesome5Icon name={"times-circle"} size={80} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={addImageToSelection} style={AppStyles.CameraSaveButton}>
            <FontAwesome5Icon name={"check"} size={200} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              selectedImage && deletePopUp(selectedImage)
            }}
            style={AppStyles.CameraRetakeButton}
          >
            <FontAwesome5Icon name={"trash"} size={200} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>
        </View>
      </Modal>
    </Screen>
  )
})

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
