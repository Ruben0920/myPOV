import { ViewStyle, ImageStyle, TextStyle, StyleSheet, Dimensions } from "react-native"
import { spacing } from "."
import { colors } from "app/theme/colors"

const textStyles = {
  default: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    margin: 2,
  } as TextStyle,
}

export const AppStyles = StyleSheet.create({
  welcomeLogo: {
    alignSelf: "center",
  } as ImageStyle,

  UserIcon: {
    height: 500,
    width: 500,
    borderWidth: 4,
    borderRadius: 375,
    borderColor: colors.border,
  } as ImageStyle,

  container: {
    backgroundColor: colors.background, //#8D86C9
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 25,
  } as ViewStyle,

  text: {
    ...textStyles.default,
  } as TextStyle,

  InputContainer: {
    flexDirection: "row",
    borderWidth: 2,
    backgroundColor: colors.background,
    borderTopColor: colors.background,
    borderLeftColor: colors.background,
    borderRightColor: colors.background,
    borderBottomColor: colors.border,
    marginVertical: spacing.sm,
  } as ViewStyle,

  input: {
    ...textStyles.default,
  } as TextStyle,

  showHideButton: {
    alignSelf: "flex-end",
    padding: spacing.sm,
    backgroundColor: "transparent",
  } as ViewStyle,

  MainButton: {
    alignSelf: "stretch",
    height: "auto",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.text,
    marginTop: spacing.xxs,
    backgroundColor: colors.border,
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

  CustomButton: {
    alignSelf: "stretch",
    height: "auto",
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.text,
    marginTop: spacing.xxs,
    backgroundColor: colors.border,
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
    backgroundColor: colors.background,
    borderTopColor: colors.background,
    borderLeftColor: colors.background,
    borderRightColor: colors.background,
    borderBottomColor: colors.border,
    marginBottom: 25,
  } as ViewStyle,

  PickerItem: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 5,
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
    backgroundColor: colors.border,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  } as ViewStyle,
})
