import { Text, View, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AuthText } from "../../../components/authComponents/authText/index";
import { AuthContainer } from "../../../components/authComponents/authContainer/index";
import OTPTextView from "react-native-otp-textinput";
import { style } from "./style";
import { appColors, windowHeight } from "@src/themes";
import { Button, notificationHelper } from "@src/commonComponent";
import { external } from "../../../styles/externalStyle";
import { NewUserComponent } from "../../../components/authComponents/newUserComponent/index";
import { useValues } from "../../../../App";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../api/store/index";
import { VerifyOtpInterface, UserLoginInterface } from "../../../api/interface/authInterface";
import { userVerifyOtp, userLogin, selfData } from "../../../api/store/actions/index";
import { setValue } from "../../../utils/localstorage/index";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function OtpVerification({}) {
  const route = useAppRoute();
  const countryCode = route?.params?.countryCode ?? "91";
  const phoneNumber = route?.params?.phoneNumber ?? "1234567890";
  const demouser = route.params || {};
  const { navigate } = useAppNavigation();
  const { bgFullLayout, textRTLStyle, isDark, viewRTLStyle } = useValues();
  const [otp, setOtp] = useState(demouser?.demouser ? "123456" : "");
  const [fcmToken, setFcmToken] = useState("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.auth);
  const { translateData } = useSelector((state: any) => state.setting);
  const otpInputRef = useRef(null);
  const emailOrPhone = demouser?.email_or_phone ?? phoneNumber;
  const isEmail = emailOrPhone.includes("@");


  useEffect(() => {
    const fetchToken = async () => {
      let fcmToken = await AsyncStorage.getItem("fcmToken");
      if (fcmToken) {
        setFcmToken(fcmToken);
      }
    };
    fetchToken();
  }, []);


  useEffect(() => {
    if (otp.length === 6) {
      Keyboard.dismiss();
      handleVerify();
    }
  }, [otp]);


  const handleVerify = () => {
    const formatCountryCode = (code: string): string => {
      if (code.startsWith("+")) {


        return code.substring(1);
      }
      return code;
    };
    let payload: VerifyOtpInterface = {
      email_or_phone: phoneNumber,
      country_code: formatCountryCode(countryCode),
      token: otp,
      email: null,
      fcm_token: fcmToken,
    };

    dispatch(userVerifyOtp(payload))
      .unwrap()
      .then(async (res: any) => {
        if (!res.success) {
          notificationHelper("OTP", translateData?.invalidOtp, "error")
        } else if (res.success && res.is_registered) {
          notificationHelper("OTP Verify", "OTP Verify Successfully", "success")
          setValue("token", res.access_token);
          navigate("MyTabs");
          dispatch(selfData());
        } else {
          if (!res.is_registered) {
            notificationHelper("OTP Verify", "OTP Verify Successfully", "success")
            navigate("SignUp", { countryCode, phoneNumber });
            setSuccess(false);
            setMessage(translateData?.noAccountOTPText);
          } else {
            notificationHelper("OTP Verify", translateData?.invalidOtp, "error")
            setSuccess(false);
            setMessage(translateData?.OTPIncorrectMsg);
          }
        }
      })
      .catch((error: any) => {
        setSuccess(false);
        setMessage(translateData?.duringVerificationOTP);
      });
  };

  const ResendOtp = () => {
    const formatCountryCode = (code: string): string => {
      if (code.startsWith("+")) {
        return code.substring(1);
      }
      return code;
    };
    let payload: UserLoginInterface = {
      email_or_phone: formatCountryCode(phoneNumber),
      country_code: countryCode,
    };
    dispatch(userLogin(payload))
      .unwrap()
      .then((res: any) => {

        if (res?.success) {
         // navigate("OtpVerification", { countryCode, phoneNumber });
          notificationHelper("OTP send", translateData?.otpSend, "success")
        } else {
          if (res.message.includes("Connection")) {
            setMessage(translateData?.tryAgainOtp);
          } else if (
            res.message === translateData?.linkedinNoAccountinOtp
          ) {
          } else {
            setMessage(res.message);
          }
        }
      });
  };

  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <AuthText
            title={translateData?.otpVerification}
            subtitle={
              isEmail
                ? `${translateData?.otpSendTo} ${emailOrPhone}`
                : `${translateData?.otpSendTo} ${countryCode} ${emailOrPhone}`
            }

          />
          <Text
            style={[
              style.otpTitle,
              {
                color: isDark ? appColors.whiteColor : appColors.primaryText,
                textAlign: textRTLStyle,
              },
            ]}
          >
            {translateData?.otp}
          </Text>
          <View style={[style.inputContainer, { flexDirection: viewRTLStyle }]}>
            <OTPTextView
              containerStyle={[
                style.otpContainer,
                { flexDirection: viewRTLStyle },
              ]}
              textInputStyle={[
                style.otpInput,
                {
                  backgroundColor: bgFullLayout,
                  color: isDark ? appColors.whiteColor : appColors.blackColor,

                },
              ]}
              handleTextChange={(value) => {
                setOtp(value);
                if (value.length === 6) {
                  otpInputRef.current?.blur();
                }
              }}
              inputCount={6}
              keyboardType="numeric"
              tintColor="transparent"
              offTintColor="transparent"
              defaultValue={otp}
            />
          </View>
          <View style={[external.mt_40]}>
            <Button title={translateData?.verify} onPress={handleVerify} loading={loading} />
          </View>
          <View style={[external.mb_15, external.mt_5]}>
            <NewUserComponent
              title={translateData?.NoOtp}
              subtitle={translateData?.resendIt}
              onPress={ResendOtp}
            />
          </View>
        </View>
      }
    />
  );
}
