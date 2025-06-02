import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ac, Back, Bag, CloseCircle, Right, Star1 } from "@src/utils/icons";
import { CarType } from "@src/assets/icons/carType";
import { FuelType } from "@src/assets/icons/fuelType";
import { Milage } from "@src/assets/icons/milage";
import { GearType } from "@src/assets/icons/gearType";
import { Seat } from "@src/assets/icons/seat";
import { Speed } from "@src/assets/icons/speed";
import { styles } from "./styles";
import { external } from "@src/styles/externalStyle";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RentalBookinginterface } from "@src/api/interface/rentalinterface";
import { rentalRideRequests } from "@src/api/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Button, CommonModal, notificationHelper } from "@src/commonComponent";
import { useValues } from "@App";
import { appColors } from "@src/themes";
import FastImage from "react-native-fast-image";
import Images from "@src/utils/images";

export function RentalCarDetails() {
  const { viewRTLStyle, isDark } = useValues()
  const { translateData } = useSelector((state) => state.setting);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { rentalVehicleListsDetails } = useSelector((state: any) => state.rentalVehicle);
  const [bookLoading, setBookloading] = useState(false);
  const route = useRoute();
  const { startDates, pickUpCoords, pickupLocation, dropLocation, dropCoords, endDates, convertedStartTime, convertedEndTime, getDriver } = route.params;
  const { zoneValue } = useSelector((state: any) => state.zone);





  const modelClose = () => {
    setIsModalVisible(false);
    setBookloading(false);
    goBack();

  }


  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const carDetails = [
    { Icon: CarType, title: rentalVehicleListsDetails.vehicle_subtype },
    { Icon: FuelType, title: rentalVehicleListsDetails.fuel_type },
    { Icon: Milage, title: `${rentalVehicleListsDetails.mileage}` },
    { Icon: GearType, title: rentalVehicleListsDetails.gear_type },
    { Icon: Seat, title: `${rentalVehicleListsDetails?.seatingCapacity || 1} Seat` },
    { Icon: Speed, title: `${rentalVehicleListsDetails.vehicle_speed}` },
    { Icon: Ac, title: rentalVehicleListsDetails.is_ac == 1 ? 'AC' : 'Non AC' },
    { Icon: Bag, title: `${rentalVehicleListsDetails.bag_count}` },
  ];

  const [mainImage, setMainImage] = useState(
    rentalVehicleListsDetails?.normal_image_url
  );

  const bookRental = async () => {
    const is_with_driver = getDriver ? "1" : "0";
    let dropLocations =
      dropLocation && dropLocation.trim() ? dropLocation : pickupLocation;

    let payload: RentalBookinginterface = {
      locations: [`${pickupLocation}`, `${dropLocations}`],
      location_coordinates: [
        {
          lat: `${pickUpCoords.lat}`,
          lng: `${pickUpCoords.lng}`,
        },
        {
          lat: `${dropCoords?.lat ?? pickUpCoords.lat}`,
          lng: `${dropCoords?.lng ?? pickUpCoords.lng}`,
        },
      ],
      service_id: '1',
      service_category_id: "5",
      vehicle_type_id: `${rentalVehicleListsDetails.vehicle_type_id}`,
      rental_vehicle_id: `${rentalVehicleListsDetails.id}`,
      is_with_driver: `${is_with_driver}`,
      payment_method: "cash",
      start_time: `${startDates} ${convertedStartTime}`,
      end_time: `${endDates} ${convertedEndTime}`,
      currency_code: zoneValue?.currency_code
    };

    dispatch(rentalRideRequests(payload))
      .unwrap()
      .then((res) => {

        if (res.id) {
          setIsModalVisible(true);
          notificationHelper("Ride Book", translateData?.bookSuccessfully, "success")
        } else {
          notificationHelper("Book Error", res.message, "error")
        }

      });
  };

  return (
    <View>
      <View style={[styles.backBtn, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
        <Back />
      </View>
      <ScrollView style={{ backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: mainImage }} style={styles.mainImg} />
        </View>
        <View style={[styles.subImgContainer, { flexDirection: viewRTLStyle }, { backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }]}>
          {rentalVehicleListsDetails?.rental_vehicle_galleries
            ?.map((img, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                style={[
                  styles.subImgView,
                  mainImage === img && styles.selectedSubImg,
                ]}
                onPress={() => setMainImage(img)}
              >
                <Image source={{ uri: img }} style={styles.subImg} />
              </TouchableOpacity>
            ))}
        </View>
        <View style={[styles.container]}>
          <View style={[styles.subContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
            <View style={[styles.titleView, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{rentalVehicleListsDetails.name}</Text>
              <View style={[styles.rateContainer, { flexDirection: viewRTLStyle }]}>
                <Star1 />
                <Text style={styles.rating}>4.0</Text>
              </View>
            </View>

            <View style={[styles.detailContainer, { flexDirection: viewRTLStyle }]}>
              <Text style={styles.detail}>{rentalVehicleListsDetails.description}</Text>
              <View style={external.fd_row}>
                <Text style={styles.price}>
                  ${rentalVehicleListsDetails.vehicle_per_day_price}
                  <Text style={styles.day}>/{translateData?.day}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.border, { borderBottomColor: isDark ? appColors.darkBorder : appColors.border }]} />
            <View style={[styles.driverContainer, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData?.driverPriceText}</Text>
              <View style={external.fd_row}>
                <Text style={styles.price}>
                  ${rentalVehicleListsDetails.driver_per_day_charge}
                  <Text style={styles.day}>/{translateData?.day}</Text>
                </Text>
              </View>
            </View>

            <View style={[styles.carDetails, { flexDirection: viewRTLStyle }]}>
              {carDetails?.map((detail, index) => (
                <View key={index} style={[styles.detailIcon, { flexDirection: viewRTLStyle }, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
                  <detail.Icon />
                  <Text style={styles.detailTitle}>{detail.title}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.title, external.mt_5, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData?.moreInfoText}</Text>
            {rentalVehicleListsDetails?.interior?.map((detail: any, index: number) => (
              <Text key={index} style={styles.description}>
                <Right /> {` ${detail}`}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={[external.mv_15]}
            onPress={bookRental}
            activeOpacity={0.7}
          >
            <Button title={translateData?.bookNow} onPress={bookRental} loading={bookLoading} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CommonModal
        isVisible={isModalVisible}
        onPress={() => setIsModalVisible(false)}
        value={
          <View>
            <TouchableOpacity
              style={styles.modelView1}
              onPress={modelClose}
            >
              <CloseCircle />
            </TouchableOpacity>
            <FastImage
              source={Images.success}
              style={styles.gif}
            />
            <Text
              style={[styles.requestSuccess, {
                color: isDark ? appColors.whiteColor : appColors.primaryText,
              }]}
            >
              {translateData?.requestSuccessfullySent}
            </Text>
            <Text
              style={styles.modelSuccess}
            >
              {translateData?.requestSentSuccess}
            </Text>
            <View
              style={styles.modelButtonView}
            >
              <Button title={translateData?.btnOkay} onPress={modelClose} />
            </View>
          </View>
        }
      />
    </View>
  );
}
