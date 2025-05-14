import { StyleSheet } from "react-native";
import {
  appColors,
  windowHeight,
  windowWidth,
  appFonts,
  fontSizes,
} from "@src/themes";

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: windowWidth(20),
    flex: 1,
  },
  container: {
    height: windowHeight(250),
    width: "100%",
    borderWidth: windowHeight(1),
    paddingVertical: windowHeight(5),
    borderRadius: windowHeight(5),
    backgroundColor: appColors.whiteColor,
    marginTop: windowHeight(5),
  },
  titleContainer: {
    height: windowHeight(20),
    justifyContent: "center",
    marginTop: windowHeight(17),
  },
  title: {
    color: appColors.blackColor,
    fontFamily: appFonts.medium,
  },
  inputView: {
    alignItems: "center",
    borderRadius: windowWidth(8),
    borderWidth: windowHeight(1),
    paddingHorizontal: windowWidth(3),
    height: windowHeight(42),
  },
  textinput: {
    fontFamily: appFonts.regular,
    paddingHorizontal: windowWidth(1.5),
    width: "90%",
  },
  dashBorder: {
    borderBottomWidth: windowHeight(0.9),
    borderColor: appColors.border,
    borderStyle: "dashed",
    marginVertical: windowHeight(15),
  },
  titleTopup: {
    color: appColors.primaryText,
    height: windowHeight(20),
    fontFamily: appFonts.medium,
  },
  titleAmount: {
    color: appColors.regularText,
    height: windowHeight(20),
    fontFamily: appFonts.regular,
    marginTop: windowHeight(5.9),
  },
  icons: {
    marginHorizontal: windowWidth(14),
  },
  addBtn: {
    position: "absolute",
    bottom: windowHeight(12),
    width: "90%",
    alignSelf: "center",
  },
  modalPaymentView: {
    justifyContent: "space-between",
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(10),
  },
  imageBg: {
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(19),
    alignItems: "center",
    justifyContent: "center",
    width: windowHeight(40),
    height: windowHeight(40),
    backgroundColor: appColors.lightGray,
  },
  paymentImage: {
    width: windowWidth(35),
    height: windowHeight(30),
    resizeMode: "contain",
  },
  mailInfo: {
    marginHorizontal: windowWidth(17),
    justifyContent: "center",
  },
  mail: {
    fontFamily: appFonts.regular,
  },
  payBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth(9),
    borderRadius: windowHeight(7.6),
    marginHorizontal: windowWidth(6),
    height: windowHeight(35),
    right: windowHeight(17),
  },
  buttonContainer: {
    marginTop: windowHeight(8),
  },
  buttonText: {
    fontFamily: appFonts.medium,
  },
  borderPayment: {
    borderBottomWidth: windowHeight(0.9),
    borderColor: appColors.border,
    marginHorizontal: windowWidth(15),
  },
});

export default styles;
