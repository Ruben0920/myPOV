import { useState } from "react"
import { PermissionsAndroid, Platform } from "react-native"

type PermissionType =
  (typeof PermissionsAndroid.PERMISSIONS)[keyof typeof PermissionsAndroid.PERMISSIONS]

export function usePermission(permission: PermissionType) {
  const [hasPermission, setHasPermission] = useState(false)

  async function checkPermission() {
    if (Platform.OS !== "android") {
      setHasPermission(true)
      return Promise.resolve(hasPermission)
    }

    await PermissionsAndroid.check(permission)
      .then(setHasPermission)
      .catch((error) => {
        return Promise.reject(error)
      })

    return Promise.resolve(hasPermission)
  }

  async function requestPermission() {
    if (Platform.OS !== "android") {
      setHasPermission(true)
      return Promise.resolve(hasPermission)
    }

    await PermissionsAndroid.request(permission)
      .then((result) => {
        setHasPermission(result === PermissionsAndroid.RESULTS.GRANTED)
      })
      .catch((error) => {
        return Promise.reject(error)
      })

    return Promise.resolve(hasPermission)
  }

  return {
    checkPermission,
    requestPermission,
  }
}
