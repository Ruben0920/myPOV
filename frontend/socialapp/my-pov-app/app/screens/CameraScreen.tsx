import React, { FC, useRef, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, TouchableOpacity, View, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import {
  Camera,
  CameraPermissionStatus,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera"
import { AppStyles } from "app/theme/AppStyles"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import { PermissionsAndroid, Platform } from "react-native"
import cameraRoll from "app/utils/Album/cameraRoll"

interface CameraScreenProps extends AppStackScreenProps<"Camera"> {}

export const CameraScreen: FC<CameraScreenProps> = observer(function CameraScreen({ navigation }) {
  const camera = useRef<Camera>(null)
  const device = useCameraDevice("back")
  const [image, setImage] = useState<PhotoFile>()
  const { hasPermission, requestPermission } = useCameraPermission()

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission])

  if (!hasPermission) return <Text>Denied</Text>
  if (device == null) return <Text>No Camera Found</Text>

  const TakePicture = async () => {
    await camera.current?.takePhoto().then(setImage)
  }

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= "33") {
        return Promise.all([
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        )
      } else {
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      }
    }

    const hasPermission = await getCheckPermissionPromise()
    if (hasPermission) {
      return true
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= "33") {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          (statuses) =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        )
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED)
      }
    }

    return await getRequestPermissionPromise()
  }

  async function savePicture(tag: string, album: string) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return
    }
    await cameraRoll.Save(tag)
    navigation.goBack()
    setImage(undefined)
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
      ) : (
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
      )}
    </Screen>
  )
})
