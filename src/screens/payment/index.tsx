import { View, Text, Image, TouchableOpacity, Modal, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import { Map, Button } from "@src/commonComponent";
import styles from "./styles";
import Images from "@utils/images";
import { StarEmpty, StarFill } from "@utils/icons";
import { appColors } from "@src/themes";
import { useValues } from "../../../App";
import { DriverData } from "./component/driverData/index";
import { TotalFare } from "./component/totalFare/index";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { allRide } from "@src/api/store/actions/allRideAction";
import { CustomBackHandler } from "@src/components";
import { useAppNavigation } from "@src/utils/navigation";
import { external } from "@src/styles/externalStyle";

export function Payment() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const { linearColorStyle, bgFullStyle, textColorStyle, textRTLStyle, viewRTLStyle } = useValues();
  const { navigate } = useAppNavigation();
  const route = useRoute();
  const { shouldReload } = route.params || {};
  const { rideData } = useSelector((state) => state.allRide);
  const { bidUpdateData } = useSelector((state) => state.bid);
  const [duration, setDuration] = useState(null);
  const { translateData } = useSelector((state) => state.setting);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (rideData?.ride_status?.slug === "completed") {
          clearInterval(interval);
        } else if (bidUpdateData?.id) {
          dispatch(allRide({ ride_id: bidUpdateData.id }));
        }
      }, 5000);
      return () => clearInterval(interval);
    }, [rideData, bidUpdateData])
  );

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handlePress = () => {
    navigate("PaymentMethod", { rideData });
  };

  const review = () => {
    setModalVisible(false);
    navigate("MyTabs");
  };

  useFocusEffect(
    useCallback(() => {
      if (shouldReload) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    }, [shouldReload])
  );

  const handleDurationChange = (newDuration: any) => {
    setDuration(newDuration);
  };

  return (
    <View style={external.main}>
      <CustomBackHandler />
      <View style={styles.mapSection}>
        <Map
          userLocation={rideData?.location_coordinates?.[0] || {}}
          driverLocation={rideData?.location_coordinates?.[1] || {}}
          onDurationChange={handleDurationChange}
        />
      </View>
      <View style={{ flex: 0.3, backgroundColor: linearColorStyle }} />
      <View style={styles.mainView}>
        <DriverData driverDetails={rideData} duration={duration} />
        <View style={[styles.card2, { backgroundColor: bgFullStyle }]}>
          <TotalFare
            handlePress={handlePress}
            fareAmount={rideData?.ride_fare || 0}
            rideStatus={rideData?.ride_status?.slug || ""}
          />
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.bgmodal}>
              <View
                style={[styles.background, { backgroundColor: bgFullStyle }]}
              >
                <Text style={[styles.title, { color: textColorStyle }]}>
                  {translateData.modalTitle}
                </Text>
                <View style={styles.userAlign}>
                  <Image
                    source={Images.profileUser}
                    style={styles.modalImage}
                  />
                  <Text style={[styles.modalName, { color: textColorStyle }]}>
                    {translateData.name}
                  </Text>
                  <Text style={[styles.modalMail, { color: textColorStyle }]}>
                    {translateData.mailID}
                  </Text>
                </View>
                <Image source={Images.lineBottom} style={styles.lineImage} />
                <Text
                  style={[
                    styles.rate,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.driverRating}
                </Text>
                <View
                  style={[
                    styles.containerReview,
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  {[1, 2, 3, 4, 5]?.map((index) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={index}
                      onPress={() => handleStarPress(index)}
                      style={styles.starIcon}
                    >
                      {index <= rating ? <StarFill /> : <StarEmpty />}
                    </TouchableOpacity>
                  ))}

                  <View
                    style={[styles.ratingView, { flexDirection: viewRTLStyle }]}
                  >
                    <View style={styles.borderVertical} />
                    <Text style={[styles.rating, { color: textColorStyle }]}>
                      {rating}/5
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.comment,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.addComments}
                </Text>
                <TextInput
                  style={[
                    styles.textinput,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                  multiline={true}
                  textAlignVertical="top"
                />
                <View style={styles.border2} />
                <Button
                  width={330}
                  backgroundColor={appColors.primary}
                  textColor={appColors.whiteColor}
                  title={translateData.submit}
                  onPress={review}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}
