import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';


const styles = StyleSheet.create({
    dataView: {
        maxHeight: windowHeight(420),
        marginHorizontal: windowWidth(20),
        borderRadius: windowHeight(7),
        marginTop: windowHeight(10),
        overflow: 'hidden',
        borderWidth: windowHeight(1),
        marginBottom: windowHeight(85),
    },
    list: {
        justifyContent: 'space-between',
        marginHorizontal: windowWidth(20),
        marginVertical: windowHeight(10)
    },
    receiptView: {
        height: windowHeight(35),
        width: windowWidth(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(9)
    },
    detailView: {
        marginHorizontal: windowWidth(10),
        justifyContent: 'space-around'
    },
    description: {
        color: appColors.regularText,
        fontSize: fontSizes.FONT18,
        fontFamily: appFonts.regular
    },
    amountView: {
        height: windowHeight(35),
        width: windowWidth(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(9),
    },
    amount: {
        fontSize: fontSizes.FONT20,
        fontFamily: appFonts.medium
    },
    icons: {
        marginTop: windowHeight(4),
        height: windowHeight(16),
        width: windowHeight(16),
    },
    dash: {
        marginHorizontal: windowWidth(4)
    },
    bgStyle: {
        backgroundColor: appColors.border,
        alignItems: "center",
    }
})
export default styles