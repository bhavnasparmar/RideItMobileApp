import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { external } from "../../../styles/externalStyle";
import { AuthContainer } from "../../../components/authComponents/authContainer/index";
import { Button, AnimatedAlert, notificationHelper } from "@src/commonComponent";
import { SignInTextContainer } from "./signInComponents/signInTextContainer/index";
import { CountryCodeContainer } from "./signInComponents/countryCodeContainer/index";
import { useValues } from "../../../../App";
import { windowHeight } from "@src/themes";
import { UserLoginInterface } from "../../../api/interface/authInterface";
import { translateDataGet, userLogin } from "../../../api/store/actions/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../api/store/index";
import styles from "./styles";
import { appColors } from "@src/themes";
import Images from "@src/utils/images";
import { useAppNavigation } from "@src/utils/navigation";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function SignIn() {
  const { navigate } = useAppNavigation();
  const { isDark, textColorStyle, viewRTLStyle } = useValues();
  const dispatch = useDispatch<AppDispatch>();
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const messageRef = useRef();
  const { loading } = useSelector((state: any) => state.auth);
  const [demouser, setDemouser] = useState(false);
  const [warning, setWarning] = useState(false);
  const { translateData, settingData } = useSelector((state: any) => state.setting);


  useFocusEffect(
    useCallback(() => {
      dispatch(translateDataGet());
    }, [dispatch])
  );

  const handleSignIn = () => {
    if (!phoneNumber.trim()) {
      setWarning(true);
      return;
    }
    const formatCountryCode = (code: string): string => {
      if (code.startsWith("+")) {
        return code.substring(1);
      }
      return code;
    };

    let payload: UserLoginInterface = {
      email_or_phone: phoneNumber,
      country_code: formatCountryCode(countryCode),
    };
    dispatch(userLogin(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          navigate("OtpVerification", { countryCode, phoneNumber, demouser });
          notificationHelper("OTP", "Otp Sent Successfully", "success")

          setWarning(false);
        } else {
          messageRef.current?.animate();
          setMessage(
            res.message.includes("Connection")
              ? "Something Went Wrong. Please Try Again Later."
              : res.message
          );
        }
      });
  };



  const gotoGuest = () => {
    navigate("MyTabs");
  };

  const goDemoUser = () => {
    setPhoneNumber("0123456789");
    setDemouser(true);
  };

  useEffect(() => {
    const getStoredPhone = async () => {
      const storedPhone = await AsyncStorage.getItem('phoneNumber');
    };

    getStoredPhone();
  }, []);


  return (
    <AuthContainer
      topSpace={windowHeight(70)}
      imageShow={true}
      container={
        <View>
          <SignInTextContainer />
          <View style={[external.mt_10]}>
            <CountryCodeContainer
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              backGroundColor={isDark ? appColors.bgDark : appColors.lightGray}
              textBgColor={appColors.lightGray}
              borderColor={isDark ? appColors.bgDark : appColors.lightGray}
              borderColor1={isDark ? appColors.bgDark : appColors.lightGray}
              warning={warning}
            />
            <View style={[external.mt_25]}>
              <Button
                title={translateData?.getOtp || 'Get OTP'}
                onPress={handleSignIn}
                loading={loading}
              />
            </View>

            <View style={styles.imgContainer}>
              <Image source={Images.or} style={styles.orImg} />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={gotoGuest}
              style={[
                styles.faceBook,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
                { flexDirection: viewRTLStyle },
              ]}
            >
              <Image source={Images.defultImage} style={styles.guestImage} />
              <Text style={[styles.sociallogin, { color: textColorStyle }]}>
                {translateData?.guest || 'Guest user'}
              </Text>
            </TouchableOpacity>

            {settingData?.values?.activation?.demo_mode == 1 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={goDemoUser}
                style={[
                  styles.demoBtn1,

                  {
                    flexDirection: viewRTLStyle,

                  },
                ]}
              >
                <Text style={styles.demoBtnText}>{translateData?.demoUser}</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.emptySpace} />
          </View>
          <AnimatedAlert
            text={message}
            ref={messageRef}
            color={success ? appColors.alertBg : appColors.textRed}
          />
        </View>
      }
    />
  );
}
