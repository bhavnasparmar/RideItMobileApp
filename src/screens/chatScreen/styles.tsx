import { StyleSheet } from "react-native";
import { appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { appColors } from "@src/themes";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: windowHeight(9),
    paddingHorizontal: windowWidth(12),
  },
  messageContainer: {
    padding: windowHeight(7),
    marginBottom: windowHeight(9),
    maxWidth: "80%",
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: appColors.primary,
    borderTopLeftRadius: windowHeight(8),
    borderBottomLeftRadius: windowHeight(8),
    borderTopRightRadius: windowHeight(8),
  },
  senderMessageText: {
  },
  senderMessageTime: {
    color: appColors.regularText,
  },
  receiverMessageText: {
    color: appColors.lightGray,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
  },
  receiverMessageTime: {
    textAlign: "right",
    marginTop: windowHeight(5),
    color: appColors.lightGray,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: appColors.whiteColor,
    borderTopLeftRadius: windowHeight(12),
    borderBottomRightRadius: windowHeight(12),
    borderTopRightRadius: windowHeight(12),
    marginHorizontal: windowWidth(10),
  },
  receiverMessage1: {
    alignSelf: "flex-start",
    backgroundColor: appColors.whiteColor,
    borderTopLeftRadius: windowHeight(12),
    borderBottomRightRadius: windowHeight(12),
    borderTopRightRadius: windowHeight(12),
  },
  messageText: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT17,
  },
  messageTextReceive: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT17,
    color: appColors.whiteColor,
  },
  inputContainer: {
    alignItems: "center",
    paddingBottom: windowHeight(20),
    paddingHorizontal: windowHeight(14),
  },
  input: {
    ...commonStyles.mediumTextBlack12,
    width: "70%",
  },
  sendButton: {
    width: windowWidth(42),
    height: windowHeight(28),
    backgroundColor: appColors.primary,
    borderRadius: windowHeight(6),
    alignItems: "center",
    justifyContent: "center",
  },
  mic: {
    marginHorizontal: windowWidth(6),
  },
  backButton: {
    width: windowHeight(30),
    height: windowHeight(30),
    backgroundColor: appColors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(6),
    borderWidth: windowHeight(1),
  },
  view_Main: {
    ...external.ai_center,
    ...external.ph_20,
    height: windowHeight(60),
  },
  textInputView: {
    height: windowHeight(40),
    elevation: 1,
    width: "100%",
    borderRadius: windowHeight(6),
    alignItems: "center",
    paddingHorizontal: windowWidth(4),
  },
  templetionStyle: {
    ...commonStyles.mediumTextBlack12,
    fontSize: fontSizes.FONT19,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: windowHeight(65),
    marginHorizontal: windowWidth(20),
  },
  modalSub: {
    width: windowWidth(150),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(9),
    shadowColor: appColors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingVetical: windowHeight(5),
    paddingHorizontal: windowWidth(10),
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextView: {
    paddingVertical: windowHeight(12),
    paddingHorizontal: windowWidth(10),
  },
  modalText: {
    color: appColors.primaryText,
  },
  modalBorder: {
    borderBottomWidth: windowHeight(0.9),
    width: "100%",
  },
  imageStyle: {
    borderRadius: windowWidth(50),
    resizeMode: "contain", 
    width: windowWidth(45),
    height: windowWidth(45),
    alignSelf: "flex-start",
    borderWidth: windowHeight(1),
  },
  mainView: {
    marginVertical: windowHeight(1),
    marginHorizontal: windowWidth(20),
  },
  listStyle: { marginTop: windowHeight(10) },
});
export { styles };
