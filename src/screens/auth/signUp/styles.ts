import { StyleSheet } from "react-native";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    countryCodeContainer: { marginTop: windowHeight(17) },
    btn: {
        top: windowHeight(25),
        marginBottom: windowHeight(200),
    },
    confirmPasswordView: { bottom: windowHeight(6.9) },
    passwordView: { bottom: windowHeight(5.3) },
    referralIdView: { bottom: windowHeight(3) },
    emailView: { bottom: windowHeight(1) },
    numberTitle: {
        top: windowHeight(14.3), fontFamily: appFonts.medium,
    },
    phoneNumberInput: {
        width: windowWidth(330),
       // backgroundColor: appColors.lightGray,
        borderRadius: windowHeight(4),
        marginHorizontal: windowHeight(9),
        paddingHorizontal: windowHeight(9),
        borderWidth: windowHeight(1),
        height: windowHeight(42),
    },
    countryCodeContainer1: {
        width: windowWidth(100),
        height: windowHeight(42),
       // backgroundColor: appColors.lightGray,
        borderRadius: windowHeight(4),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
    },
    inputText: {
        marginHorizontal: windowWidth(5),
        width: '100%'
    },
    countryCode: {
        justifyContent: "space-between",
        width: windowWidth(55),
    },
    dialCode: {
        color: appColors.regularText,
        fontFamily: appFonts.regular,
        left: windowHeight(2),
    },
    warningText: {
        color: appColors.alertRed,
        marginTop: windowHeight(5),
      },
})
export default styles;