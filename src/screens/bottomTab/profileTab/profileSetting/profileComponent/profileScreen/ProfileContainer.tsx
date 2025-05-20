import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Pressable,
  Text,
  View,
  Share,
  TouchableOpacity,
} from "react-native";
import { external } from "../../../../../../styles/externalStyle";
import {
  useProfileData,
  useGuestData,
} from "../../../../../../data/profileData/index";
import { Button, notificationHelper, SolidLine } from "@src/commonComponent";
import { BackArrow, Delete, Logout } from "@utils/icons";
import { styles } from "./style";
import { useValues } from "../../../../../../../App";
import { clearValue, getValue } from "@src/utils/localstorage";
import { resetState } from "@src/api/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { CommonModal } from "@src/commonComponent";
import { homeScreenPrimary, settingDataGet } from "@src/api/store/actions";
import { appColors, windowHeight } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { useLoadingContext } from "@src/utils/context";
import { accountDelete } from "@src/api/store/actions";

export const ProfileContainer = forwardRef((props, ref) => {
  const {
    textRTLStyle,
    viewRTLStyle,
    bgFullStyle,
    textColorStyle,
    linearColorStyle,
    imageRTLStyle,
    t,
    isDark,
    setIsRTL,
    setIsDark,
  } = useValues();
  const [visibleDelete, setModelVisibleDelete] = useState(false);
  const [visibleLogout, setModelVisiblelogout] = useState(false);
  const { navigate, reset } = useAppNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const { settingData, translateData } = useSelector(
    (state: any) => state.setting
  );
  const profileData = useProfileData();
  const guestData = useGuestData();


  useImperativeHandle(ref, () => ({
    gotoLogout,
    gotoLoginWithoutNotification,
  }));

  useEffect(() => {
    const Tokenvalue = async () => {
      const value = await getValue("token");
      setToken(value);
    };
    Tokenvalue();
  }, []);

  const handlePress = (screenName: any) => {
    if (screenName !== "Share") {
      navigate(screenName);
    } else {
      Share.share({
        message:
          "https://play.google.com/store/apps/details?id=com.taxidouser&hl=en-IN",
      });
    }
  };


  const gotoLogout = () => {
    clearValue();
    dispatch(resetState());
    setIsRTL();
    setIsDark();
    dispatch(settingDataGet());
    notificationHelper("Logout", translateData?.logoutMsg ?  translateData?.logoutMsg : "Logout Msg", "error");
    reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
    dispatch(homeScreenPrimary());
  };

  const gotoLoginWithoutNotification = () => {
    reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const closeModal = () => {
    setModelVisibleDelete(false);
    setModelVisiblelogout(false);
  };

  const deleteAccount = () => {
    setModelVisibleDelete(true);
  };

  const logoutAccount = () => {
    setModelVisiblelogout(true);
  };

  const deleteAccounts = () => {
    dispatch(accountDelete());
    notificationHelper("Account Delete", translateData?.accountDelete ? translateData?.accountDelete : "Account Delete", "error")
    reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
    dispatch(homeScreenPrimary())
  };

  const closeModalDelete = () => {
    setModelVisibleDelete(false);
  };

  return (
    <View style={[external.mh_20]}>
      {(token ? profileData : guestData)?.map((section, index) => (
        <View key={index}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}
          >
            {section.title}
          </Text>
          <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
            {section?.data?.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                onPress={() => handlePress(item.screenName)}
                style={styles.pressableView}
              >
                <View
                  style={[
                    external.fd_row,
                    external.ai_center,
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  <View
                    style={[
                      styles.itemContainer,
                      { backgroundColor: linearColorStyle },
                    ]}
                  >
                    {item.icon}
                  </View>
                  <Text
                    style={[
                      styles.titleText,
                      { color: textColorStyle, textAlign: textRTLStyle },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <View style={{ transform: [{ scale: imageRTLStyle }] }}>
                    <BackArrow />
                  </View>
                </View>
                {itemIndex !== section.data.length - 1 && (
                  <View style={styles.lineHeight}>
                    <SolidLine
                      color={isDark ? appColors.darkBorder : appColors.border}
                    />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {token ? (
        <View
          style={[
            {
              backgroundColor: appColors.whiteColor,
              borderColor: isDark ? appColors.darkPrimary : appColors.iconRed,
            },
            styles.alertManu,
          ]}
        >
          <Text
            style={[
              styles.alertTitle,
              { textAlign: textRTLStyle },
              { color: appColors.alertRed },
            ]}
          >
            {translateData.alertZone}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.listView, { flexDirection: viewRTLStyle }]}
            onPress={deleteAccount}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: appColors.iconRed },
              ]}
            >
              <Delete iconColor={appColors.alertRed} />
            </View>
            <Text style={[styles.listTitle, { color: appColors.alertRed }]}>
              {translateData.deleteAccount}
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.alertBorder,
              { borderColor: isDark ? appColors.warnBg : appColors.iconRed },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.listView, { flexDirection: viewRTLStyle }]}
            onPress={logoutAccount}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: appColors.iconRed },
              ]}
            >
              <Logout iconColor={appColors.alertRed} />
            </View>
            <Text style={[styles.listTitle, { color: appColors.alertRed }]}>
              {translateData.logout}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <CommonModal
        isVisible={visibleDelete}
        closeModal={closeModal}
        onPress={() => setModelVisibleDelete(false)}
        value={
          <View>
            <View style={styles.modelView}>
              <Text
                style={[
                  styles.modelTitle,
                  {
                    color: textColorStyle,
                  },
                ]}
              >
                {translateData.deleteConfirm}
              </Text>
            </View>
            <View style={[styles.modelButton, { flexDirection: viewRTLStyle }]}>
              <Button
                backgroundColor={
                  isDark ? appColors.darkHeader : appColors.lightGray
                }
                title={translateData.cancel}
                width={"48%"}
                textColor={textColorStyle}
                onPress={closeModalDelete}
              />
              <Button
                backgroundColor={appColors.textRed}
                title={translateData.deleteBtn}
                width={"48%"}
                textColor={appColors.whiteColor}
                onPress={deleteAccounts}
              />
            </View>
          </View>
        }
      />

      <CommonModal
        isVisible={visibleLogout}
        closeModal={closeModal}
        onPress={() => setModelVisiblelogout(false)}
        value={
          <View>
            <View style={styles.modelView}>
              <Text
                style={[
                  styles.modelTitle,
                  {
                    color: textColorStyle,
                  },
                ]}
              >
                {translateData.logoutConfirm}
              </Text>
            </View>
            <View style={[styles.modelButton, { flexDirection: viewRTLStyle }]}>
              <Button
                backgroundColor={
                  isDark ? appColors.darkHeader : appColors.lightGray
                }
                title={translateData.cancel}
                width={"48%"}
                textColor={textColorStyle}
                onPress={closeModal}
              />
              <Button
                backgroundColor={appColors.textRed}
                title={translateData.logout}
                width={"48%"}
                textColor={appColors.whiteColor}
                onPress={gotoLogout}
              />
            </View>
          </View>
        }
      />
      <CommonModal
        isVisible={visibleLogout}
        closeModal={closeModal}
        onPress={() => setModelVisiblelogout(false)}
        value={
          <View>
            <View style={styles.modelView}>
              <Text style={[styles.modelTitle, { color: textColorStyle }]}>
                {translateData.logoutConfirm}
              </Text>
            </View>
            <View style={[styles.modelButton, { flexDirection: viewRTLStyle }]}>
              <Button
                backgroundColor={
                  isDark ? appColors.darkHeader : appColors.lightGray
                }
                title={translateData.cancel}
                width="48%"
                textColor={textColorStyle}
                onPress={closeModal}
              />
              <Button
                backgroundColor={appColors.textRed}
                title={translateData.logout}
                width="48%"
                textColor={appColors.whiteColor}
                onPress={gotoLogout}
              />
            </View>
          </View>
        }
      />
    </View>
  );
});
