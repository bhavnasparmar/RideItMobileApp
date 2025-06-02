import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Header, Button, RadioButton } from "@src/commonComponent";
import { useValues } from "../../../App";
import styles from "./styles";
import { appColors } from "@src/themes";
import { paymentsData } from "../../api/store/actions/paymentAction";
import { useDispatch, useSelector } from "react-redux";
import PaymentDetails from "./component";
import { allpayment } from "@src/api/store/actions";
import { CustomBackHandler } from "@src/components";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { external } from "@src/styles/externalStyle";

export function PaymentMethod() {
  const { navigate } = useAppNavigation();
  const route = useAppRoute();
  const dispatch = useDispatch();
  const { rideData } = route.params || {};
  const { zoneValue } = useSelector((state) => state.zone);
  const { translateData } = useSelector((state) => state.setting);
  const { linearColorStyle, bgContainer, textColorStyle, textRTLStyle, viewRTLStyle, isDark } = useValues();
  const tipValues = [
    zoneValue?.currency_symbol + 5,
    zoneValue?.currency_symbol + 10,
    zoneValue?.currency_symbol + 15,
    translateData?.custom,
  ];
  const [selectedValue, setSelectedValue] = useState(null);
  const [customTip, setCustomTip] = useState();
  const { paymentMethodData } = useSelector((state: any) => state.payment);
  const [coupon, setCoupon] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [inputValue, setInputValue] = useState(coupon?.code || "");

  useEffect(() => {
    setInputValue(coupon?.code || "");
  }, [coupon]);

  useEffect(() => {
    dispatch(paymentsData());
  }, []);

  const handlePressTips = (value: any) => {
    setSelectedValue((prevValue) => (prevValue === value ? null : value));

    if (value !== (translateData?.custom)) {
      setCustomTip("");
    }
  };

  const goBack = () => {
    navigate("Payment", { shouldReload: true });
  };

  const paymentData = (index: number, name: any) => {
    setSelectedItem(index === selectedItem ? null : index);
    setSelectedPaymentMethod(index === selectedItem ? null : name);
  };

  const calculateTipAmount = () => {
    if (selectedValue === ("payment.custom")) {
      return parseFloat(customTip) || 0;
    }
    return parseFloat(selectedValue?.replace(zoneValue?.currency_symbol, "")) || 0;
  };

  const calculateCouponDiscount = (totalBill) => {
    if (!coupon || !coupon.type) return 0;
    if (coupon.type === "fixed") {
      return parseFloat(coupon.amount);
    }
    if (coupon.type === "percentage") {
      return (totalBill * parseFloat(coupon.amount)) / 100;
    }
    return 0;
  };

  const handlePress = () => {
    const isCouponValid = coupon && coupon.code === inputValue;
    setIsValid(isCouponValid);

    if (isCouponValid) {
      const totalBill =
        rideData?.ride_fare +
        rideData?.tax +
        Math.round(rideData?.platform_fees);
      if (totalBill < coupon?.min_spend) {
        setSuccessMessage(
          `${translateData?.minimumSpend} ${coupon?.min_spend} ${translateData?.requiredCoupons}`
        );
      } else {
        setSuccessMessage(`${translateData?.couponsApply}`);
      }
    } else {
      setSuccessMessage("");
      setCoupon(null);
    }
  };

  const gotoCoupon = () => {
    navigate("PromoCodeScreen", { from: "payment", getCoupon });
  };

  const getCoupon = (val) => {
    setCoupon(val);
  };

  const gotoPay = async () => {
    const formattedCoupon = inputValue.replace("#", "");

    let payload: PaymentInterface = {
      ride_id: rideData.id,
      driver_tip: 10,
      commnet: "Excellet Ride",
      coupon: formattedCoupon,
      payment_method: selectedPaymentMethod,
    };
    dispatch(allpayment(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.is_redirect && res?.url) {
          navigate("PaymentWebView", {
            url: res.url,
            selectedPaymentMethod: selectedPaymentMethod,
          });
        }
      });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => paymentData(index, item?.slug)} activeOpacity={0.7}
    >
      <View
        style={[
          styles.modalPaymentView,
          { backgroundColor: bgContainer, flexDirection: viewRTLStyle },
        ]}
      >
        <CustomBackHandler />
        <View style={[external.main, { flexDirection: viewRTLStyle }]}>
          <View style={styles.imageBg}>
            <Image source={{ uri: item.image }} style={styles.paymentImage} />
          </View>
          <View style={styles.mailInfo}>
            <Text
              style={[
                styles.mail,
                { color: textColorStyle, textAlign: textRTLStyle },
              ]}
            >
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.7}
        >
          <RadioButton

            checked={index === selectedItem}
            color={appColors.primary}
          />
        </TouchableOpacity>
      </View>
      {index !== 3 ? <View style={styles.borderPayment} /> : null}
    </TouchableOpacity>
  );

  const totalBill =
    rideData?.ride_fare +
    rideData?.tax +
    calculateTipAmount() +
    Math.round(rideData?.platform_fees);
  const couponDiscount = calculateCouponDiscount(totalBill);
  const finalBill = totalBill - couponDiscount;

  return (
    <ScrollView style={[external.main, { backgroundColor: linearColorStyle }]}>
      <View style={styles.headerView}>
        <Header value={translateData?.payment} />
      </View>
      <View style={styles.sideSpace}>
        <Text
          style={[
            styles.tips,
            { color: textColorStyle, textAlign: textRTLStyle },
          ]}
        >
          {translateData?.tip}
        </Text>

        <View style={[styles.buttonContainer, { flexDirection: viewRTLStyle }]}>
          {tipValues?.map((value, index) => (
            <TouchableOpacity
              activeOpacity={0.7}

              key={index}
              style={[
                styles.button,
                {
                  borderColor:
                    selectedValue === value
                      ? appColors.primary
                      : isDark
                        ? appColors.darkBorder
                        : appColors.border,
                  backgroundColor: bgContainer,
                },
              ]}
              onPress={() => handlePressTips(value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedValue === value ? appColors.primary : "#797D83",
                  },
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedValue === "Custom" ? (
          <TextInput
            style={[
              styles.inputTip,
              {
                backgroundColor: bgContainer,
                color: textColorStyle,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              },
            ]}
            placeholder={translateData?.tipAmount}
            placeholderTextColor={appColors.regularText}
            keyboardType="number-pad"
            value={customTip}
            onChangeText={(text) => setCustomTip(text)}
          />
        ) : null}
        <View
          style={[
            styles.containerCoupon,
            { flexDirection: viewRTLStyle },
            {
              backgroundColor: bgContainer,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: textColorStyle }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={translateData?.applyPromoCode}
            placeholderTextColor={appColors.regularText}
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={handlePress} activeOpacity={0.7}
          >
            <Text style={styles.buttonAddText}>{translateData?.apply}</Text>
          </TouchableOpacity>
        </View>

        <View>
          {!isValid && (
            <Text style={styles.invalidPromoText}>
              {translateData?.invalidPromo}
            </Text>
          )}
          {successMessage && (
            <Text style={styles.successMessage}>{successMessage}</Text>
          )}
          <TouchableOpacity onPress={gotoCoupon} activeOpacity={0.7}
          >
            <Text style={styles.viewCoupon}>{translateData?.allCoupon}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.bill, { color: textColorStyle }]}>
          {translateData?.billSummary}
        </Text>
        <View
          style={[
            styles.billContainer,
            {
              backgroundColor: bgContainer,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
            },
          ]}
        >
          <PaymentDetails
            title={translateData?.rideFare}
            rideAmount={rideData?.ride_fare}
          />
          <PaymentDetails
            title={translateData?.tax}
            rideAmount={rideData?.tax}
          />
          {calculateTipAmount() > 0 && (
            <View style={[styles.rideContainer, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.billTitle, { color: textColorStyle }]}>{translateData?.driverTips}</Text>
              <Text style={{ color: textColorStyle }}>{selectedValue}</Text>
            </View>
          )}
          <PaymentDetails
            title={translateData?.platformFees}
            rideAmount={Math.round(rideData?.platform_fees)}
          />
          {coupon && isValid && couponDiscount > 0 && (
            <PaymentDetails
              title={translateData?.couponSavings}
              rideAmount={`${couponDiscount.toFixed(2)}`}
            />
          )}
          <View
            style={[
              styles.billBorder,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}
          />
          <View style={[styles.totalBillView, { flexDirection: viewRTLStyle }]}>
            <Text style={[styles.billTitle, { color: textColorStyle }]}>
              {translateData?.totalBill}
            </Text>
            <Text style={styles.totalAmount}>{zoneValue?.currency_symbol}{(zoneValue?.exchange_rate * Number(finalBill)).toFixed(2)}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.payment,
            { color: textColorStyle, textAlign: textRTLStyle },
          ]}
        >
          {translateData?.paymentMethod}
        </Text>
        <View
          style={[
            styles.paymentContainer,
            { borderColor: isDark ? appColors.darkBorder : appColors.border },
          ]}
        >
          <FlatList
            data={zoneValue?.payment_method}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
        <View style={styles.buttonContainer2}>
          <Button
            backgroundColor={appColors.primary}
            textColor={appColors.whiteColor}
            title={translateData?.proceedtoPay}
            onPress={gotoPay}
          />
        </View>
      </View>
    </ScrollView>
  );
}
