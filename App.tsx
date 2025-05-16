import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Platform, View } from "react-native";
import MyStack from "./src/navigation/index";
import { external } from "./src/styles/externalStyle";
import {
  imageRTLStyle,
  textRTLStyle,
  viewRTLStyle,
  viewSelfRTLStyle,
} from "./src/styles/rtlStyle";
import {
  bgFullStyle,
  iconColorStyle,
  linearColorStyle,
  linearColorStyleTwo,
  textColorStyle,
  bgFullLayout,
  bgContainer,
  ShadowContainer,
} from "./src/styles/darkStyle";
import { ThemeContextType } from "./src/utils/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./src/api/store";
import { LocationProvider } from "./src/utils/locationContext";
import { MenuProvider } from "react-native-popup-menu";
import {
  NotificationServices,
  requestUserPermission,
} from "@src/utils/pushNotificationHandler";
import { LoadingProvider } from "@src/utils/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotifierRoot } from "react-native-notifier";
import { enableScreens } from "react-native-screens";

enableScreens();

// --- Default Theme Context Values ---
const defaultValues: ThemeContextType = {
  isRTL: false,
  setIsRTL: () => {},
  isDark: false,
  setIsDark: () => {},
  ShadowContainer: "",
  bgContainer: "",
  bgFullLayout: "",
  linearColorStyleTwo: "",
  linearColorStyle: "",
  textColorStyle: "",
  iconColorStyle: "",
  bgFullStyle: "",
  textRTLStyle: "",
  viewRTLStyle: "",
  imageRTLStyle: 0,
  viewSelfRTLStyle: "",
  currSymbol: "",
  setCurrSymbol: () => {},
  currPrice: 0,
  setCurrPrice: () => {},
  token: "",
  setToken: () => {},
};

export const CommonContext = createContext<ThemeContextType>(defaultValues);

function App(): React.JSX.Element {
  const [isRTL, setIsRTL] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [currSymbol, setCurrSymbolState] = useState("$");
  const [currPrice, setCurrValueState] = useState(1);
  const [token, setTokenState] = useState("");

  // --- Fetch Theme & Notification Permissions ---
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const darkThemeValue =false //await AsyncStorage.getItem("darkTheme");
        if (darkThemeValue == null) {
          setIsDark(JSON.parse(darkThemeValue));
        }

        const rtlValue = await AsyncStorage.getItem("rtl");
        if (rtlValue !== null) {
          setIsRTL(JSON.parse(rtlValue));
        }

        const tokenValue = await AsyncStorage.getItem("token");
        if (tokenValue !== null) {
          setTokenState(JSON.parse(tokenValue));
        }

        const savedCurrSymbol = await AsyncStorage.getItem("currSymbol");
        const savedCurrValue = await AsyncStorage.getItem("currValue");

        if (savedCurrSymbol) setCurrSymbolState(savedCurrSymbol);
        if (savedCurrValue) setCurrValueState(parseFloat(savedCurrValue));

        // Placeholder for loading language
        // const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
        // if (savedLanguage) { }

        NotificationServices();
        requestUserPermission();
      } catch (error) {
        console.error("Error initializing app settings:", error);
      }
    };

    initializeApp();
  }, []);

  // --- Save currency symbol ---
  const setCurrSymbol = async (symbol: string) => {
    try {
      await AsyncStorage.setItem("currSymbol", symbol);
      setCurrSymbolState(symbol);
    } catch (error) {
      console.error("Error setting currSymbol:", error);
    }
  };

  // --- Save currency value ---
  const setCurrPrice = async (value: number) => {
    try {
      await AsyncStorage.setItem("currValue", value.toString());
      setCurrValueState(value);
    } catch (error) {
      console.error("Error setting currPrice:", error);
    }
  };

  // --- Save token ---
  const setToken = async (value: string) => {
    try {
      await AsyncStorage.setItem("token", JSON.stringify(value));
      setTokenState(value);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  };

  const contextValues: ThemeContextType = {
    isRTL,
    setIsRTL,
    isDark,
    setIsDark,
    ShadowContainer: ShadowContainer(isDark),
    bgContainer: bgContainer(isDark),
    bgFullLayout: bgFullLayout(isDark),
    linearColorStyleTwo: linearColorStyleTwo(isDark),
    linearColorStyle: linearColorStyle(isDark),
    textColorStyle: textColorStyle(isDark),
    iconColorStyle: iconColorStyle(isDark),
    bgFullStyle: bgFullStyle(isDark),
    textRTLStyle: textRTLStyle(isRTL),
    viewRTLStyle: viewRTLStyle(isRTL),
    imageRTLStyle: imageRTLStyle(isRTL),
    viewSelfRTLStyle: viewSelfRTLStyle(isRTL),
    currSymbol,
    setCurrSymbol,
    currPrice,
    setCurrPrice,
    token,
    setToken,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ paddingTop: Platform.OS === "ios" ? 60 : 0 }} />
      <NotifierRoot />
      <MenuProvider>
        <Provider store={store}>
          <LoadingProvider>
            <CommonContext.Provider value={contextValues}>
              <LocationProvider>
                <View style={external.fx_1}>
                  <MyStack />
                </View>
              </LocationProvider>
            </CommonContext.Provider>
          </LoadingProvider>
        </Provider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}

export const useValues = () => useContext(CommonContext);
export default App;
