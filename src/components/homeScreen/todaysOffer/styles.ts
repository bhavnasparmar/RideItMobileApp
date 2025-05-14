import { StyleSheet } from "react-native";
import { windowHeight } from "@src/themes";

const styles = StyleSheet.create({
    NoInternetView: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    titleContainer: { marginTop: windowHeight(2.9) },
    couponsList: { marginVertical: windowHeight(7) },

})
export default styles;