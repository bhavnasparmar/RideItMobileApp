import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import React, { useState } from "react";
import { Header } from "@src/commonComponent";
import { commonStyles } from "@src/styles/commonStyle";
import styles from "./component/selectMethod/styles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useValues } from "@App";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { Button, RadioButton } from "@src/commonComponent";
import { useDispatch, useSelector } from "react-redux";
import { walletTopUpData } from "../../api/store/actions/index";
import { WalletTopUpDatainterface } from "@src/api/interface/walletInterface";
import { CustomBackHandler } from "@src/components";
import { SkeltonAppPage } from "../bottomTab/profileTab/appPageScreen/component";
import { getValue } from "@src/utils/localstorage";

export function TopUpWallet() {
  const { colors } = useTheme();
  const { viewRTLStyle, isDark, bgFullLayout, linearColorStyle, textColorStyle, textRTLStyle } = useValues();
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { paymentMethodData } = useSelector((state) => state.payment);
  const { loading } = useSelector((state) => state.wallet);
  const activePaymentMethods = paymentMethodData?.filter((method) => method?.status == true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { translateData } = useSelector((state) => state.setting);
  const [topupLoading, setTopuploading] = useState(false);
  const { zoneValue } = useSelector((state: any) => state.zone);



  const paymentData = (index: number, name: any) => {
    setSelectedItem(index === selectedItem ? null : index);
    setSelectedPaymentMethod(index === selectedItem ? null : name);
  };

  const addBalance = async () => {
    const currencyCode = await getValue('selectedCurrency')

    let payload: WalletTopUpDatainterface = {
      amount: amount,
      payment_method: selectedPaymentMethod,
      currency_code: currencyCode
    };
    dispatch(walletTopUpData(payload))
      .unwrap()
      .then(async (res: any) => {

        if (res?.is_redirect) {
          navigate("PaymentWebView", {
            url: res.url,
            selectedPaymentMethod: selectedPaymentMethod,
          });
          setTopuploading(loading)
        }
      })
      .catch((error) => {
        console.error("Redux Thunk Error:", error);
      });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => paymentData(index, item?.slug)} activeOpacity={0.7}
    >
      <View
        style={{
          flexDirection: viewRTLStyle,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: windowHeight(6),
        }}
      >
        <View
          style={[
            styles.modalPaymentView,
            {
              backgroundColor: isDark ? bgFullLayout : appColors.whiteColor,
              flexDirection: viewRTLStyle,
            },
          ]}
        >
          <CustomBackHandler />
          <View style={{ flexDirection: viewRTLStyle, flex: 1 }}>
            <View style={styles.imageBg}>
              <Image source={{ uri: item.image }} style={styles.paymentImage} />
            </View>
            <View style={styles.mailInfo}>
              <Text style={[styles.mail, { color: textColorStyle }]}>
                {item.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.payBtn, { marginLeft: 0 }]}>
          <RadioButton checked={index === selectedItem} color={appColors.primary} onPress={() => paymentData(index, item?.slug)} />
        </View>
      </View>
      {index !== paymentMethodData.length - 1 && (

        <View style={{
          borderBottomWidth: windowHeight(0.3),
          borderColor: colors.border, marginHorizontal: windowWidth(8)
        }}
        />
      )}
    </TouchableOpacity>
  );


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={commonStyles.flexContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={commonStyles.flexContainer}>
          <Header value={translateData.topupWallet} />
          <View
            style={{
              backgroundColor: isDark ? linearColorStyle : appColors.lightGray,
              height: "100%",
            }}
          >
            <View style={styles.mainContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.title,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.selectMethod}
                </Text>
              </View>

              <View
                style={[
                  styles.container,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <View style={{
                      paddingHorizontal: windowHeight(12), paddingVertical: windowHeight(10), top: windowHeight(0), borderBottomWidth: windowHeight(0.3), marginHorizontal: windowHeight(4),
                      borderColor: colors.border
                    }}>
                      <SkeltonAppPage />
                    </View>
                  ))
                ) : (
                  <FlatList
                    data={paymentMethodData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>

              <View style={[styles.dashBorder, { borderColor: textColorStyle }]} />
              <Text
                style={[
                  styles.titleTopup,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}
              >
                {translateData.addTopupBalance}
              </Text>
              <Text
                style={[
                  styles.titleAmount,
                  {
                    color: isDark ? textColorStyle : appColors.regularText,
                    textAlign: textRTLStyle,
                  },
                ]}
              >
                {translateData.enterAmount}
              </Text>

              <View
                style={[
                  styles.inputView,
                  {
                    backgroundColor: isDark ? appColors.darkPrimary : colors.card,
                    flexDirection: viewRTLStyle,
                    borderColor: isDark ? appColors.darkBorder : colors.border,
                  },
                ]}
              >
                <Text style={styles.icons}>
                  {zoneValue.currency_symbol}
                </Text>
                <TextInput
                  style={[
                    styles.textinput,
                    {
                      backgroundColor: isDark ? appColors.darkPrimary : colors.card,
                      color: colors.text,
                    },
                  ]}
                  placeholder={translateData.amount}
                  placeholderTextColor={appColors.regularText}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                />
              </View>
            </View>
          </View>
          <View style={styles.addBtn}>
            <Button loading={topupLoading} title={translateData.addBalance} onPress={addBalance} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}
