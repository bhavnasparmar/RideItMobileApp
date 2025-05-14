import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  BackHandler,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { InputText, Button } from "@src/commonComponent";
import { ArrowDownSmall } from "@utils/icons";
import { styles } from "../style";
import { useValues } from "../../../../../../App";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";
import { commonStyles } from "@src/styles/commonStyle";
import { CountryPicker } from "react-native-country-codes-picker";
import { useTheme } from "@react-navigation/native";
import { useLoadingContext } from "@src/utils/context";
import { SkeletonInput } from "./component";
import { useSelector } from "react-redux";

export function DataContainer({ data, updateProfile, show, setShow, width, Update }) {
  const { colors } = useTheme();
  const { isDark, viewRTLStyle, isRTL, textColorStyle, textRTLStyle, t } =
    useValues();
  const [countryCode, setCountryCode] = useState(data?.country_code);
  const [loading, setLoading] = useState(false);
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const { translateData } = useSelector((state: any) => state.setting);


  useEffect(() => {
    if (!addressLoaded) {
      setLoading(true);
      setLoading(false);
      setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);

  const SkeletonLoader = ({ variant }) => {
    let rectProps = { x: "0%", y: "0", width: "100%" };
    if (variant === 2) {
      rectProps = { x: "0%", y: "0", width: "100%" };
    } else if (variant === 3) {
      rectProps = { x: "0%", y: "0", width: "100%" };
    } else if (variant === 4) {
      rectProps = { x: "0%", y: "80%", width: "100%" };
    }

    return <SkeletonInput x={rectProps.x} width={rectProps.width} />;
  };

  const [phoneNumber, setPhoneNumber] = useState(data?.phone.toString());
  const [form, setForm] = useState({
    username: data?.name,
    email: data?.email,
    countryCode: data?.country_code,
    phoneNumber: data?.phone.toString(),
  });

  const onChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const closeCountryPicker = () => {
    setShow(false);
  };

  const handleBackgroundPress = () => {
    closeCountryPicker();
    setShow(false);
  };

  const handleBackPress = () => {
    if (show) {
      setShow(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [show]);

  return (
    <View style={styles.inputContainer}>
      {loading ? (
        <View style={{ marginTop: windowHeight(20), right: windowHeight(7) }}>
          {[1, 2, 3, 4].map((variant) => (
            <View key={variant} style={{ marginBottom: windowHeight(10) }}>
              <SkeletonLoader variant={variant} />
            </View>
          ))}
        </View>
      ) : (
        <>
          <InputText
            title={translateData.userName}
            showTitle={true}
            borderColor={isDark ? appColors.darkBorder : appColors.border}
            backgroundColor={isDark ? appColors.bgDark : appColors.whiteColor}
            placeholder={translateData.enterUserName}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.regularText
            }
            show
            value={form.username}
            onChangeText={(value) => onChange("username", value)}
          />
          <Text
            style={[
              {
                color: isDark ? appColors.whiteColor : appColors.primaryText,
                fontFamily: appFonts.medium,
                textAlign: textRTLStyle,
                top: windowHeight(8),
                marginTop: windowHeight(3.5)
              },
            ]}
          >
            {translateData.mobileNumber}
          </Text>

          <View style={styles.countryMainView}>
            <TouchableNativeFeedback>
              <View>
                <View style={{ flexDirection: viewRTLStyle }}>
                  <View
                    style={[
                      styles.countryCodeContainer,
                      {
                        backgroundColor: isDark
                          ? appColors.bgDark
                          : appColors.whiteColor,
                        borderColor: isDark
                          ? appColors.darkBorder
                          : appColors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShow(true)}
                      style={[
                        styles.countryCode,
                        {
                          backgroundColor: isDark
                            ? appColors.bgDark
                            : appColors.whiteColor,
                          borderColor: appColors.border,
                        },
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
                          backgroundColor: colors.background,
                        },
                        countryName: { color: colors.text },
                        dialCode: { color: colors.text },
                        countryButtonStyles: {
                          backgroundColor: colors.card,
                          flexDirection: viewRTLStyle,
                        },
                        textInput: {
                          backgroundColor: colors.card,
                          color: colors.text,
                          textAlign: textRTLStyle,
                        },
                        line: { borderColor: colors.border },
                      }}
                      lang={""}
                      flatListProps={{
                        contentContainerStyle: { flexDirection: viewRTLStyle },
                      }}
                    />
                    {show && (
                      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                        <View style={styles.touchbleView} />
                      </TouchableWithoutFeedback>
                    )}
                  </View>

                  <View
                    style={[
                      styles.phoneNumberInput,
                      {
                        width: width || "74%",
                        backgroundColor: isDark
                          ? appColors.bgDark
                          : appColors.whiteColor,
                        borderColor: isDark
                          ? appColors.darkBorder
                          : appColors.border,
                      },
                    ]}
                  >
                    <TextInput
                      style={[
                        commonStyles.regularText,
                        {
                          left: isRTL ? windowWidth(145) : windowWidth(13),
                          color: textColorStyle,
                        },
                      ]}
                      placeholderTextColor={
                        isDark ? appColors.darkText : appColors.regularText
                      }
                      placeholder={translateData.enterPhone}
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ bottom: windowHeight(4.6) }}>
            <InputText
              title={translateData.email}
              showTitle={true}
              borderColor={isDark ? appColors.darkBorder : appColors.border}
              backgroundColor={isDark ? appColors.bgDark : appColors.whiteColor}
              placeholder={translateData.enterEmail}
              placeholderTextColor={
                isDark ? appColors.darkText : appColors.regularText
              }
              show
              value={form.email}
              onChangeText={(value) => onChange("email", value)}
            />
          </View>

          <View style={{ flex: 0.67, justifyContent: "space-between" }}>
            <View>
            </View>
            <View style={{ marginBottom: windowHeight(0) }}>
              <Button
                title={translateData.updateProfile}
                onPress={() => updateProfile(form)}
                loading={Update}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}
