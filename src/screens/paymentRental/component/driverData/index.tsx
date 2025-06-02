import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import React, { useState } from "react";
import styles from "../../styles";
import { useValues } from "../../../../../App";
import Images from "@utils/images";
import { Call, Message, ShareTrip, SOS } from "@utils/icons";
import { useNavigation } from "@react-navigation/native";
import { ModalContect } from "@src/screens/rideActive/component/modalContect";
import { useSelector } from "react-redux";

export function DriverData({ driverDetails }: { driverDetails: any }) {
  const { bgFullStyle, viewRTLStyle, textColorStyle, textRTLStyle } =
    useValues();
  const { navigate } = useNavigation();
  const [status, setStatus] = useState("ongoing");
  const [modalVisible, setModalVisible] = useState(false);
  const { translateData } = useSelector((state) => state.setting);

  const gotoChat = (item) => {
    navigate("ChatScreen", {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      driverName: item?.driver?.name,
      driverImage: item?.driver?.profile_image?.original_url,
    });
  };

  const gotoCall = (item) => {
    const phoneNumber = `${item?.driver?.phone}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSOS = () => {
    setModalVisible(true);
  };

  return (
    <View style={[styles.card1, { backgroundColor: bgFullStyle }]}>
      <View style={[styles.subCard1, { flexDirection: viewRTLStyle }]}>
        <View style={{ flexDirection: viewRTLStyle }}>
          <Image source={Images.profileUser} style={styles.driverImage} />
          <View style={styles.details}>
            <Text style={[styles.name, { color: textColorStyle }]}>
              {driverDetails.driver.name}
            </Text>
            <View style={{ flexDirection: viewRTLStyle }}>
              <Text style={[styles.rating, { color: textColorStyle }]}>
                4.8
              </Text>
              <Text style={styles.totalReview}>(127)</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: viewRTLStyle }}>
          <TouchableOpacity style={styles.call} onPress={handleSOS} activeOpacity={0.7}
          >
            <SOS />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.message}
            onPress={() => gotoChat(driverDetails)}
            activeOpacity={0.7}
          >
            <Message />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.call}
            onPress={() => gotoCall(driverDetails)}
          >
            <Call />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[
          styles.number,
          { color: textColorStyle, textAlign: textRTLStyle },
        ]}
      >
        CLMV069
      </Text>
      <View style={[styles.taxiDetail, { flexDirection: viewRTLStyle }]}>
        <Text style={[styles.taxiType, { color: textColorStyle }]}>
          {translateData?.texiDetail}
        </Text>
        {status === "ongoing" ? (
          <View
            style={{
              flexDirection: viewRTLStyle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShareTrip color={textColorStyle} />
            <Text
              style={[
                styles.share,
                { color: textColorStyle, marginBottom: 10 },
              ]}
            >
              {translateData?.shareTrip}
            </Text>
          </View>
        ) : null}
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ModalContect onpress={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
}
