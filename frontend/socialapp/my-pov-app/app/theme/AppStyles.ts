import { ViewStyle, ImageStyle, TextStyle, StyleSheet } from "react-native"
import { spacing } from "."

const textStyles = {
  default: {
    color: "#CAC4CE",
    fontSize: 50,
    lineHeight: 56,
    margin: 2,
    alignSelf: "center",
  } as TextStyle,
}

export const AppStyles = StyleSheet.create({
  welcomeLogo: {
    height: 550,
    width: 750,
    alignSelf: "center",
  } as ImageStyle,

  UserIcon: {
    height: 500,
    width: 500,
    borderWidth: 4,
    borderRadius: 375,
    borderColor: "#CAC4CE",
  } as ImageStyle,

  container: {
    backgroundColor: "#8D86C9",
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 120,
    paddingVertical: 40,
  } as ViewStyle,

  text: {
    ...textStyles.default,
  } as TextStyle,

  InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 35,
    borderColor: "#CAC4CE",
    backgroundColor: "#725AC1",
    padding: spacing.md,
    marginVertical: spacing.sm,
  } as ViewStyle,

  input: {
    ...textStyles.default,
  } as TextStyle,

  showHideButton: {
    position: "absolute",
    left: 750,
    padding: spacing.sm,
    backgroundColor: "transparent",
  } as ViewStyle,

  MainButton: {
    alignSelf: "stretch",
    paddingHorizontal: spacing.xxxl,
    height: "auto",
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#242038",
    marginTop: spacing.md,
    backgroundColor: "#242038",
  } as ViewStyle,

  SecondaryButton: {
    alignSelf: "center",
    paddingHorizontal: spacing.xxxl,
    width: "auto",
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "transparent",
    marginTop: spacing.md,
    backgroundColor: "transparent",
  } as ViewStyle,

  ButtonText: {
    ...textStyles.default,
  } as TextStyle,

  ErrorText: {
    ...textStyles.default,
    color: "red",
  } as TextStyle,

  PickerContainer: {
    borderWidth: 2,
    borderRadius: 35,
    borderColor: "#CAC4CE",
    backgroundColor: "#725AC1",
    padding: spacing.md,
    marginVertical: spacing.sm,
  } as ViewStyle,

  PickerItem: {
    color: "#CAC4CE",
    fontSize: 38,
    lineHeight: 54,
    marginBottom: 20,
    alignSelf: "flex-start",
  } as TextStyle,

  CameraContainer: {
    flex: 1,
  } as ViewStyle,

  CameraButton: {
    position: "absolute",
    left: 450,
    bottom: 100,
    width: 200,
    height: 200,
    borderRadius: 125,
  } as ViewStyle,

  CameraRetakeButton: {
    position: "absolute",
    left: 750,
    bottom: 100,
    width: 200,
    height: 200,
    borderRadius: 125,
  } as ViewStyle,

  CameraSaveButton: {
    position: "absolute",
    left: 150,
    bottom: 100,
    width: 200,
    height: 200,
    borderRadius: 125,
  } as ViewStyle,

  CameraGoBackButton: {
    position: "absolute",
    left: 30,
    top: 30,
    bottom: 100,
    width: 200,
    height: 200,
    borderRadius: 125,
  } as ViewStyle,

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 25,
    backgroundColor: "white",
    borderRadius: 200,
    zIndex: 1,
  } as ViewStyle,

  closeButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 36,
  } as TextStyle,

  UserAccoutSettings: {
    position: "absolute",
    left: 470,
    top: 430,
    backgroundColor: "transparent",
  } as ViewStyle,

  Drawer: {
    backgroundColor: "#8D86C9",
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  } as ViewStyle,
})