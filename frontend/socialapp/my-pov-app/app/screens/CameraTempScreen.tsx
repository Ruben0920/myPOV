import React, { FC, useState, useEffect, useRef,  } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, View, Pressable, StyleSheet, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"

import { Camera, CameraPermissionStatus , PhotoFile, useCameraDevice, useCameraPermission,} from "react-native-vision-camera";
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import FileSystem from Expo for handling file operations

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CameraTempScreenProps extends AppStackScreenProps<"CameraTemp"> {}

export const CameraTempScreen: FC<CameraTempScreenProps> = observer(function CameraTempScreen() {

  //set up camera device
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back")
  const[image, setImage] = useState<PhotoFile>();


  //permission need to fix app asks for permision on startup
  const { hasPermission, requestPermission } = useCameraPermission()
  

  useEffect(() => {
    if (!hasPermission){
      requestPermission();
    }
    }, [hasPermission] );

  if(!hasPermission) return <Text>Denied</Text>
  if(device == null) return <Text>No Camera Found</Text>
  //

  const TakePicture = async() =>{
    camera.current?.takePhoto().then(setImage)
  }
  
  const uplaod = async() =>{
    console.log(image)
    
  const result = await fetch(`file://${image.path}`);
  
  const data = await result.blob(); 


  const formData = new FormData();

  // Ensure 'data' is correctly formatted and 'image.path' is accessible
  if (data && image && image.path) {
    formData.append('file', {
      uri: Platform.OS === 'android' ? `file://${image.path}` : image.path,
      type: 'image/jpeg', // Adjust the MIME type as necessary
      name: 'upload.jpg', // Provide a proper name for the uploaded file
    });
    console.log(formData)
  
    try {
      console.log('Sending request to http://10.0.2.2:8000/matches/get_post_objects/');
    
      const response = await fetch('http://10.0.2.2:8000/matches/get_post_objects/', {
        method: 'POST',
        body: formData,
      });
    
      // Read response as text initially
      const responseText = await response.text(); 
      console.log('Raw response text:', responseText);
    
      // Check if the response content type is JSON
      const contentType = response.headers.get('content-type') || '';
    
      if (contentType.includes('application/json')) {
        try {
          const json = JSON.parse(responseText);
          console.log('Parsed JSON response:', json);
    
          if (!response.ok) {
            console.warn(`Response not OK: ${response.status} - ${response.statusText}`);
          }
    
        } catch (jsonParseError) {
          console.error(`Error parsing JSON response: ${jsonParseError}`);
        }
      } else {
        console.warn('Expected a JSON response but received something else.');
      }
    
    } catch (exception) {
      console.error(`Error during fetch request: ${exception}`);
    }
  
  } else {
    console.error('Data or image path is invalid.');
  }
  


      



    setImage(undefined)


  }  
  
 

  //   const result = await fetch(`file://${image.path}`);
    
  //   const data = await result.blob();
    
    
  //   const formData = new FormData();
  //     formData.append('file', data, `file://${image.path}`);
      
  //     const uploadResponse = await fetch('localhost:8000/matches/get_post_objects/', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log("check")
      

     

  // }


  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={$root} >
      {image ? (
        <>
        <Image source={{ uri: 'file://' + image.path}} style={StyleSheet.absoluteFill} />
        <Pressable 
        onPress={uplaod}
        style={{
        position:"absolute",
        alignSelf: "center",
        bottom: 10,
        width: 125,
        height: 125,
        backgroundColor: "black",
        borderRadius: 125,
      }}/>
        </>
      ): (
        <>
        <Camera 
     ref={camera}
     style={StyleSheet.absoluteFill} 
     device={device} 
     isActive={true} 
     photo={true}
     />
      
    <Pressable 
    onPress={TakePicture}
    style={{
      position:"absolute",
      alignSelf: "center",
      bottom: 10,
      width: 125,
      height: 125,
      backgroundColor: "white",
      borderRadius: 125,
      }}
    />   
        </>   
      )}
    </View>
  ); 
}
);

const $root: ViewStyle = {
  flex: 1,
}
