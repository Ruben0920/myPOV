import React, { FC, useRef, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, TouchableOpacity, View, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { Camera, PhotoFile, useCameraDevice } from "react-native-vision-camera"
import { AppStyles } from "app/theme/AppStyles"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import { PermissionsAndroid, Platform } from "react-native"
import cameraRoll from "app/utils/Album/cameraRoll"
import { usePermission } from "app/services/permissions/android/useAndroidPermissions"

interface CameraScreenProps extends AppStackScreenProps<"Camera"> {}

export const CameraScreen: FC<CameraScreenProps> = observer(function CameraScreen({ navigation }) {
  const camera = useRef<Camera>(null)
  const device = useCameraDevice("back")
  const [image, setImage] = useState<PhotoFile>()
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const storagePermission = usePermission(
    Platform.Version >= "33"
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  )
  const cameraPermission = usePermission(PermissionsAndroid.PERMISSIONS.CAMERA)

  useEffect(() => {
    const checkPermissions = async () => {
      var status = true
      await cameraPermission.checkPermission().then(async (permStatus) => {
        if (!permStatus) {
          await cameraPermission.requestPermission().then((permStatus) => {
            console.log(status)
            if (status) {
              console.log(permStatus)
              status = permStatus
            }
          })
        }
      })
      await storagePermission.checkPermission().then(async (permStatus) => {
        if (!permStatus) {
          await storagePermission.requestPermission().then((permStatus) => {
            console.log(status)
            if (status) {
              status = permStatus
            }
          })
        }
      })
      console.log(status)
      setHasPermission(status)
    }
    checkPermissions()
  }, [])

  const TakePicture = async () => {
    await camera.current?.takePhoto().then(setImage)
  }

  async function savePicture(tag: string, album: string) {
    if (hasPermission) {
      await cameraRoll.Save(tag)
      navigation.goBack()
      setImage(undefined)
    } else {
      console.log("Storage permission denied")
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle={AppStyles.CameraContainer}>
      {image ? (
        <>
          <Image source={{ uri: "file://" + image.path }} style={StyleSheet.absoluteFill} />

          <TouchableOpacity
            onPress={() => savePicture(`file://' + ${image.path}`, "MyPOV")}
            style={AppStyles.CameraSaveButton}
          >
            <FontAwesome5Icon name={"save"} size={200} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setImage(undefined)
            }}
            style={AppStyles.CameraRetakeButton}
          >
            <FontAwesome5Icon name={"redo"} size={200} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={navigation.goBack} style={AppStyles.CameraGoBackButton}>
            <FontAwesome5Icon name={"times-circle"} size={80} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>
        </>
      ) : hasPermission ? (
        <View style={AppStyles.CameraContainer}>
          <Camera
            ref={camera}
            style={AppStyles.CameraContainer}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity onPress={TakePicture} style={AppStyles.CameraButton}>
            <FontAwesome5Icon name={"camera"} size={200} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>

          <TouchableOpacity onPress={navigation.goBack} style={AppStyles.CameraGoBackButton}>
            <FontAwesome5Icon name={"times-circle"} size={80} color={"rgba(25, 16, 21, 0.7)"} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={AppStyles.container}></View>
      )}
    </Screen>
  )
})
