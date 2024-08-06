import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import normalizedURI from "app/utils/normalizeURI"

const album = "MyPOV"
// * returns an array of the uri for the first : 50 images of the album " MyPOV"
const Photos = async () => {
  try {
    const result = await CameraRoll.getPhotos({
      first: 50, // ? should the number of returned photos be hardcoded
      assetType: "Photos",
      groupTypes: "Album",
      groupName: album,
    })

    //* we extract the uri from the result and return it to be set into an album
    return result.edges.map((edge) => ({
      uri: edge.node.image.uri,
    }))
  } catch (error) {
    return "error"
  }
}

const Delete = async (uri: string) => {
  const currectURI = await normalizedURI(uri)
  if (currectURI) {
    try {
      await CameraRoll.deletePhotos([currectURI])
    } catch (error) {
      console.log("Error deleting photo:", error)
    }
  }
}

const Save = async (tag: string) => {
  try {
    await CameraRoll.saveAsset(tag, { album })
  } catch (error) {
    console.log("Error saving photo:", error)
  }
}

export default {
  Photos,
  Delete,
  Save,
}
