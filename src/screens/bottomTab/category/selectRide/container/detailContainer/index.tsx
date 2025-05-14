import { Image, Text, TouchableOpacity, View, BackHandler, TextInput, FlatList, Pressable, ScrollView, } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { external } from "../../../../../../styles/externalStyle";
import { styles } from "./styles";
import { Button, LineContainer, SolidLine, CommonModal, RadioButton, notificationHelper, } from "@src/commonComponent";
import { KmDetails } from "../packageContainer/index";
import { LocationTime } from "../locationTime/index";
import { commonStyles } from "../../../../../../styles/commonStyle";
import { appColors } from "@src/themes";
import * as turf from "@turf/turf";
import { UserFill, Close, Back, User, Card, NewContact, Forword, } from "@utils/icons";
import LinearGradient from "react-native-linear-gradient";
import { ModalContainer } from "../../../../../../components/modalContainer/index";
import { feesPolicies, modelData, } from "../../../../../../data/modelData/index";
import Images from "@utils/images";
import { useValues } from "../../../../../../../App";
import { BookRideItem } from "../../../../../bookRide/bookRideItem/index";
import { fontSizes, windowHeight } from "@src/themes";
import { ModalContainers } from "../../../../../bookRide/modalContainer/index";
import { useDispatch, useSelector } from "react-redux";
import { vehicleTypeDataGet } from "../../../../../../api/store/actions/vehicleTypeAction";
import MapView, { Marker, Polygon } from "react-native-maps";
import darkMapStyle from "@src/screens/darkMapStyle";
import { WebView } from "react-native-webview";
import { CustomMarker } from "@src/components";
import { allDriver } from "@src/api/store/actions";
import { CancelRender } from "@src/screens/cancelFare/cancelRenderItem/index";
import { bidDataGet } from "@src/api/store/actions/bidAction";
import { getValue } from "@src/utils/localstorage";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { URL } from "@src/api/config";
import { LocationContext } from "@src/utils/locationContext";

export function DetailContainer() {
  const route = useAppRoute();
  const context = useContext(LocationContext);
  const { textColorStyle, bgContainer, textRTLStyle, viewRTLStyle, isDark, bgFullLayout, } = useValues();
  const { pickupLocation, service_ID, zoneValue, service_category_ID } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [visible, setModelVisible] = useState(false);
  const { navigate, goBack } = useAppNavigation();
  const [height, setHeight] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selected, setSelected] = useState(false);
  const { driverData } = useSelector((state) => state.allDriver);
  const { vehicleTypedata = null } = useSelector((state) => state?.vehicleType || {});
  const selectedVehicleData = Array.isArray(vehicleTypedata) ? vehicleTypedata.find((item) => item?.id === selectedItem) : null;
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const ZoneArea = zoneValue?.locations
  const [subZone, setSubZone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState("googleMap");
  const [fareValue, setFareValue] = useState(0);
  const [Warning, setWarning] = useState(false);
  const [RideBooked, setRideBooked] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [rideID, setRideId] = useState(null);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState({ hour: null, distance: null, id: null, distanceType: null });
  const [packageVehicle, setPackageVehicle] = useState();
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [vehicleSelectModal, setVehicleSelectModal] = useState(false);
  const [radiusPerVertex, setRadiusPerVertex] = useState(null);
  const [incrementDistance, setIncrementDistance] = useState(0.5);
  const [perimeter, setPerimeter] = useState(0);
  const [driverMessages, setDriverMessages] = useState([]);
  const intervalRef = useRef(null);
  const [startDriverRequest, setStartDriverRequest] = useState(false);
  const allLocations = [pickupLocation];
  const allLocationCoords = [pickupCoords];
  const { bidValue } = useSelector((state) => state.bid);
  const [activeRideRequest, setActivateRideRequest] = useState(false);
  const { translateData, taxidoSettingData } = useSelector((state) => state.setting);
  const filteredVehicle = packageVehicle?.find((vehicle) => vehicle?.id === selectedItem);
  const packageTotalMinutes = selectedPackageDetails?.hour * 60;
  const packageTotalDistance = selectedPackageDetails.distanceType == 'mile' ? selectedPackageDetails.distance * 1.60934 : selectedPackageDetails.distance;
  const minPerMinCharge = Number(filteredVehicle?.min_per_min_charge) || 0;
  const minPerUnitCharge = Number(filteredVehicle?.min_per_unit_charge) || 0;
  const maxPerMinCharge = Number(filteredVehicle?.max_per_min_charge) || 0;
  const maxPerUnitCharge = Number(filteredVehicle?.max_per_unit_charge) || 0;
  const totalMinutes = Number(packageTotalMinutes) || 0;
  const totalDistance = Number(packageTotalDistance) || 0;
  const minPackageCharge = minPerMinCharge * totalMinutes + minPerUnitCharge * totalDistance;
  const maxPackageCharge = maxPerMinCharge * totalMinutes + maxPerUnitCharge * totalDistance;
  const recommendedPackageCharge = minPackageCharge;

  const renderItemRequest = ({ item }) => (
    <CancelRender item={item} pickupLocation={pickupLocation} />
  );

  useEffect(() => {
    const showRequest = () => {
      if (
        Array.isArray(bidValue?.data) &&
        bidValue.data.length > 0 &&
        activeRideRequest
      ) {
        setRideBooked(true);
      }
    };
    showRequest();
  }, [bidValue]);

  const handlePackageSelection = (details) => {
    setSelectedPackageDetails(details);
  };

  const handlepackagevehicle = (vehicleDetails) => {
    setPackageVehicle(vehicleDetails);
  };

  const calculatePerimeter = (points) => {
    if (points.length < 2) return 0;
    const line = turf.lineString(points?.map((p) => [p.lng, p.lat]));
    return turf.length(line, { units: "kilometers" });
  };

  useEffect(() => {
    getVehicleTypes();
  }, []);

  useEffect(() => {
    const geocodeAddress = async (address: string) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${taxidoSettingData?.taxido_values?.location?.google_map_api_key}`
        );
        const dataMap = await response.json();
        if (dataMap.results.length > 0) {
          const location = dataMap.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng,
          };
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
      return null;
    };

    const fetchCoordinates = async () => {
      try {
        const pickup = await geocodeAddress(pickupLocation);
        setPickupCoords(pickup);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [pickupLocation]);

  const driverLocations = driverData?.data
    ?.map((driver) => {
      const driverLocation = driver.location?.[0];
      if (driverLocation) {
        return {
          lat: parseFloat(driverLocation.lat),
          lng: parseFloat(driverLocation.lng),
          id: driver.id,
          name: driver.name,
          vehicleId: driver?.vehicle_info?.vehicle_type_id,
        };
      }
      return null;
    })
    ?.filter((driver) => driver !== null);

  const filteredDrivers = selectedVehicleData
    ? driverLocations?.filter(
      (driver) => driver?.vehicleId === selectedVehicleData?.id
    )
    : [];

  const getVehicleTypes = (lat: number, lng: number) => {
    const payload = {
      locations: [
        {
          lat: 21.203667,
          lng: 72.795024,
        },
      ],
      service_id: service_ID,
      service_category_id: service_category_ID,
    };

    dispatch(vehicleTypeDataGet(payload)).then((res: any) => { });
  };

  const handlePress = () => { };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNavigate = () => {
    navigate("ChooseRider");
  };

  const radioPress = () => {
    setIsChecked(!isChecked);
  };

  const chooseRider = () => {
    setSelected(false);
    navigate("ChooseRider");
  };

  const handleSkip = () => {
    setSelected(false);
  };

  const [selectedItem1, setSelectedItem1] = useState<number | null>(null);

  const paymentData = (index: number) => {
    setSelectedItem1(index === selectedItem1 ? null : index);
  };

  useEffect(() => {
    const backAction = () => {
      if (selectedOption !== null) {
        setSelectedOption(null);
        return true;
      } else {
        goBack();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [selectedOption]);

  const mapCustomStyle = isDark ? darkMapStyle : "";

  const handleBookRide = () => {
    if (fareValue < Math.round(minPackageCharge * zoneValue?.exchange_rate)) {
      setWarning(true);
      setWarningMessage(
        `Minimum fare should be ${Math.round(minPackageCharge * zoneValue?.exchange_rate)}`
      );
    } else if (fareValue > Math.round(maxPackageCharge * zoneValue?.exchange_rate)) {
      setWarning(true);
      setWarningMessage(
        `Maximum fare should be ${Math.round(maxPackageCharge * zoneValue?.exchange_rate)}`
      );
    } else {
      setWarning(false);
      setIsExpanding(!isExpanding);
      if (!isExpanding) {
        BookRideRequest(forms);
      }
    }
  };

  const handleCancelRide = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (ZoneArea && ZoneArea?.length > 1) {
      setRadiusPerVertex(new Array(ZoneArea?.length - 1).fill(0.5));
    }
  }, [ZoneArea]);

  useEffect(() => {
    if (isExpanding) {
      intervalRef.current = setInterval(() => {
        setRadiusPerVertex((prevRadii) =>
          prevRadii?.map((radius, index) => {
            const currentSubZoneVertex = subZone[index] || pickupCoords;
            const distanceToMainZone = turf.distance(
              turf.point([
                currentSubZoneVertex?.lng,
                currentSubZoneVertex?.lat,
              ]),
              turf.point([ZoneArea[index]?.lng, ZoneArea[index]?.lat]),
              { units: "kilometers" }
            );
            return distanceToMainZone <= incrementDistance
              ? radius
              : radius + incrementDistance;
          })
        );
        expandSubZone();
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isExpanding, subZone, incrementDistance, pickupCoords]);

  const expandSubZone = () => {
    if (!Array.isArray(ZoneArea) || !pickupCoords?.lat || !pickupCoords?.lng) return;

    const expandedPoints = [];
    const newRadiusPerVertex = [];

    for (let i = 0; i < ZoneArea.length - 1; i++) {
      const mainZonePoint = ZoneArea[i];
      if (!mainZonePoint?.lat || !mainZonePoint?.lng) continue;

      const angle = turf.bearing(
        turf.point([pickupCoords.lng, pickupCoords.lat]),
        turf.point([mainZonePoint.lng, mainZonePoint.lat])
      );

      const currentSubZoneVertex = subZone[i] || {
        lat: pickupCoords.lat,
        lng: pickupCoords.lng,
      };

      const distanceToMainZone = turf.distance(
        turf.point([currentSubZoneVertex.lng, currentSubZoneVertex.lat]),
        turf.point([mainZonePoint.lng, mainZonePoint.lat]),
        { units: "kilometers" }
      );

      const newRadius = radiusPerVertex[i] ?? 0;

      if (distanceToMainZone <= incrementDistance) {
        expandedPoints.push({
          lat: mainZonePoint.lat,
          lng: mainZonePoint.lng,
        });
        newRadiusPerVertex.push(distanceToMainZone);
      } else {
        const expandedPoint = turf.destination(
          turf.point([pickupCoords.lng, pickupCoords.lat]),
          newRadius + incrementDistance,
          angle,
          { units: "kilometers" }
        );

        const [lng, lat] = expandedPoint.geometry.coordinates;

        if (!isNaN(lat) && !isNaN(lng)) {
          expandedPoints.push({ lat, lng });
          newRadiusPerVertex.push(newRadius + incrementDistance);
        }
      }
    }

    if (expandedPoints.length === 0) return;

    expandedPoints.push(expandedPoints[0]);
    setSubZone(expandedPoints);

    const perimeterLength = calculatePerimeter(expandedPoints);
    setPerimeter(perimeterLength);

    const validPoints = expandedPoints.filter(
      (point) => typeof point?.lat === 'number' && typeof point?.lng === 'number'
    );

    if (validPoints.length < 3) return;

    const polygon = turf.polygon([validPoints.map(({ lng, lat }) => [lng, lat])]);

    const messages = filteredDrivers
      ?.map((driver) => {
        if (!driver?.lat || !driver?.lng) return null;
        const point = turf.point([driver.lng, driver.lat]);
        return turf.booleanPointInPolygon(point, polygon) ? driver.id : null;
      })
      .filter(Boolean);

    setDriverMessages(messages);
  };

  useEffect(() => {
    dispatch(
      allDriver({
        zones: zoneValue?.data?.[0]?.id,
        is_online: 1,
        is_on_ride: 0,
      })
    );
  }, []);

  const formattedData =
    allLocationCoords && allLocationCoords.length > 0
      ? `[${allLocationCoords
        ?.map((coord) =>
          coord?.lat !== undefined && coord?.lng !== undefined
            ? `{"lat": ${coord.lat}, "lng": ${coord.lng}}`
            : null
        )
        .filter(Boolean)
        .join(", ")}]`
      : "[]";

  if (formattedData !== "[]") {
    try {
      const parsedData = JSON.parse(formattedData);
    } catch (error) {
      console.error("Failed to parse formattedData:", error);
    }
  } else {
  }

  const forms = {
    location_coordinates: JSON.parse(formattedData),
    locations: allLocations,
    ride_fare: fareValue,
    service_id: service_ID,
    service_category_id: service_category_ID,
    vehicle_type_id: filteredVehicle?.id,
    distance: selectedPackageDetails?.distance,
    distance_unit: "km",
    payment_method: "cash",
    currency_code: zoneValue?.currency_code,
    wallet_balance: null,
    coupon: null,
    description: null,
    selectedImage: {
      uri: null,
      type: null,
      fileName: null,
    },
    hourly_package_id: selectedPackageDetails?.id,
  };

  const BookRideRequest = async (forme) => {
    const token = await getValue("token");
    try {
      const formData = new FormData();
      forme.location_coordinates.forEach((coord, index) => {
        formData.append(`location_coordinates[${index}][lat]`, coord.lat);
        formData.append(`location_coordinates[${index}][lng]`, coord.lng);
      });
      forme.locations.forEach((loc, index) => {
        formData.append(`locations[${index}]`, loc);
      });
      formData.append("ride_fare", forme.ride_fare);
      formData.append("service_id", forme.service_id);
      formData.append("service_category_id", forme.service_category_id);
      formData.append("vehicle_type_id", forme.vehicle_type_id);
      formData.append("distance", forme.distance);
      formData.append("distance_unit", forme.distance_unit);
      formData.append("payment_method", forme.payment_method);
      formData.append("wallet_balance", forme.wallet_balance || "");
      formData.append("currency_code", forme.currency_code || "");
      formData.append("coupon", forme.coupon || "");
      formData.append("description", forme.description);
      formData.append("hourly_package_id", forme.hourly_package_id);

      const response = await fetch(`${URL}/api/rideRequest`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setStartDriverRequest(true);
        setRideId(responseData.id);
      } else {
        notificationHelper('Error', responseData.message, 'error');
      }
    } catch (error) {
      console.error("Error in BookRideRequest:", error);
    }
  };

  useEffect(() => {
    if (startDriverRequest && rideID && isExpanding) {
      const ride_request_id = rideID;

      const fetchBidData = async () => {
        await dispatch(bidDataGet({ ride_request_id }));
        setActivateRideRequest(true);
      };

      fetchBidData();
      const intervalId = setInterval(fetchBidData, 5000);

      return () => clearInterval(intervalId);
    }
  }, [startDriverRequest, rideID, isExpanding, dispatch]);

  useEffect(() => {
    const showRequest = () => {
      if (
        Array.isArray(bidValue?.data) &&
        bidValue.data.length > 0 &&
        activeRideRequest
      ) {
        setRideBooked(true);
      }
    };
    showRequest();
  }, [bidValue]);

  const renderItem = ({ item }) => (
    <BookRideItem
      item={item}
      onPress={() => setSelectedItem(item.id)}
      isSelected={selectedItem === item.id}
      onPressAlternate={() => setModelVisible(true)}
    />
  );
  const activePaymentMethods = zoneValue?.payment_method

  const renderItem1 = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => paymentData(index)} activeOpacity={0.7}
      >
        <View
          style={[
            styles.modalPaymentView,
            { backgroundColor: bgContainer, flexDirection: viewRTLStyle },
          ]}
        >
          <View style={{ flexDirection: viewRTLStyle, flex: 1 }}>
            <View style={styles.imageBg}>
              <Image source={item.image} style={styles.paymentImage} />
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
              checked={index === selectedItem1}
              color={appColors.primary}
            />
          </TouchableOpacity>
        </View>
        {index !== 3 ? <View style={styles.borderPayment} /> : null}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[external.fx_1, { backgroundColor: bgContainer }]}>
      <>
        <View style={[commonStyles.flexContainer, { flex: 0.8 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: bgContainer }]}
            onPress={goBack}
            activeOpacity={0.7}

          >
            <Back />
          </TouchableOpacity>
          {mapType === "googleMap" ? (
            <MapView
              style={[commonStyles.flexContainer]}
              region={{
                latitude: pickupCoords?.lat || 37.78825,
                longitude: pickupCoords?.lng || -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
              customMapStyle={mapCustomStyle}
            >
              <Polygon
                coordinates={ZoneArea?.filter(item => item?.lat && item?.lng).map(({ lng, lat }) => ({
                  latitude: lat,
                  longitude: lng,
                }))}
                strokeColor="rgba(0,0,0,0)"
                fillColor="rgba(0,0,0,0)"
                strokeWidth={2}
              />

              {subZone.length > 0 && (
                <Polygon
                  coordinates={subZone.map(({ lat, lng }) => ({
                    latitude: lat,
                    longitude: lng,
                  }))}
                  strokeColor="rgba(0, 0, 0, 0)"
                  fillColor="rgba(0, 0, 0, 0)"
                  strokeWidth={2}
                />
              )}

              {filteredDrivers?.map((driver, index) => (
                <Marker
                  key={index}
                  coordinate={{ latitude: driver.lat, longitude: driver.lng }}
                  title={`${translateData.driver} ${index + 1}`}
                >
                  <CustomMarker
                    imageUrl={selectedVehicleData.vehicle_map_icon.original_url}
                  />
                </Marker>
              ))}

              {pickupCoords && (
                <Marker
                  coordinate={{
                    latitude: pickupCoords.lat,
                    longitude: pickupCoords.lng,
                  }}
                  title={translateData.pickupLocation}
                  pinColor={appColors.primary}
                />
              )}
            </MapView>
          ) : (
            <WebView
              originWhitelist={["*"]}
              source={{ html: mapHtml }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>
        {RideBooked ? (
          <View style={[external.mt_10, external.mh_15, styles.listView]}>
            <FlatList
              renderItem={renderItemRequest}
              data={bidValue?.data?.length > 0 ? [bidValue?.data[0]] : []}
            />
          </View>
        ) : null}
        <View style={styles.linearGradientView}>
          <View>
            <LinearGradient
              style={[
                styles.mainContainer,
                height ? { height: windowHeight(330) } : null,
              ]}
              start={{ x: 0.0, y: 1.0 }}
              end={{ x: 0.0, y: 1.0 }}
              colors={["rgba(52, 52, 52, 0.8)", appColors.lightGray]}
            ></LinearGradient>
            <View style={[external.fx_1, external.js_end, external.mh_20]}>
              <LocationTime pickupLocation={pickupLocation} />
              <LineContainer />
              <View
                activeOpacity={0.7}
                style={[
                  styles.popupContainer,
                  {
                    backgroundColor: bgContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.choosePackage,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.chooseaPackage}
                </Text>
                <KmDetails
                  onPress={handlePress}
                  onPackageSelect={handlePackageSelection}
                  onpackageVehicle={handlepackagevehicle}
                />
                <View>
                  {selectedOption === null ? (
                    <>
                      <Text
                        style={[
                          styles.carType,
                          { color: textColorStyle, textAlign: textRTLStyle },
                        ]}
                      >
                        {translateData.vehicletype}
                      </Text>
                      <FlatList
                        horizontal
                        data={packageVehicle}
                        renderItem={renderItem}
                        contentContainerStyle={{ backgroundColor: bgContainer }}
                      />
                      <View style={[external.mh_10, external.mb_15]}>
                        <Text
                          style={[
                            styles.title,
                            {
                              color: isDark
                                ? appColors.whiteColor
                                : appColors.primaryText,
                            },
                            { textAlign: textRTLStyle },
                          ]}
                        >
                          {translateData.offerYourFare}
                        </Text>
                        <View
                          style={[
                            styles.inputcontainer,
                            { flexDirection: viewRTLStyle },
                          ]}
                        >
                          <View style={styles.coin}>
                            <Text>{zoneValue?.currency_symbol}</Text>
                          </View>
                          <TextInput
                            style={[
                              styles.textInput,
                              { color: textColorStyle },
                            ]}
                            placeholder={translateData.enterFareAmount}
                            backgroundColor={bgContainer}
                            value={fareValue}
                            keyboardType="number-pad"
                            placeholderTextColor={appColors.regularText}
                            onChangeText={(text) => {
                              if (!selectedVehicleData) {
                                setVehicleSelectModal(true);
                              }
                              setFareValue(text);
                            }}
                          />
                        </View>
                        {Warning ? (
                          <Text style={styles.warningText}>
                            {warningMessage}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={[
                          styles.recommended,
                          {
                            backgroundColor: isDark
                              ? bgFullLayout
                              : appColors.lightGray,
                          },
                          {
                            borderColor: isDark
                              ? bgFullLayout
                              : appColors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.RideRecommendPrice,
                            {
                              color: isDark
                                ? textColorStyle
                                : appColors.primaryText,
                            },
                          ]}
                        >
                          {zoneValue.currency_symbol} {Math.round(recommendedPackageCharge) * zoneValue.exchange_rate}
                          <Text
                            style={[
                              styles.priceTitle,
                              {
                                color: isDark
                                  ? textColorStyle
                                  : appColors.primaryText,
                              },
                            ]}
                          >
                            {" "}
                            - {translateData.recommendedPrice}
                          </Text>
                        </Text>
                      </View>
                    </>
                  ) : null}

                  {selectedOption === "selectPayment" ? (
                    <>
                      <Text
                        style={[
                          styles.payment,
                          { color: textColorStyle, textAlign: textRTLStyle },
                        ]}
                      >
                        {translateData.paymentMethodSelect}
                      </Text>
                      <View style={styles.paymentContainer}>
                        <ScrollView>
                          <FlatList
                            data={activePaymentMethods}
                            renderItem={renderItem1}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                          />
                        </ScrollView>
                      </View>
                    </>
                  ) : null}

                  {selectedOption === "switchRider" ? (
                    <>
                      <View style={styles.switchRiderView}>
                        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              commonStyles.mediumText23,
                              {
                                color: textColorStyle,
                                textAlign: textRTLStyle,
                              },
                            ]}
                          >
                            {translateData.talkingRide}
                          </Text>
                          <Text
                            style={[
                              commonStyles.regularText,
                              external.mt_3,
                              {
                                fontSize: fontSizes.FONT16,
                                lineHeight: windowHeight(14),
                                textAlign: textRTLStyle,
                              },
                            ]}
                          >
                            {translateData.notice}
                          </Text>
                        </TouchableOpacity>
                        <View style={[external.mt_20]}>
                          <View
                            style={[
                              external.fd_row,
                              external.ai_center,
                              external.js_space,
                              { flexDirection: viewRTLStyle },
                            ]}
                          >
                            <View
                              style={[
                                external.fd_row,
                                { flexDirection: viewRTLStyle },
                              ]}
                            >
                              <UserFill />
                              <Text
                                style={[
                                  commonStyles.mediumTextBlack12,
                                  external.mh_2,
                                  { fontSize: fontSizes.FONT19 },
                                  { color: textColorStyle },
                                ]}
                              >
                                {translateData.myself}
                              </Text>
                            </View>
                            <Pressable
                              style={{
                                backgroundColor: appColors.selectPrimary,
                                borderRadius: windowHeight(48),
                              }}
                            >
                              <RadioButton
                                onPress={radioPress}
                                checked={isChecked}
                                color={appColors.primary}
                              />
                            </Pressable>
                          </View>
                          <SolidLine marginVertical={14} />
                          <View
                            style={[
                              external.fd_row,
                              external.js_space,
                              { flexDirection: viewRTLStyle },
                            ]}
                          >
                            <TouchableOpacity
                              activeOpacity={0.7}

                              style={[
                                external.fd_row,
                                external.ai_center,
                                { flexDirection: viewRTLStyle },
                              ]}
                              onPress={chooseRider}
                            >
                              <NewContact />
                              <Text style={[styles.chooseAnotherAccount]}>
                                {translateData.contact}
                              </Text>
                            </TouchableOpacity>
                            <Forword />
                          </View>
                        </View>
                        <View
                          style={[
                            external.js_space,
                            external.mt_25,
                            { flexDirection: viewRTLStyle },
                          ]}
                        >
                          <Button
                            width={"47%"}
                            backgroundColor={appColors.lightGray}
                            title={translateData.cancel}
                            textColor={appColors.primaryText}
                            onPress={handleSkip}
                          />
                          <Button
                            width={"47%"}
                            title={translateData.continue}
                            onPress={chooseRider}
                          />
                        </View>
                      </View>
                    </>
                  ) : null}

                  <View
                    style={[
                      styles.cardMainView,
                      {
                        backgroundColor: isDark
                          ? bgFullLayout
                          : appColors.lightGray,
                        flexDirection: viewRTLStyle,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOptionSelect("selectPayment")}
                      style={[
                        styles.userView,
                        {
                          flexDirection: viewRTLStyle,
                          backgroundColor: isDark
                            ? bgContainer
                            : appColors.lightGray,
                        },
                      ]}
                    >
                      <View style={styles.cardView}>
                        <Card />
                      </View>
                      <Text
                        style={[
                          styles.selectText,
                          { color: textColorStyle },
                          selectedOption === "selectPayment" &&
                          styles.selectedText,
                        ]}
                      >
                        {translateData.selectPayment}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOptionSelect("switchRider")}
                      style={[
                        styles.userView,
                        {
                          flexDirection: viewRTLStyle,
                          backgroundColor: isDark
                            ? bgContainer
                            : appColors.lightGray,
                        },
                      ]}
                    >
                      <User />
                      <Text
                        style={[
                          styles.selectText,
                          { color: textColorStyle },
                          selectedOption === "switchRider" &&
                          styles.selectedText,
                        ]}
                      >
                        {translateData.switchRider}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <CommonModal
                    isVisible={visible}
                    value={
                      <ModalContainers onPress={() => setModelVisible(false)} />
                    }
                    onPress={() => setModelVisible(false)}
                  />
                </View>
              </View>
              {!RideBooked ? (
                <View style={[external.mv_13]}>
                  <Button
                    title={
                      isExpanding
                        ? translateData.cancelRide
                        : translateData.bookRide
                    }
                    onPress={handleBookRide}
                  />
                </View>
              ) : (
                <View style={[external.mh_10]}>
                  <View style={[external.mv_13]}>
                    <Button
                      title={translateData.cancelRide}
                      backgroundColor={appColors.textRed}
                      onPress={handleCancelRide}
                    />
                  </View>
                </View>
              )}
              <CommonModal
                isVisible={visible}
                value={
                  <ModalContainers
                    selectedItemData={selectedItemData}
                    onPress={() => setModelVisible(false)}
                  />
                }
                onPress={() => setModelVisible(false)}
              />
            </View>
            <View style={styles.modalContain}>
              <CommonModal
                isVisible={visible}
                onPress={() => setModelVisible(false)}
                value={
                  <View
                    opacity={1}
                    style={{
                      backgroundColor: isDark
                        ? appColors.darkPrimary
                        : appColors.whiteColor,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.close}
                      onPress={() => setModelVisible(false)}
                    >
                      <Close />
                    </TouchableOpacity>
                    <Text
                      style={[
                        commonStyles.extraBold,
                        external.ti_center,
                        {
                          color: isDark
                            ? appColors.whiteColor
                            : appColors.primaryText,
                          marginTop: windowHeight(10),
                        },
                      ]}
                    >
                      {translateData.rentalRide}
                    </Text>
                    <Image style={styles.carTwo} source={Images.carTwo} />
                    <View>
                      <View
                        style={{
                          flexDirection: viewRTLStyle,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            commonStyles.extraBold,
                            external.pv_10,
                            {
                              color: isDark
                                ? appColors.whiteColor
                                : appColors.primaryText,
                            },
                          ]}
                        >
                          {translateData.incorporated}
                        </Text>
                        <View
                          style={{
                            flexDirection: viewRTLStyle,
                            marginVertical: windowHeight(4.8),
                          }}
                        >
                          <UserFill />
                          <Text style={styles.total}>5</Text>
                        </View>
                      </View>
                      <SolidLine />
                      <View style={[external.mt_5]}>
                        <ModalContainer data={modelData} />
                      </View>
                      <SolidLine />
                      <Text
                        style={[
                          commonStyles.extraBold,
                          external.mt_10,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}
                      >
                        {translateData.policiesFees}
                      </Text>
                      <View style={[external.mt_5]}>
                        <ModalContainer data={feesPolicies} />
                      </View>
                    </View>
                  </View>
                }
              />
            </View>
          </View>
        </View>
      </>
    </View >
  );
}