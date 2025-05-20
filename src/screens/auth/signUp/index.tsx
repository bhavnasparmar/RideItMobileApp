import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContainer } from "../../../components/authComponents/authContainer/index";
import { InputText, Button } from "@src/commonComponent";
import { AuthText } from "../../../components/authComponents/authText/index";
import { external } from "../../../styles/externalStyle";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "../../../../App";
import { ArrowDownSmall, EyeClose, EyeOpen } from "@utils/icons";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { selfData, userRegistration } from "@src/api/store/actions";
import { setValue } from "@src/utils/localstorage";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { commonStyles } from "@src/styles/commonStyle";
import { useTheme } from "@react-navigation/native";
import { CountryPicker } from "react-native-country-codes-picker";

export function SignUp() {
  const {
    isDark,
    textRTLStyle,
    setToken,
    textColorStyle,
    isRTL,
    viewRTLStyle,
  } = useValues();
  const { colors } = useTheme();
  const route: any = useAppRoute();
  const usercredentialCode = route.params?.countryCode ?? "91";
  const usercredential = route.params?.phoneNumber ?? "1234567890";
  const [isEmailUser, setIsEmailUser] = useState(false);

  const [userName, setUserName] = useState("");
  const [countryCode, setCountryCode] = useState(usercredentialCode);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [referralID, setReferralID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [numberError, setNumberError] = useState<any>(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<any>(false);
  const [fcmToken, setFcmToken] = useState<string>("");
  const dispatch = useDispatch();
  const [success, setSuccess] = useState<boolean>(false);
  const { replace } = useAppNavigation();
  const { translateData } = useSelector((state: any) => state.setting);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(usercredential.trim());

    setIsEmailUser(isEmail);

    if (isEmail) {
      setEmail(usercredential.trim());
    } else {
      setPhoneNumber(usercredential.trim());
    }
  }, [usercredential]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("fcmToken");
      setFcmToken(token || "");
    };

    fetchToken();
  }, [dispatch]);

  const handleRegister = () => {
 
    let isValid = true;

    // if (!userName.trim()) {
    //   setUserNameError(true);
    //   isValid = false;
    // }

    // if (!email.trim()) {
    //   setEmailError(true);
    //   isValid = false;
    // } else if (emailError) {
    //   setEmailError(false);
    // }
  
    if (!phoneNumber.trim()) {
      setNumberError(translateData?.validNo);
      isValid = false;
    } else if (phoneNumber.length !== 10) {
      setNumberError(translateData?.numberDigit);
      isValid = false;
    } else {
      setNumberError("");
    }

    if (!password) {
      setPasswordError(translateData?.errorPassword);
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(translateData?.passwordDigit);
      isValid = false;
    } else {
      setPasswordError("");
    }

    // if (!confirmPassword) {
    //   setConfirmPasswordError(translateData?.errorConfirmPassword);
    //   isValid = false;
    // } else if (password !== confirmPassword) {
    //   setConfirmPasswordError(translateData?.passwordError);
    //   isValid = false;
    // } else {
    //   setConfirmPasswordError("");
    // }

    if (!isValid) {
      return;
    }
 console.log("hiii")
    setLoading(true);
    const payload = {
      //username: userName,
      // name: userName,
      //   email: email,
      country_code: countryCode,
      phone: phoneNumber,
      fcm_token: fcmToken,
      password: password,
      // password_confirmation: confirmPassword,
    };
    setValue("token", "dummytoken");
    setToken("dummytoken");
    replace("MyTabs");
 //   dispatch(selfData());
    // dispatch(userRegistration(payload))
    //   .unwrap()
    //   .then((res) => {
    //     if (res?.success) {
    //       setValue("token", res.access_token);
    //       setToken(res.access_token);
    //       replace("MyTabs");
    //       dispatch(selfData());
    //     } else {
    //       setSuccess(false);
    //     }
    //   })
    //   .finally(() => setLoading(false));
  };

  const code = () => {
    if (!countryCode) {
      setShow(true);
    } else if (email) {
      setShow(true);
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={external.main}>
        <AuthContainer
          imageShow={false}
          topSpace={windowHeight(100)}
          container={
            <View
            // showsVerticalScrollIndicator={false}
            >
              <AuthText
                title={
                  translateData?.createAccount
                    ? translateData?.createAccount
                    : "Create Account"
                }
                subtitle={
                  translateData?.registerContent
                    ? translateData?.registerContent
                    : "Explore your life by joining with"
                }
              />
              <View>
                {/* <InputText
                  showTitle={true}
                  title={translateData?.userName}
                  borderColor={isDark ? appColors.bgDark : appColors.lightGray}
                  placeholder={translateData?.enterUserName}
                  placeholderTextColor={
                    isDark ? appColors.darkText : appColors.regularText
                  }
                  customColor={
                    isDark ? appColors.whiteColor : appColors.blackColor
                  }
                  backgroundColor={
                    isDark ? appColors.bgDark : appColors.lightGray
                  }
                  show
                  value={userName}
                  onChangeText={(text) => {
                    setUserName(text);
                    setUserNameError(!text.trim());
                  }}
                  warningText={
                    userNameError ? `${translateData?.enterUserName}` : ""
                  }
                /> */}

                <Text
                  style={[
                    styles.numberTitle,
                    {
                      textAlign: textRTLStyle,
                      color: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                    },
                  ]}
                >
                  {translateData?.mobileNumber
                    ? translateData?.mobileNumber
                    : "Mobile Number"}
                </Text>
                <View style={styles.countryCodeContainer}>
                  <View>
                    <View
                      style={[
                        external.fd_row,
                        external.ai_center,
                        external.mt_5,
                        { flexDirection: viewRTLStyle },
                      ]}
                    >
                      <View
                        style={[
                          styles.countryCodeContainer1,
                          {
                            borderColor: isDark
                              ? appColors.bgDark
                              : appColors.lightGray,
                            alignItems: "center",
                          },
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={code}
                          style={[
                            styles.countryCode,
                            { flexDirection: viewRTLStyle },
                          ]}
                        >
                          <Text style={styles.dialCode}>{countryCode}</Text>
                          <ArrowDownSmall />
                        </TouchableOpacity>

                        <CountryPicker
                          show={show}
                          pickerButtonOnPress={(item) => {
                            setCountryCode(item.dial_code);
                            setShow(false);
                          }}
                          style={{
                            modal: {
                              height: 500,
                              backgroundColor: isDark
                                ? appColors.bgDark
                                : appColors.whiteColor,
                            },
                            countryName: {
                              color: textColorStyle,
                              textAlign: textRTLStyle,
                            },
                            dialCode: {
                              color: textColorStyle,
                            },
                            countryButtonStyles: {
                              backgroundColor: isDark
                                ? appColors.darkPrimary
                                : colors.card,
                              flexDirection: isRTL ? "row-reverse" : "row",
                            },
                            textInput: {
                              backgroundColor: isDark
                                ? appColors.darkHeader
                                : appColors.lightGray,
                              color: textColorStyle,
                              textAlign: textRTLStyle,
                              paddingHorizontal: windowWidth(20),
                            },
                            line: {
                              borderColor: colors.border,
                            },
                          }}
                          lang={""}
                          flatListProps={{
                            contentContainerStyle: {
                              flexDirection: isRTL ? "row-reverse" : "row",
                            },
                          }}
                        />
                      </View>

                      <View
                        style={[
                          styles.phoneNumberInput,
                          {
                            width: "74%",
                            backgroundColor: isDark
                              ? appColors.bgDark
                              : appColors.lightGray,
                            flexDirection: viewRTLStyle,
                            borderColor: isDark
                              ? appColors.bgDark
                              : appColors.lightGray,
                          },
                        ]}
                      >
                        <TextInput
                          style={[
                            [
                              commonStyles.regularText,
                              {
                                color: isDark
                                  ? appColors.whiteColor
                                  : appColors.blackColor,
                              },
                            ],
                            [styles.inputText, { textAlign: textRTLStyle }],
                          ]}
                          placeholderTextColor={
                            isDark ? appColors.darkText : appColors.regularText
                          }
                          // placeholder={translateData?.enterPhone}
                          placeholder="Enter phone or email"
                          //keyboardType="number-pad"
                          editable={isEmailUser}
                          value={phoneNumber}
                          onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, "");
                            setPhoneNumber(numericText);

                            if (numericText.length < 10) {
                              setNumberError(translateData?.validNo);
                            } else {
                              setNumberError("");
                            }
                          }}
                        />
                      </View>
                    </View>
                    {numberError && (
                      <Text style={styles.warningText}>
                        {translateData?.validNo}
                      </Text>
                    )}
                  </View>
                </View>
                {/* <View style={styles.emailView}>
                  <InputText
                    showTitle={true}
                    title={translateData?.email ?translateData?.email : "Email"}
                    placeholder={translateData?.enterEmail ?  translateData?.enterEmail : "Enter Email"}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    keyboard={"email-address"}
                    editable={!isEmailUser}
                    show
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      setEmailError(!emailRegex.test(text.trim()));
                    }}
                    warningText={
                      emailError ? `${translateData?.enterEmailId}` : ""
                    }
                  />
                </View> */}
                {/* <View style={styles.referralIdView}>
                  <InputText
                    showTitle={true}
                    title={translateData?.referralId}
                    placeholder={translateData?.enterReferralId}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    show
                    value={referralID}
                    onChangeText={setReferralID}
                  />
                </View> */}
                <View style={styles.passwordView}>
                  <InputText
                    showTitle={true}
                    title={
                      translateData?.password
                        ? translateData?.password
                        : "Password"
                    }
                    placeholder={
                      translateData?.enterPassword
                        ? translateData?.enterPassword
                        : "Enter Password"
                    }
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    show
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError(
                        text && text.length < 8
                          ? translateData?.passwordDigit
                          : ""
                      );
                    }}
                    rightIcon={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={{ paddingHorizontal: windowHeight(0) }}
                      >
                        {isPasswordVisible ? <EyeOpen /> : <EyeClose />}
                      </TouchableOpacity>
                    }
                    secureText={!isPasswordVisible}
                    warningText={passwordError}
                  />
                </View>
                {/* <View style={styles.confirmPasswordView}>
                  <InputText
                    showTitle={true}
                    title={translateData?.confirmPassword}
                    placeholder={translateData?.enterConfirmPassword}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    show
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setConfirmPasswordError(
                        text !== password ? translateData?.passwordError : ""
                      );
                    }} rightIcon={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                        style={{ paddingHorizontal: windowHeight(0) }}
                      >
                        {isConfirmPasswordVisible ? <EyeOpen /> : <EyeClose />}
                      </TouchableOpacity>
                    }
                    secureText={!isConfirmPasswordVisible}
                    warningText={confirmPasswordError}
                  />
                </View> */}
              </View>
              <View style={styles.btn}>
                <Button
                  title={
                    translateData?.register
                      ? translateData?.register
                      : "Get OTP"
                  }
                  onPress={handleRegister}
                  loading={loading}
                />
              </View>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}
