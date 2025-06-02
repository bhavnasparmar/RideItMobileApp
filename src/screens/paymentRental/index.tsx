import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Button } from "@src/commonComponent";
import styles from "./styles";
import Images from "@utils/images";
import { Back, StarEmpty, StarFill } from "@utils/icons";
import { appColors } from "@src/themes";
import { useValues } from "../../../App";
import { MapIcon } from "../rideActive/component/mapIcon/index";
import { DriverData } from "./component/driverData/index";
import { TotalFare } from "./component/totalFare/index";
import { useFocusEffect } from "@react-navigation/native";
import { LocationContext } from "../../utils/locationContext";
import { useDispatch, useSelector } from "react-redux";
import { allRide } from "@src/api/store/actions/allRideAction";
import MapView, { Marker, Polyline } from "react-native-maps";
import { paymentsData } from "@src/api/store/actions";
import { CustomBackHandler } from "@src/components";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { external } from "@src/styles/externalStyle";

const calculateBearing = (startLat, startLng, endLat, endLng) => {
  const toRadians = (degree) => degree * (Math.PI / 180);
  const toDegrees = (radian) => radian * (180 / Math.PI);

  const lat1 = toRadians(startLat);
  const lat2 = toRadians(endLat);
  const dLng = toRadians(endLng - startLng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
};

export function PaymentRental() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const {
    linearColorStyle,
    bgFullStyle,
    textColorStyle,
    textRTLStyle,
    viewRTLStyle,
  } = useValues();

  const { navigate } = useAppNavigation();
  const route = useAppRoute();
  const { shouldReload } = route.params || {};
  const context = useContext(LocationContext);
  const { rideData } = useSelector((state) => state.allRide);
  const { bidUpdateData } = useSelector((state) => state.bid);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const markerRef = useRef(null);
  const previousLocation = useRef(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(paymentsData());
  }, []);

  useEffect(() => {
    if (isRunning && rideData?.start_time) {
      const timerInterval = setInterval(() => {
        const now = new Date();

        const [hours, minutes, seconds] = rideData.start_time
          .split(":")
          .map(Number);
        const startTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes,
          seconds
        );

        if (!isNaN(startTime.getTime())) {
          const secondsGap = Math.floor(
            (now.getTime() - startTime.getTime()) / 1000
          );
          setElapsedSeconds(secondsGap);

          const hrs = Math.floor(secondsGap / 3600)
            .toString()
            .padStart(2, "0");
          const mins = Math.floor((secondsGap % 3600) / 60)
            .toString()
            .padStart(2, "0");
          const secs = (secondsGap % 60).toString().padStart(2, "0");

          setElapsedTime(`${hrs}:${mins}:${secs}`);
        } else {
          console.error("Invalid start time format:", rideData.start_time);
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [isRunning, rideData?.start_time]);

  const startTrackingLocation = () => {
    getCurrentLocation();
    const locationInterval = setInterval(() => {
      getCurrentLocation();
    }, 5000);
    return () => clearInterval(locationInterval);
  };

  const getCurrentLocation = () => {
    const newLocation = {
      latitude: rideData?.driver?.location[0]?.lat,
      longitude: rideData?.driver?.location[0]?.lng,
    };
    if (previousLocation.current) {
      const newHeading = calculateBearing(
        previousLocation.current.latitude,
        previousLocation.current.longitude,
        newLocation.latitude,
        newLocation.longitude
      );
      setHeading(newHeading);
      const distance = calculateDistance(
        previousLocation.current.latitude,
        previousLocation.current.longitude,
        newLocation.latitude,
        newLocation.longitude
      );
      setDistanceCovered((prevDistance) => prevDistance + distance);
    }
    animateMarker(newLocation);
    setLocation(newLocation);
    setCoordinates((prevCoords) => [...prevCoords, newLocation]);
    previousLocation.current = newLocation;
  };

  const animateMarker = (newLocation) => {
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(newLocation, 500);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (rideData?.ride_status?.name === "Completed") {
          clearInterval(interval);
        } else {
          dispatch(allRide({ ride_id: bidUpdateData?.id }));
        }
      }, 5000);
      return () => clearInterval(interval);
    }, [rideData, bidUpdateData])
  );

  useEffect(() => {
    return () => clearInterval(startTrackingLocation);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (rideData?.ride_status?.name === "Completed") {
          clearInterval(interval);
        } else {
          dispatch(allRide({ ride_id: bidUpdateData?.id }));
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

  const gotoback = () => { };

  return (
    <View style={external.main}>
      <CustomBackHandler />
      <View style={styles.mapSection}>
        {rideData ? (
          <>
            <MapView
              style={external.main}
              initialRegion={{
                latitude: rideData?.driver?.location[0].lat,
                longitude: rideData?.driver?.location[0].lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={false}
            >
              <Polyline
                coordinates={coordinates}
                strokeColor="green"
                strokeWidth={5}
              />
              <Marker.Animated
                ref={markerRef}
                coordinate={{
                  latitude: rideData?.driver?.location[0].lat,
                  longitude: rideData?.driver?.location[0].lng,
                }}
                rotation={heading}
              ></Marker.Animated>
            </MapView>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Image source={{ uri: "" }} style={styles.image} />
          </View>
        )}
      </View>
      <View style={{ flex: 0.3, backgroundColor: linearColorStyle }} />
      <TouchableOpacity onPress={gotoback} style={styles.backIconView} activeOpacity={0.7}
      >
        <Back />
      </TouchableOpacity>
      <View style={[styles.viewMain, { flexDirection: viewRTLStyle }]}>
        <View
          style={[
            styles.usedView,
            { flexDirection: viewRTLStyle },
            {
              backgroundColor:
                elapsedTime > `${rideData?.hourly_package?.hour}:00:00`
                  ? appColors.alertRed
                  : appColors.primary,
            },
          ]}
        >
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData?.used}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>{elapsedTime}</Text>
          </View>
          <View style={styles.totalMainView} />
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData?.total}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {rideData?.hourly_package?.hour}:00:00
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.usedView,
            { flexDirection: viewRTLStyle },
            {
              backgroundColor:
                distanceCovered / 1000 > rideData?.hourly_package?.distance
                  ? appColors.alertRed
                  : appColors.primary,
            },
          ]}
        >
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData?.used}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {(distanceCovered / 1000).toFixed(1)}KM
            </Text>
          </View>
          <View style={styles.totalMainView} />
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData?.total}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {rideData?.hourly_package?.distance}
              {rideData?.hourly_package?.distance_type}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.mainView}>
        <MapIcon />
        <DriverData driverDetails={rideData} />
        <View style={[styles.card2, { backgroundColor: bgFullStyle }]}>
          <TotalFare
            handlePress={handlePress}
            fareAmount={rideData?.ride_fare}
            rideStatus={rideData?.ride_status?.name}
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
                  {translateData?.modalTitle}
                </Text>
                <View style={styles.userAlign}>
                  <Image
                    source={Images.profileUser}
                    style={styles.modalImage}
                  />
                  <Text style={[styles.modalName, { color: textColorStyle }]}>
                    {translateData?.name}
                  </Text>
                  <Text style={[styles.modalMail, { color: textColorStyle }]}>
                    {translateData?.mailID}
                  </Text>
                </View>
                <Image source={Images.lineBottom} style={styles.lineImage} />
                <Text
                  style={[
                    styles.rate,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData?.driverRating}
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
                  {translateData?.addComments}
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
                <View style={styles.buttonView}>
                  <Button
                    width={330}
                    backgroundColor={appColors.primary}
                    textColor={appColors.whiteColor}
                    title={translateData?.submit}
                    onPress={review}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}
