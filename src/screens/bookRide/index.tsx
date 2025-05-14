import { Text, View, FlatList, TouchableOpacity, TextInput, Image, Pressable, BackHandler, Modal, ActivityIndicator, PermissionsAndroid, ScrollView, } from "react-native";
import React, { useState, useEffect, useRef, useContext, useCallback, } from "react";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import MapView, { Marker, Polygon } from "react-native-maps";
import { Button, CommonModal, notificationHelper, RadioButton, SolidLine, } from "@src/commonComponent";
import { styles } from "./styles";
import { BookRideItem } from "./bookRideItem/index";
import { ModalContainers } from "./modalContainer/index";
import { useValues } from "../../../App";
import darkMapStyle from "../darkMapStyle";
import { appColors, windowWidth } from "@src/themes";
import { fontSizes, windowHeight } from "@src/themes";
import { Back, NewContact, UserFill, Forword, Card, User, Close, CloseCircle, } from "@utils/icons";
import { useFocusEffect, useRoute, useTheme, } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import { CancelRender } from "../cancelFare/cancelRenderItem/index";
import { useDispatch, useSelector } from "react-redux";
import { allDriver } from "../../api/store/actions/index";
import { WebView } from "react-native-webview";
import { AppDispatch } from "../../api/store/index";
import * as turf from "@turf/turf";
import { updateRideRequest } from "../../api/store/actions/index";
import { bidDataGet } from "../../api/store/actions/bidAction";
import { paymentsData } from "../../api/store/actions/paymentAction";
import { CustomMarker } from "@src/components";
import { getValue } from "@src/utils/localstorage";
import { appFonts } from "@src/themes";
import Images from "@src/utils/images";
import { LocationContext } from "@src/utils/locationContext";
import { useAppNavigation } from "@src/utils/navigation";
import { URL } from "@src/api/config";
import FastImage from "react-native-fast-image";

export function BookRide() {
  const { colors } = useTheme()
  const route = useRoute();
  const { pickupLocation, stops, destination, service_ID, zoneValue, service_name, service_category_ID, receiverName, countryCode, phoneNumber, scheduleDate, } = route.params;
  const { textColorStyle, bgContainer, textRTLStyle, isDark, viewRTLStyle } = useValues();
  const { descriptionText, selectedImage, parcelWeight } = route.params;
  const [mapType, setMapType] = useState("googleMap");
  const { translateData, taxidoSettingData } = useSelector((state) => state.setting);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate, goBack } = useAppNavigation();
  const [seletedPayment, setSeletedPayment] = useState(null);
  const [visible, setModelVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [selected, setSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [stopsCoords, setStopsCoords] = useState<
    Array<{ lat: number; lng: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  const [RideBooked, setRideBooked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [vehicleSelectModal, setVehicleSelectModal] = useState(false);
  const ZoneArea = zoneValue?.locations || null;
  const { driverData } = useSelector((state) => state.allDriver);
  const { vehicleTypedata } = useSelector((state) => state?.vehicleType || {});
  const [startDriverRequest, setStartDriverRequest] = useState(false);
  const { bidValue } = useSelector((state) => state.bid);
  const [activeRideRequest, setActivateRideRequest] = useState(false);
  const { paymentMethodData } = useSelector((state) => state.payment);
  const activePaymentMethods = zoneValue?.payment_method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [fareValue, setFareValue] = useState(0);
  const [Warning, setWarning] = useState(false);
  const [distance, setDistance] = useState(false);
  const [duration, setDuration] = useState(false);
  const [subZone, setSubZone] = useState([]);
  const [driverMessages, setDriverMessages] = useState([]);
  const [incrementDistance, setIncrementDistance] = useState(0.5);
  const [perimeter, setPerimeter] = useState(0);
  const intervalRef = useRef(null);
  const [radiusPerVertex, setRadiusPerVertex] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [rideID, setRideId] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);


  const renderItemRequest = ({ item }) => (
    <CancelRender item={item} pickupLocation={pickupLocation} />
  );

  const formatScheduleDate = ({ DateValue, TimeValue }) => {
    if (!DateValue || !TimeValue) return "";
    const [day, month, year] = DateValue.split(" ");
    const monthMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    const monthIndex = monthMap[month];
    if (!monthIndex) {
      return translateData.bookRideInvalidDate;
    }

    const timeParts = TimeValue.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/);
    if (!timeParts) {
      return translateData.bookRideInvalidTime;
    }

    let [_, hours, minutes, period] = timeParts;
    hours =
      period === "PM" && hours !== "12"
        ? +hours + 12
        : hours === "12" && period === "AM"
          ? "00"
          : hours;
    const formattedDate = `${year}-${String(monthIndex).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")} ${String(hours).padStart(
      2,
      "0"
    )}:${minutes}`;
    return formattedDate;
  };

  const scheduleDates = {
    DateValue: scheduleDate?.DateValue,
    TimeValue: scheduleDate?.TimeValue,
  };

  useEffect(() => {
    dispatch(paymentsData());
  }, []);

  useEffect(() => {
    if (vehicleTypedata?.length > 0) {
      setSelectedItem(vehicleTypedata[0].id);
    }
  }, [vehicleTypedata]);

  useFocusEffect(
    useCallback(() => {
      setSelectedPaymentMethod(null);
    }, [])
  );

  const allLocations = [pickupLocation, ...stops, destination];
  const allLocationCoords = [pickupCoords, ...stopsCoords, destinationCoords];
  const selectedVehicleData = Array.isArray(vehicleTypedata)
    ? vehicleTypedata.find((item) => item?.id === selectedItem)
    : null;
  const minimumCharge = selectedVehicleData?.min_per_unit_charge || null;
  const maximumCharge = selectedVehicleData?.max_per_unit_charge || null;
  const minChargeRide = minimumCharge * distance;
  const maxChargeRide = maximumCharge * distance;
  const minWeightCharge = selectedVehicleData?.min_per_weight_charge * distance || null;
  const maxWeightCharge = selectedVehicleData?.max_per_weight_charge * distance || null;
  const ParcelMinCharge = Number((minChargeRide + minWeightCharge).toFixed(2));
  const ParcelMaxCharge = Number((maxChargeRide + maxWeightCharge).toFixed(2));
  const ParcelRecommendCharge = ((parseFloat(ParcelMinCharge) + parseFloat(ParcelMaxCharge)) / 2).toFixed(2);
  const context = useContext(LocationContext);



  useEffect(() => {
    updateZone();
  }, [ZoneArea]);

  const updateZone = () => {
    if (ZoneArea && ZoneArea?.length > 1) {
      setRadiusPerVertex(new Array(ZoneArea?.length - 1).fill(0.5));
    } else {
      setServiceVisible(true);
    }
  };

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

  const calculatePerimeter = (points) => {
    if (points.length < 2) return 0;
    const line = turf.lineString(points.map((p) => [p.lng, p.lat]));
    return turf.length(line, { units: "kilometers" });
  };

  const expandSubZone = () => {
    const expandedPoints = [];
    const newRadiusPerVertex = [];

    for (let i = 0; i < ZoneArea?.length - 1; i++) {
      const mainZonePoint = ZoneArea[i];
      const angle = turf.bearing(
        turf.point([pickupCoords?.lng, pickupCoords?.lat]),
        turf.point([mainZonePoint?.lng, mainZonePoint?.lat])
      );

      const currentSubZoneVertex = subZone[i] || {
        lat: pickupCoords?.lat,
        lng: pickupCoords?.lng,
      };
      const distanceToMainZone = turf.distance(
        turf.point([currentSubZoneVertex?.lng, currentSubZoneVertex?.lat]),
        turf.point([mainZonePoint?.lng, mainZonePoint?.lat]),
        { units: "kilometers" }
      );

      let newRadius = radiusPerVertex[i];

      if (distanceToMainZone <= incrementDistance) {
        expandedPoints.push({
          lat: mainZonePoint?.lat,
          lng: mainZonePoint?.lng,
        });
        newRadiusPerVertex.push(distanceToMainZone);
      } else {
        const expandedPoint = turf.destination(
          turf.point([pickupCoords?.lng, pickupCoords?.lat]),
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

    expandedPoints.push(expandedPoints[0]);
    setSubZone(expandedPoints);

    const perimeterLength = calculatePerimeter(expandedPoints);
    setPerimeter(perimeterLength);

    const polygon = turf.polygon([
      expandedPoints.map(({ lng, lat }) => [lng, lat]),
    ]);

    const messages = (filteredDrivers ?? [])
      .map((driver) => {
        const point = turf.point([driver?.lng, driver?.lat]);
        if (turf?.booleanPointInPolygon(point, polygon)) {
          return driver.id;
        }
        return null;
      })
      .filter((message) => message !== null);
    setDriverMessages(messages);
  };

  useEffect(() => {
    if (isExpanding) {
      intervalRef.current = setInterval(() => {
        setRadiusPerVertex((prevRadii) =>
          prevRadii.map((radius, index) => {
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
        handleUpdateRide();
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isExpanding, subZone, incrementDistance, pickupCoords]);

  useEffect(() => {
    dispatch(
      allDriver({
        zones: zoneValue?.data?.[0]?.id,
        is_online: 1,
        is_on_ride: 0,
      })
    );
  }, []);

  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>OpenStreetMap with Routing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; }
      #map { width: 100vw; height: 100vh; }
    </style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        var map = L.map('map').setView([${pickupCoords?.lat}, ${pickupCoords?.lng}], 13);
        
        L.tileLayer('http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
        
        var startPoint = [${pickupCoords?.lat}, ${pickupCoords?.lng}];
        var stopPoints = [
          [${stopsCoords[0]?.lat}, ${stopsCoords[0]?.lng}],
          [${stopsCoords[1]?.lat}, ${stopsCoords[1]?.lng}], 
          [${stopsCoords[2]?.lat}, ${stopsCoords[2]?.lng}], 
        ]; 
        var endPoint = [${destinationCoords?.lat}, ${destinationCoords?.lng}];
        
        L.marker(startPoint, { draggable: false }).addTo(map).bindPopup('Start Point');
        L.marker(endPoint, { draggable: false }).addTo(map).bindPopup('End Point');
        
        stopPoints.forEach(function(point, index) {
          if (point[0] && point[1]) {
            L.marker(point, { draggable: false }).addTo(map).bindPopup('Stop Point ' + (index + 1));
          }
        });
        
        var waypoints = [L.latLng(startPoint)];
        stopPoints.forEach(function(point) {
          if (point[0] && point[1]) {
            waypoints.push(L.latLng(point));
          }
        });
        waypoints.push(L.latLng(endPoint));
        
        L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: true,
          createMarker: function() { return null; }
        }).addTo(map);

        map.fitBounds([startPoint, ...stopPoints.filter(p => p[0] && p[1]), endPoint]);
      });
    </script>
  </body>
</html>
`;

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );

      if (granted) {
        setHasPermission(true);
        navigate("ChooseRiderScreen", {
          destination,
          stops,
          pickupLocation,
          service_ID,
          zoneValue,
          scheduleDate,
          service_category_ID,
        });
      } else {
        const permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contacts Permission",
            message: "This app needs access to your contacts to display them.",
            buttonPositive: "OK",
          }
        );

        if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          navigate("ChooseRiderScreen");
        } else {
          setHasPermission(false);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

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
        const destinationLoc = await geocodeAddress(destination);
        const stopsCoordsPromises = stops.map(geocodeAddress);
        const stopsResults = await Promise.all(stopsCoordsPromises);
        setPickupCoords(pickup);
        setDestinationCoords(destinationLoc);
        setStopsCoords(
          stopsResults.filter((coords) => coords !== null) as Array<{
            lat: number;
            lng: number;
          }>
        );
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [pickupLocation, stops, destination]);

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

  const handleOptionSelect = (option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };

  const radioPress = () => {
    setIsChecked(!isChecked);
  };

  const handleNavigate = () => {
    navigate("ChooseRider");
  };

  const chooseRider = () => {
    requestContactsPermission();
    setSelected(false);
  };

  const handleSkip = () => {
    setSelected(false);
  };

  const renderItem = ({ item }) => (
    <BookRideItem
      item={item}
      isDisabled={isExpanding}
      onPress={() => {
        if (!isExpanding) {
          setSelectedItem(item.id);
        }
      }}
      isSelected={selectedItem === item.id}
      onPressAlternate={() => {
        if (!isExpanding) {
          setSelectedItemData(item);
          setModelVisible(true);
        }
      }}
    />
  );

  const mapCustomStyle = isDark ? darkMapStyle : "";
  const [selectedItem1, setSelectedItem1] = useState<number | null>(null);

  const paymentData = (index) => {
    setSelectedOption(null)
    setSelectedItem1(index);
    setSeletedPayment(activePaymentMethods[index].name)
  };

  const formattedData =
    allLocationCoords && allLocationCoords.length > 0
      ? `[${allLocationCoords
        .map((coord) =>
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
    vehicle_type_id: selectedVehicleData?.id,
    distance: distance,
    distance_unit: "km",
    payment_method: "cash",
    wallet_balance: null,
    coupon: null,
    description: descriptionText,
    weight: parcelWeight,
    name: receiverName,
    currency_code: zoneValue?.currency_code,
    country_code: countryCode,
    phone: phoneNumber,
    schedule_time: formatScheduleDate(scheduleDates),
    ...(selectedImage &&
      selectedImage[0] && {
      selectedImage: {
        uri: selectedImage[0]?.uri || null,
        type: selectedImage[0]?.type || null,
        fileName: selectedImage[0]?.fileName || null,
      },
    }),
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
      formData.append("coupon", forme.coupon || "");
      formData.append("description", forme.description);
      formData.append("weight", forme.weight || "");
      formData.append("parcel_receiver[name]", forme.name || "");
      formData.append("parcel_receiver[phone]", forme.phone || "");
      formData.append("parcel_receiver[country_code]", forme.country_code || "");
      formData.append("currency_code", forme.currency_code || "");
      formData.append("schedule_time", forme.schedule_time || "");
      if (forme.selectedImage) {
        formData.append("cargo_image", {
          uri: forme.selectedImage.uri || {},
          type: forme.selectedImage.type || {},
          name: forme.selectedImage.fileName || {},
        });
      }

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
      } else if (responseData) {
        notificationHelper('Error', responseData.message, 'error');
      }
    } catch (error) {
      notificationHelper('Error', error, 'error');
    }
  };

  const handleUpdateRide = () => {
    const ride_id = rideID;
    let payload = {
      drivers: driverMessages,
    };

    dispatch(updateRideRequest({ payload, ride_id }))
      .unwrap()
      .then((res: any) => { })
      .catch((error: any) => {
        console.error("Bid update error:", error);
      });
  };

  const handleBookRide = () => {
    if (taxidoSettingData?.taxido_values?.activation?.bidding == 1) {
      if (service_name === "parcel") {
        if (fareValue < ParcelMinCharge * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(
            `Minimum fare should be ${Number(ParcelMinCharge * zoneValue?.exchange_rate).toFixed(2)}`
          );
        } else if (fareValue > ParcelMaxCharge * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(
            `Maximum fare should be ${Number(ParcelMaxCharge * zoneValue?.exchange_rate).toFixed(2)}`
          );
        } else {
          setWarning(false);
          setIsExpanding(!isExpanding);
          if (!isExpanding) {
            BookRideRequest(forms);
          }
        }
      } else if (service_name === "freight") {
        if (fareValue < minChargeRide * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(`Minimum fare should be ${minChargeRide.toFixed(2) * zoneValue?.exchange_rate}`);
        } else if (fareValue > maxChargeRide * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(`Maximum fare should be ${maxChargeRide.toFixed(2) * zoneValue?.exchange_rate}`);
        } else {
          setWarning(false);
          setIsExpanding(!isExpanding);
          if (!isExpanding) {
            BookRideRequest(forms);
          }
        }
      } else {
        if (fareValue < minChargeRide * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(`Minimum fare should be ${minChargeRide.toFixed(2) * zoneValue?.exchange_rate}`);
        } else if (fareValue > maxChargeRide * zoneValue?.exchange_rate) {
          setWarning(true);
          setWarningMessage(`Maximum fare should be ${maxChargeRide.toFixed(2) * zoneValue?.exchange_rate}`);
        } else {
          setWarning(false);
          setIsExpanding(!isExpanding);
          if (!isExpanding) {
            BookRideRequest(forms);
          }
        }
      }
    } else {
      setWarningMessage('Enter Fare Value');
    }
  };

  const handleCancelRide = () => {
    setModalVisible(true);
  };


  const handleConfirmCancel = () => {
    navigate("MyTabs");
    setModalVisible(false);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
    setVehicleSelectModal(false);
  };


  const handleGoBack = () => {
    goBack();
    setServiceVisible(false);
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

  const closeModal = () => {
    setSelectedOption(null);
  };

  const backScreen = () => {
    goBack();
  };


  const renderItems = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleOptionSelect(item.value)}
      style={[styles.renderItemView, {
        flexDirection: viewRTLStyle,

        backgroundColor:
          selectedOption === item.value
            ? appColors.selectPrimary
            : appColors.lightGray,

      }]}
    >
      <View style={styles.iconView}>{item.icon}</View>
      <Text
        style={[
          styles.selectText,
          { color: textColorStyle },
          selectedOption === item.value && styles.selectedText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );


  const renderItem1 = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => paymentData(index)}
          activeOpacity={0.7}
          style={[
            styles.modalPaymentView,
            { backgroundColor: bgContainer, flexDirection: viewRTLStyle },
          ]}
        >
          <View style={[styles.paymentView, { flexDirection: viewRTLStyle }]}>
            <View style={[styles.imageBg, { borderColor: colors.border }]}>
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
          <View style={styles.payBtn}>
            <RadioButton
              onPress={() => paymentData(index)}
              checked={index === selectedItem1}
              color={appColors.primary}
            />
          </View>
        </TouchableOpacity>
        {index !== activePaymentMethods.length - 1 && (
          <View style={[styles.borderPayment, { borderColor: colors.border }]} />
        )}

      </>
    )
  };

  if (!pickupCoords || !destinationCoords) {
    return null;
  }



  return (
    <View style={[external.fx_1, { backgroundColor: bgContainer }]}>
      <Modal
        transparent={true}
        visible={serviceVisible}
        animationType="slide"
        onRequestClose={handleGoBack}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FastImage
              source={isDark ? Images.noServiceDark : Images.noService}
              style={styles.serviceImg}
            />
            <Text style={[styles.modalText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
              {translateData.noService}
            </Text>
            <Text style={[styles.modalDetail, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
              {translateData.noServiceDes}
            </Text>
            <View
              style={[styles.buttonContainer, { flexDirection: viewRTLStyle }]}
            >
              <Button title={translateData.goBack} onPress={backScreen} />
            </View>
          </View>
        </View>
      </Modal>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.blue} />
        </View>
      ) : (
        <>
          <View style={[commonStyles.flexContainer]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.backBtn,
                { backgroundColor: bgContainer },
                {
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                },
              ]}
              onPress={goBack}
            >
              <Back />
            </TouchableOpacity>
            {mapType === "googleMap" ? (
              <MapView
                style={[commonStyles.flexContainer]}
                region={{
                  latitude:
                    (pickupCoords?.lat + destinationCoords?.lat) / 2 ||
                    37.78825,
                  longitude:
                    (pickupCoords?.lng + destinationCoords?.lng) / 2 ||
                    -122.4324,
                  latitudeDelta:
                    Math.abs(
                      (pickupCoords?.lat || 37.78825) -
                      (destinationCoords?.lat || 37.78825)
                    ) * 1.5 || 0.015,
                  longitudeDelta:
                    Math.abs(
                      (pickupCoords?.lng || -122.4324) -
                      (destinationCoords?.lng || -122.4324)
                    ) * 1.5 || 0.0121,
                }}
                showsUserLocation={true}
                customMapStyle={mapCustomStyle}
              >
                {ZoneArea ? (
                  <Polygon
                    coordinates={ZoneArea?.map(({ lng, lat }) => ({
                      latitude: lat,
                      longitude: lng,
                    }))}
                    strokeColor="rgba(0,0,0,0)"
                    fillColor="rgba(0,0,0,0)"
                    strokeWidth={2}
                  />
                ) : null}
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
                    coordinate={{
                      latitude: driver?.lat,
                      longitude: driver?.lng,
                    }}
                    title={`${translateData.driver} ${index + 1}`}
                  >
                    <CustomMarker
                      imageUrl={selectedVehicleData?.vehicle_map_icon_url}
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
                {destinationCoords && (
                  <Marker
                    coordinate={{
                      latitude: destinationCoords.lat,
                      longitude: destinationCoords.lng,
                    }}
                    title={translateData.destination}
                    pinColor={appColors.primary}
                  />
                )}
                {stopsCoords.map((stop, index) => (
                  <Marker
                    key={index}
                    coordinate={{ latitude: stop.lat, longitude: stop.lng }}
                    title={`${translateData.stop} ${index + 1}`}
                    pinColor={appColors.subtitle}
                  />
                ))}
                {pickupCoords && destinationCoords && (
                  <MapViewDirections
                    origin={{
                      latitude: pickupCoords.lat,
                      longitude: pickupCoords.lng,
                    }}
                    destination={{
                      latitude: destinationCoords.lat,
                      longitude: destinationCoords.lng,
                    }}
                    waypoints={stopsCoords.map((stop) => ({
                      latitude: stop.lat,
                      longitude: stop.lng,
                    }))}
                    apikey={taxidoSettingData?.taxido_values?.location?.google_map_api_key}
                    strokeColor={appColors.primary}
                    strokeWidth={4}
                    onReady={(result) => {
                      const totalMinutes = Math.floor(result.duration);
                      const totalSeconds = Math.round(
                        (result.duration - totalMinutes) * 60
                      );

                      setDistance(result.distance);
                      setDuration({
                        minutes: totalMinutes,
                        seconds: totalSeconds,
                      });
                    }}
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
          <View
            style={[
              styles.mainContainer,
              {
                backgroundColor: bgContainer,

                borderColor: isDark
                  ? appColors.darkBorder
                  : appColors.primaryGray,
              },
            ]}
          >
            {selectedOption === null ? (
              <>
                <View
                  style={[styles.selectedOptionView, {
                    flexDirection: viewRTLStyle

                  }]}
                >
                  <Text
                    style={[
                      styles.carType,
                      { color: textColorStyle, textAlign: textRTLStyle },
                    ]}
                  >
                    {translateData.vehicletype}
                  </Text>
                  {isExpanding && (
                    <View
                      style={{
                        flexDirection: viewRTLStyle,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: isDark
                            ? appColors.whiteColor
                            : appColors.primaryText,
                          fontFamily: appFonts.regular,
                        }}
                      >
                        {translateData.findingDriver}
                      </Text>
                      <FastImage
                        source={Images.loaderGIF}
                        style={styles.loaderGIF}
                      />
                    </View>
                  )}
                </View>

                <FlatList
                  horizontal
                  data={vehicleTypedata}
                  renderItem={renderItem}
                  contentContainerStyle={{ backgroundColor: bgContainer }}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}

                />
                {taxidoSettingData?.taxido_values?.activation?.bidding == 1 && (

                  <View style={[external.mh_10]}>
                    <Text
                      style={[
                        styles.title,
                        { color: isDark ? appColors.whiteColor : appColors.primaryText },
                        { textAlign: textRTLStyle },
                      ]}
                    >
                      {translateData.offerYourFare}
                    </Text>
                    <View
                      style={[
                        styles.inputcontainer,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : appColors.primaryGray,
                        },
                        { flexDirection: viewRTLStyle },
                      ]}
                    >
                      <View style={styles.coin}>
                        <Text>{zoneValue.currency_symbol}</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, { color: textColorStyle }]}
                        value={fareValue}
                        onChangeText={(text) => {
                          if (!selectedVehicleData) {
                            setVehicleSelectModal(true);
                            setFareValue("");
                          } else {
                            setFareValue(text);
                          }
                        }}
                        placeholder={translateData.enterFareAmount}
                        backgroundColor={bgContainer}
                        keyboardType="number-pad"
                        placeholderTextColor={appColors.regularText}
                      />
                    </View>
                    {Warning ? (
                      <Text style={styles.warningText}>{warningMessage}</Text>
                    ) : null}
                  </View>
                )}
                <View
                  style={[
                    styles.recommended,
                    {
                      backgroundColor: isDark
                        ? appColors.darkHeader
                        : appColors.lightGray,
                    },
                    {
                      borderColor: isDark
                        ? appColors.darkHeader
                        : appColors.lightGray,
                    },
                  ]}
                >
                  {parcelWeight ? (
                    <Text
                      style={[
                        styles.RideRecommendPrice,
                        { color: isDark ? appColors.whiteColor : appColors.primaryText },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {ParcelRecommendCharge * zoneValue?.exchange_rate}
                      <Text
                        style={[styles.priceTitle, { color: textColorStyle }]}
                      >
                        {" "}
                        - {translateData.recommendedPrice}
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.RideRecommendPrice,
                        { color: isDark ? appColors.whiteColor : appColors.primaryText },
                      ]}
                    >
                      {taxidoSettingData?.taxido_values?.activation?.bidding == 1
                        ? `${zoneValue?.currency_symbol}${Math.round(minChargeRide * zoneValue?.exchange_rate)} - ${zoneValue?.currency_symbol}${Math.round(maxChargeRide * zoneValue?.exchange_rate)}`
                        : `${zoneValue?.currency_symbol}${(minChargeRide * zoneValue?.exchange_rate).toFixed(2)}`
                      }
                      <Text
                        style={[styles.priceTitle, { color: textColorStyle }]}
                      >
                        {taxidoSettingData?.taxido_values?.activation?.bidding == 1
                          ?
                          ` - ${translateData.recommendedPrice}`
                          : ` - Fare Price`
                        }
                      </Text>
                    </Text>


                  )}
                </View>
              </>
            ) : null}

            {selectedOption === "selectPayment" ? (
              <>
                <View
                  style={styles.selectPaymentView}
                >
                  <TouchableOpacity style={{ alignSelf: 'flex-end', marginHorizontal: windowWidth(15) }} onPress={() => setSelectedOption(null)}>
                    <CloseCircle />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.payment,
                      { color: textColorStyle, textAlign: textRTLStyle },
                    ]}
                  >
                    {translateData.paymentMethodSelect}
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollViewStyle}
                >
                  <View style={styles.paymentContainer}>
                    <FlatList
                      data={activePaymentMethods}
                      renderItem={renderItem1}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={styles.listContent}
                    />
                  </View>
                </ScrollView>
              </>
            ) : null}

            {selectedOption === "switchRider" ? (
              <>
                <View style={styles.switchContainer}>
                  <TouchableOpacity onPress={handleNavigate} activeOpacity={0.7}
                  >
                    <View
                      style={[styles.switchRiderView, {
                        flexDirection: viewRTLStyle

                      }]}
                    >
                      <Text
                        style={[
                          commonStyles.mediumText23,
                          { color: textColorStyle, textAlign: textRTLStyle },
                        ]}
                      >
                        {translateData.talkingRide}
                      </Text>
                      <TouchableOpacity onPress={closeModal} activeOpacity={0.7} style={{ bottom: windowHeight(1.7) }}>
                        <Close />
                      </TouchableOpacity>
                    </View>
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
                          // external.fd_row,
                          { flexDirection: viewRTLStyle, right: windowWidth(3) },
                        ]}
                      >
                        <UserFill />
                        <Text
                          style={[
                            commonStyles.mediumTextBlack12,
                            // external.mh_2,
                            { fontSize: fontSizes.FONT19, marginHorizontal: windowWidth(8) },
                            {
                              color: isDark
                                ? appColors.whiteColor
                                : appColors.primaryText,
                            },
                          ]}
                        >
                          {translateData.myself}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.pressable}
                      >
                        <RadioButton
                          onPress={radioPress}
                          checked={isChecked}
                          color={appColors.primary}
                        />
                      </Pressable>
                    </View>
                    <SolidLine marginVertical={14} />

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[external.fd_row, external.js_space, { flexDirection: viewRTLStyle, marginTop: windowHeight(1) }]}
                      onPress={chooseRider}
                    >
                      <View style={[external.fd_row, external.ai_center]}>
                        <NewContact />
                        <Text style={[styles.chooseAnotherAccount, { marginLeft: windowWidth(10) }]}>
                          {translateData.contact}
                        </Text>
                      </View>
                      <Forword />
                    </TouchableOpacity>


                  </View>
                  <View
                    style={[
                      external.js_space,
                      external.mt_25,
                      { flexDirection: viewRTLStyle },
                    ]}
                  >
                  </View>
                </View>
              </>
            ) : null}

            <View
              style={[styles.cardView, {
                flexDirection: viewRTLStyle

              }]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleOptionSelect("selectPayment")}
                style={[styles.switchUser, {
                  flexDirection: viewRTLStyle,
                  backgroundColor:
                    selectedOption === "selectPayment"
                      ? appColors.selectPrimary
                      : isDark
                        ? appColors.darkHeader
                        : appColors.lightGray,


                  ...(selectedOption ? { top: windowHeight(4) } : {}),
                }]}
              >
                <View style={styles.userIcon}>
                  <Card />
                </View>
                {!selectedOption && (
                  <Text
                    style={[
                      styles.selectText,
                      { color: textColorStyle },
                      selectedOption === "selectPayment" && styles.selectedText,
                    ]}
                  >
                    {seletedPayment ? seletedPayment : translateData.payment}

                  </Text>
                )}

                {/* <Text
                  style={[
                    styles.selectText,
                    { color: textColorStyle },
                    selectedOption === "selectPayment" && styles.selectedText,
                  ]}
                >
                  {selectedOption === "selectPayment"
                    ? translateData.selectPayment
                    : selectedOption}
                </Text> */}
                {selectedOption && (
                  <Text
                    style={[
                      styles.selectText,
                      { color: textColorStyle },
                      selectedOption === "selectPayment" && styles.selectedText,
                    ]}
                  >
                    {seletedPayment ? seletedPayment : translateData.payment}

                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}

                onPress={() => handleOptionSelect("switchRider")}
                style={[styles.switchUser, {
                  flexDirection: viewRTLStyle,

                  backgroundColor:
                    selectedOption === "switchRider"
                      ? appColors.selectPrimary
                      : isDark
                        ? appColors.darkHeader
                        : appColors.lightGray,


                  ...(selectedOption ? { top: windowHeight(4) } : {}),
                }]}
              >
                <View style={styles.userIcon}>
                  <User />
                </View>
                <Text
                  style={[
                    styles.selectText,
                    { color: textColorStyle },
                    selectedOption === "switchRider" && styles.selectedText,
                  ]}
                >
                  {translateData.myself}
                </Text>
              </TouchableOpacity>
            </View>
            {!RideBooked ? (
              <View style={[external.mh_10]}>
                <View style={[external.mv_13]}>
                  <Button
                    title={isExpanding ? translateData.cancelRide : translateData.bookRide}
                    onPress={handleBookRide}
                  />
                </View>
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
                  distance={distance}
                  selectedItemData={selectedItemData}
                  onPress={() => setModelVisible(false)}
                />
              }
              onPress={() => setModelVisible(false)}
            />
          </View>

          {RideBooked ? (
            <View
              style={[
                external.mt_10,
                external.mh_15,
                { position: "absolute", top: 40 },
              ]}
            >
              <FlatList
                renderItem={renderItemRequest}
                data={bidValue?.data?.length > 0 ? [bidValue.data[0]] : []}
              />
            </View>
          ) : null}
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {translateData.cancelTheride}
                </Text>
                <View
                  style={[
                    styles.buttonContainer,
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.buttonText}>{translateData.Cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirmCancel}
                  >
                    <Text style={styles.buttonText}>{translateData.yesCancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            visible={vehicleSelectModal}
            animationType="slide"
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{translateData.selectVehicleType}</Text>
                <View
                  style={[
                    styles.buttonContainer,
                    { justifyContent: "center" },
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.buttonText}>{translateData.modelCloseBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
