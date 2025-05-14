import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, TouchableOpacity, View, ScrollView, Modal, Animated, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, Alert, Platform, TextInput } from "react-native";
import { History, Calender, AddressMarker, PickLocation, Save, Driving, Gps, Close, Add, Minus } from "@utils/icons";
import { styles } from "./styles";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { SolidLine, Button, Header, InputText } from "@src/commonComponent";
import { useValues } from "../../../App";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { userZone } from "../../api/store/actions/index";
import { vehicleTypeDataGet } from "../../api/store/actions/vehicleTypeAction";
import { getValue, setValue } from "@src/utils/localstorage";
import { appColors, windowHeight } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { LocationContext } from "@src/utils/locationContext";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import { PickUpDetails } from "@src/components";

export function LocationDrop() {
  const dispatch = useDispatch();
  const { navigate, replace } = useAppNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [destination, setDestination] = useState<string>("");
  const [stops, setStops] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const route = useRoute();
  const { service_ID, service_name, service_category_ID, service_category_slug, formattedDate, formattedTime } = route.params;
  const { selectedAddress, fieldValue } = route.params || {};
  const { selectedLocation, savefieldValue } = route.params || {};
  const [fieldLength, setFieldLength] = useState<number>(0);
  const [addressData, setAddressData] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [stopsCoords, setStopsCoords] = useState<Array<{ lat: number; lng: number }>>([]);
  const [loading, setLoading] = useState(true);
  const { driverData } = useSelector((state: any) => state.allDriver);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const { zoneValue } = useSelector((state: any) => state.zone);
  const [visible, setVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(-30)).current;
  const [showBar, setShowBar] = useState(false);
  const { settingData } = useSelector((state: any) => state.setting);
  const [recentDatas, setRecentDatas] = useState<string[]>([]);
  const { DateValue, TimeValue, field } = route.params || {};
  const [scheduleDate, setScheduleDate] = useState({
    DateValue: DateValue || "",
    TimeValue: TimeValue || "",
  });
  const [proceedLoading, setProceedLoading] = useState(false);
  const { translateData, taxidoSettingData } = useSelector((state) => state.setting);
  const { latitude, longitude } = useStoredLocation();
  const context = useContext(LocationContext);
  const { setPickupLocationLocal, stopsLocal, setStopsLocal, setDestinationLocal, } = context;



  useEffect(() => {
    fetchAddressFromCoords(latitude, longitude);
  }, [latitude, longitude]);

  const fetchAddressFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) return;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${taxidoSettingData?.taxido_values?.location?.google_map_api_key}`;
    try {
      const response = await fetch(url);

      const json = await response.json();
      if (json.status === "OK" && json.results.length > 0) {
        const address = json.results[0].formatted_address;

        setPickupLocation(address);
        setPickupCoords({ latitude, longitude });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };


  useEffect(() => {
    setScheduleDate({
      DateValue: DateValue || "",
      TimeValue: TimeValue || "",
    });
  }, [DateValue, TimeValue]);

  useEffect(() => {
    const fetchRecentData = async () => {
      const stored = await getValue("locations");
      if (stored) {
        const parsedLocations = JSON.parse(stored);
        setRecentDatas(parsedLocations);
      }
    };
    fetchRecentData();
  }, []);

  let Recent = getValue("recentAddress")
    .then((Recent) => { })
    .catch((error) => {
      console.error("Error fetching recent address:", error);
    });

  useEffect(() => {
    if (fieldLength > 3) {
      setShowBar(true);
      startAnimation();
      setVisible(true);
    } else {
      setShowBar(false);
      setVisible(false);
    }
  }, [fieldLength]);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -30,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -30,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  const fetchAddressSuggestions = async (input: string) => {
    if (input.length >= 3) {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${taxidoSettingData?.taxido_values?.location?.google_map_api_key}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status !== "OK") {
          console.error("API Error:", data.status, data.error_message || "");
          return;
        }
        if (data.predictions) {
          const places = data.predictions?.map(
            (prediction) => prediction.description
          );
          setSuggestions(places);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue("recentAddress", suggestion);
    Keyboard.dismiss();
    if (activeField === "pickupLocation") {
      setPickupLocation(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = suggestion;
      setStops(updatedStops);
    }
  };

  const handlerecentClick = (suggestion: string) => {
    Keyboard.dismiss();
    if (activeField === "pickupLocation") {
      setPickupLocation(suggestion.location);
    } else if (activeField === "destination") {
      setDestination(suggestion.location);
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = suggestion;
      setStops(updatedStops);
    }
  };

  useEffect(() => {
    fetchAddressSuggestions(addressData);
  }, [addressData]);

  useEffect(() => {
    let length = 0;
    let addressData = "";

    if (activeField === "pickupLocation") {
      length = pickupLocation?.length;
      addressData = pickupLocation;
    } else if (activeField === "destination") {
      length = destination?.length;
      addressData = destination;
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const stopData = stops[stopIndex];
      if (stopData !== undefined) {
        length = stopData?.length;
        addressData = stopData;
      }
    }
    setAddressData(addressData);
    setFieldLength(length);
  }, [activeField, stops, pickupLocation, destination]);

  const coordsData = async () => {

    const geocodeAddress = async (address) => {
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
            latitude: location.lat,
            longitude: location.lng,
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
        const stopsCoordsPromises = stops?.map(geocodeAddress);
        const stopsResults = await Promise.all(stopsCoordsPromises);
        setPickupCoords(pickup);
        setDestinationCoords(destinationLoc);
        setStopsCoords(stopsResults.filter((coords) => coords !== null));



        if (pickup?.latitude && pickup?.longitude) {
          dispatch(userZone({ lat: pickup.latitude, lng: pickup.longitude }));
          getVehicleTypes(pickup.latitude, pickup.longitude);
          setIsInitialFetchDone(true);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinates();
  };

  const getVehicleTypes = (lat: number, lng: number) => {
    const payload = {
      locations: [
        {
          lat: lat,
          lng: lng,
        },
      ],
      service_id: service_ID,
      service_category_id: service_category_ID,
    };

    dispatch(vehicleTypeDataGet(payload)).then((res: any) => { });
  };

  useEffect(() => {


    if (zoneValue && isInitialFetchDone) {
      gotoNext();
    }
  }, [zoneValue]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchCoordinates = async (address) => {

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${taxidoSettingData?.taxido_values?.location?.google_map_api_key}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("Unable to fetch coordinates");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const outOfCity = () => {
    Alert.alert(`${translateData.outOfCity}`, `${translateData.outOfCityDes}`);
    setProceedLoading(false)
  };

  const insideCity = () => {
    Alert.alert(
      `${translateData.insideCity}`,
      `${translateData.insideCityDes}`
    );
    setProceedLoading(false)
  };

  const rideBooking = async () => {

    let token = "";
    await getValue("token").then(function (value) {
      token = value;
    });
    if (token) {
      if (destination && destination.trim().length > 0) {
        const newLocation = { location: destination };
        (async () => {
          try {
            const stored = await getValue("locations");
            let storedLocations = JSON.parse(stored) || [];

            storedLocations.push(newLocation);
            if (storedLocations.length > 5) {
              storedLocations.shift();
            }
            await setValue("locations", JSON.stringify(storedLocations));
          } catch (error) {
            console.error("Error handling locations:", error);
          }
        })();
      }



      if (!destination || !pickupLocation) {
        setModalVisible(true);
      } else {
        coordsData();
      }
    } else {
      let screenName = "LocationDrop";
      setValue("CountinueScreen", screenName);
      replace("SignIn");
    }
  };

  const gotoBook = async () => {
    setProceedLoading(true);
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const pickupCoords = await fetchCoordinates(pickupLocation);
      const destinationCoords = await fetchCoordinates(destination);
      if (!pickupCoords || !destinationCoords) {
        Alert.alert("Error", "Unable to fetch coordinates for locations.");
        setProceedLoading(false);
        return;
      }

      const distance = calculateDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        destinationCoords.lat,
        destinationCoords.lng
      );


      if (service_category_slug == "intercity" || service_category_slug == "intercity-freight" || service_category_slug == "intercity-parcel") {
        distance < 30 ? insideCity() : rideBooking();
      } else if (service_category_slug == "ride" || service_category_slug == "ride-freight" || service_category_slug == "ride-parcel") {
        distance > 30 ? outOfCity() : rideBooking();
      } else if (service_category_slug == "schedule" || service_category_slug == "package" || service_category_slug == "schedule-freight" || service_category_slug == "schedule-parcel") {
        rideBooking();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };


  const gotoNext = () => {
    if (service_name === "cab") {
      navigate("BookRide", {
        destination,
        stops,
        pickupLocation,
        service_ID,
        zoneValue,
        scheduleDate,
        service_category_ID,
        service_name
      });
      setProceedLoading(false);
    } else if (service_name == "freight" || service_name == "parcel") {
      navigate("Outstation", {
        destination,
        stops,
        pickupLocation,
        service_ID,
        zoneValue,
        service_name,
        service_category_ID,
      });
      setProceedLoading(false);
    }
  };


  const gotoSelection = () => {
    navigate("LocationSelect", { field: activeField, screenValue: "Ride" });
  };

  const gotoSaveLocation = async () => {
    let token = "";
    await getValue("token").then(function (value) {
      token = value;
    });
    if (token) {
      navigate("SavedLocation", { selectedLocation: "locationDrop", savefield: activeField });
    } else {
      let screenName = "LocationDrop";
      if (settingData.values.activation.login_number == 1) {
        setValue("CountinueScreen", screenName);
        replace("SignIn");
      } else if (settingData.values.activation.login_number == 0) {
        setValue("CountinueScreen", screenName);
        replace("SignInWithMail");
      }
    }
  };

  const { linearColorStyle, viewRTLStyle, textColorStyle, bgFullLayout, textRTLStyle, isDark, isRTL } = useValues();

  useEffect(() => {
    if (fieldValue === "pickupLocation") {
      setPickupLocation(selectedAddress);
    } else if (fieldValue === "destination") {
      setDestination(selectedAddress);
    } else if (fieldValue && fieldValue.startsWith("stop-")) {
      const stopIndex = parseInt(fieldValue.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = selectedAddress;
      setStops(updatedStops);
    }
  }, [selectedAddress, fieldValue]);


  useEffect(() => {
    if (savefieldValue === "pickupLocation") {
      setPickupLocation(selectedLocation);
    } else if (savefieldValue === "destination") {
      setDestination(selectedLocation);
    } else if (savefieldValue && savefieldValue.startsWith("stop-")) {
      const stopIndex = parseInt(savefieldValue.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = selectedLocation;
      setStops(updatedStops);
    }
  }, [selectedLocation, savefieldValue]);

  const renderItemRecentData = ({ item: suggestion, index }) => (
    <View style={styles.renderItemRecentView}>
      <TouchableOpacity
        activeOpacity={0.7}
        key={index}
        style={[styles.historyBtn, { flexDirection: viewRTLStyle }]}
        onPress={() => handlerecentClick(suggestion)}
      >
        <View
          style={[
            styles.historyView,
            {
              backgroundColor: isDark
                ? appColors.darkBorder
                : appColors.lightGray,
            },
          ]}
        >
          <History />
        </View>

        <Text
          style={[
            styles.locationText,
            { color: textColorStyle },
            { textAlign: textRTLStyle },
          ]}
        >
          {suggestion.location}
        </Text>
      </TouchableOpacity>
      {index !== recentDatas.length - 1 && (
        <View
          style={[
            styles.bottomLine,
            {
              borderColor: isDark ? appColors.darkBorder : appColors.lightGray,
            },
          ]}
        />
      )}
    </View>
  );

  const addStop = () => {
    if (stopsLocal.length < 3) {
      const newStops = [...stopsLocal, ""];
      setStopsLocal(newStops);
      setStops(newStops);
    }
  };

  const removeStop = (index: number) => {
    const updatedStops = stopsLocal.filter((_, i) => i !== index);
    setStopsLocal(updatedStops);
    setStops(updatedStops);

    if (updatedStops.length === 0) {
      setActiveField("destination");
    } else if (index === stopsLocal.length - 1) {
      setActiveField(`stop-${updatedStops.length}`);
    }
  };

  const handleInputChange = (text: string, id: number) => {
    if (id === 1) {
      setPickupLocationLocal(text);
      setPickupLocation(text);
    } else if (id === 2) {
      setDestinationLocal(text);
      setDestination(text);
    } else {
      const updatedStops = stopsLocal?.map((stop, index) =>
        index + 3 === id ? text : stop
      );
      setStopsLocal(updatedStops);
      setStops(updatedStops);
    }
  };

  const handleFocus = (id: number) => {
    if (id === 1) {
      setActiveField("pickupLocation");
    } else if (id === 2) {
      setActiveField("destination");
    } else {
      setActiveField(`stop-${id - 2}`);
    }
  };

  const handleCloseStop = (index) => {
    const updatedStops = [...stopsLocal];
    updatedStops[index] = "";
    setStopsLocal(updatedStops);
    setStops(updatedStops);
  };

  const handleClosepickup = () => {
    setPickupLocationLocal("");
    setPickupLocation("");
  };

  const handleCloseDestination = () => {
    setDestination("");
    setDestinationLocal("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.main} >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.main}>
          <ScrollView
            style={[styles.main, { backgroundColor: linearColorStyle }]}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Header
                value={translateData.location}
                backgroundColor={
                  isDark ? appColors.darkPrimary : appColors.whiteColor
                }
              />
              <View
                style={[
                  styles.horizontalView,
                  {
                    backgroundColor: isDark
                      ? appColors.darkPrimary
                      : appColors.whiteColor,
                  },
                ]}
              >
                <View style={styles.pickupdetailsView}>
                  
                  <View
                    style={[
                      styles.containers,
                      {
                        backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                        borderColor: isDark ? appColors.darkBorder : appColors.border,
                      },
                    ]}
                  >
                    <View
                      contentContainerStyle={styles.scrollContainer}
                      keyboardShouldPersistTaps="handled"
                    >
                      <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray },
                          ]}
                        >
                          <Gps width={20} height={20} />
                        </View>
                        <View
                          style={[styles.inputWithIcons, { flexDirection: viewRTLStyle }]}
                        >
                          <TextInput
                            style={[
                              styles.input,
                              {
                                color: isDark ? appColors.whiteColor : appColors.primaryText,
                              },
                              { textAlign: textRTLStyle },
                            ]}
                            placeholderTextColor={
                              isDark ? appColors.darkText : appColors.regularText
                            }
                            placeholder={translateData.pickupLocationTittle}
                            value={pickupLocation}
                            onChangeText={(text) => handleInputChange(text, 1)}
                            onFocus={() => handleFocus(1)}
                          />
                        </View>
                        {pickupLocation?.length >= 1 && (
                          <TouchableOpacity onPress={handleClosepickup} activeOpacity={0.7}
                          >
                            <Close />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          borderColor: isDark ? appColors.darkBorder : appColors.border,
                          borderBottomWidth: windowHeight(0.3),
                          width: "86%",
                          marginHorizontal: isRTL ? windowHeight(8) : windowHeight(29),
                        }}
                      />

                      <View
                        style={[
                          styles.line2,
                          {
                            borderColor: isDark
                              ? appColors.regularText
                              : appColors.blackColor,
                          },
                          { left: isRTL ? "96%" : windowHeight(9.9) },
                        ]}
                      />
                      {stops?.map((stop, index) => (
                        <View
                          key={index + 3}
                          style={[
                            styles.inputContainer,
                            index === stops.length - 1 ? {} : { marginBottom: 8 },
                            { flexDirection: viewRTLStyle },
                          ]}
                        >
                          <View style={styles.iconContainer}>
                            <View
                              style={[
                                styles.numberContainer,
                                {
                                  backgroundColor: isDark
                                    ? appColors.whiteColor
                                    : appColors.blackColor,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.numberText,
                                  {
                                    color: isDark
                                      ? appColors.blackColor
                                      : appColors.whiteColor,
                                  },
                                ]}
                              >
                                {index + 1}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.inputWithIcons}>
                            <TextInput
                              style={[
                                styles.input,
                                index === stops.length - 1
                                  ? {}
                                  : {
                                    borderBottomWidth: windowHeight(0.9),
                                    borderBottomColor: isDark
                                      ? appColors.darkBorder
                                      : appColors.border,
                                  },
                                { textAlign: textRTLStyle },
                                {
                                  borderColor: isDark
                                    ? appColors.darkBorder
                                    : appColors.border,
                                },
                              ]}
                              placeholderTextColor={
                                isDark ? appColors.darkText : appColors.regularText
                              }
                              placeholder={translateData.addStopPlaceHolderText}
                              value={stop}
                              onChangeText={(text) => handleInputChange(text, index + 3)}
                              onFocus={() => handleFocus(index + 3)}
                            />

                            <View
                              style={[
                                styles.addButton,
                                { flexDirection: viewRTLStyle },
                                { right: isRTL ? "85%" : windowHeight(6) },
                              ]}
                            >
                              {stops[index]?.trim() !== "" && (
                                <TouchableOpacity onPress={() => handleCloseStop(index)} activeOpacity={0.7}
                                >
                                  <Close />
                                </TouchableOpacity>
                              )}
                              {index === stops.length - 1 && (
                                <>
                                  <View style={styles.iconSpacing} />
                                  <TouchableOpacity onPress={() => removeStop(index)} activeOpacity={0.7}
                                  >
                                    <Minus colors={textColorStyle} width={20} height={20} />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>
                          </View>
                          {index < stops.length && (
                            <View
                              style={[
                                styles.line,
                                { borderColor: appColors.regularText },
                                { left: isRTL ? "96%" : 12 },
                              ]}
                            />
                          )}
                        </View>
                      ))}

                      <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray },
                          ]}
                        >
                          <PickLocation width={20} height={20} />
                        </View>
                        <View style={styles.inputWithIcons}>
                          <View style={styles.inputWidth}>
                            <TextInput
                              style={[
                                styles.input,
                                {
                                  color: isDark
                                    ? appColors.whiteColor
                                    : appColors.primaryText,
                                },
                                { textAlign: textRTLStyle },
                                { left: isRTL ? windowHeight(55) : windowHeight(0) },
                              ]}
                              placeholderTextColor={
                                isDark ? appColors.darkText : appColors.regularText
                              }
                              placeholder={translateData.enterDestinationPlaceholderText}
                              value={destination}
                              onChangeText={(text) => handleInputChange(text, 2)}
                              onFocus={() => handleFocus(2)}
                            />
                          </View>
                          <View
                            style={[
                              styles.addButton,
                              { flexDirection: viewRTLStyle },
                              { right: isRTL ? "85%" : windowHeight(6) },
                            ]}
                          >
                            {destination?.length >= 1 && (
                              <TouchableOpacity onPress={handleCloseDestination} activeOpacity={0.7}
                              >
                                <Close />
                              </TouchableOpacity>
                            )}
                            {stops.length < 3 && (
                              <>
                                <View style={styles.iconSpacing} />
                                <TouchableOpacity onPress={addStop} activeOpacity={0.7}
                                >
                                  <Add colors={textColorStyle} width={20} height={20} />
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {(service_category_slug === "schedule" || field === "schedule") && (
                  <InputText
                    borderColor={isDark ? appColors.darkBorder : appColors.border}
                    backgroundColor={isDark ? appColors.darkPrimary : appColors.lightGray}
                    placeholder={translateData.DateandTextTime}
                    rightIcon={<Calender />}
                    onPress={() =>
                      navigate("Calander", {
                        fieldValue: "Ride",
                        service_ID: service_ID,
                        service_name: service_name,
                        categoryId: service_category_ID,
                        service_category_slug: service_category_slug,
                        DateValue: formattedDate,
                        TimeValue: formattedTime,
                      })
                    }
                    editable={false}
                    value={`${DateValue || "Date"} ${TimeValue || "and Time"}`}
                  />
                )}
                <View
                  style={[
                    external.fd_row,
                    external.js_space,
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  <TouchableOpacity
                    onPress={gotoSelection}
                    activeOpacity={0.7}
                    style={[
                      styles.locationBtn,
                      {
                        backgroundColor: isDark
                          ? appColors.lightPrimary
                          : appColors.selectPrimary,
                      },
                      { flexDirection: viewRTLStyle },
                    ]}
                  >
                    <View style={external.mh_5}>
                      <PickLocation />
                    </View>

                    <Text
                      style={[
                        styles.locationBtnText,
                        {
                          color: isDark
                            ? appColors.whiteColor
                            : appColors.blackColor,
                        },
                      ]}
                    >
                      {translateData?.locateonmap}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={gotoSaveLocation}
                    activeOpacity={0.7}
                    style={[
                      styles.locationBtn,
                      { backgroundColor: appColors.primary },
                      { flexDirection: viewRTLStyle },
                    ]}
                  >
                    <View style={external.mh_5}>
                      <Save />
                    </View>

                    <Text
                      style={[
                        styles.locationBtnText,
                        { color: appColors.whiteColor },
                      ]}
                    >
                      {translateData?.savedLocation}
                    </Text>
                  </TouchableOpacity>
                </View>
                {visible && (
                  <Animated.View
                    style={[styles.bar, { transform: [{ translateX }] }]}
                  />
                )}
              </View>
            </View>
            <View style={{ marginTop: windowHeight(35), bottom: windowHeight(20) }}>
              {(service_category_slug === "intercity" || service_category_slug === "schedule") && (
                <View style={styles.viewContainerToll}>
                  <Driving />
                  <Text style={styles.fareStyle}>{translateData.note}</Text>
                </View>
              )}
            </View>
            <View
              style={[styles.recentView, { backgroundColor: linearColorStyle }, { bottom: windowHeight(22) }]}
            >
              <Text
                style={[
                  commonStyles.mediumText23,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}
              >
                {fieldLength >= 3
                  ? translateData.addressSuggestion
                  : translateData.recent}
              </Text>
              <View
                style={[
                  styles.mapView,
                  {
                    backgroundColor: isDark
                      ? appColors.darkPrimary
                      : appColors.whiteColor,
                  },
                  {
                    borderColor: isDark
                      ? appColors.darkBorder
                      : appColors.border,
                  },
                ]}
              >
                {suggestions.length >= 3 ? (
                  suggestions?.map((suggestion, index) => (
                    <TouchableOpacity
                      activeOpacity={0.7}

                      style={[
                        styles.suggestionsView,
                        {
                          flexDirection: viewRTLStyle,
                        },
                      ]}
                      key={index}
                      onPress={() => handleSuggestionClick(suggestion)}
                    >
                      <View
                        style={[
                          styles.addressMArker,
                          {
                            backgroundColor: isDark
                              ? appColors.bgDark
                              : appColors.lightGray,
                          },
                        ]}
                      >
                        <AddressMarker />
                      </View>
                      <View>
                        <View
                          style={[
                            external.pv_10,
                            { flexDirection: viewRTLStyle },
                            styles.spaceing,
                          ]}
                        >
                          <View>
                            <Text
                              style={[
                                styles.titleText,
                                {
                                  color: textColorStyle,
                                  textAlign: textRTLStyle,
                                },
                              ]}
                            >
                              {suggestion}
                            </Text>
                          </View>
                        </View>
                        {index !== suggestions.length - 1 ? (
                          <View style={{ alignSelf: "center" }}>
                            <SolidLine color={bgFullLayout} />
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : Array.isArray(recentDatas) && recentDatas.length > 0 ? (
                  <FlatList
                    data={recentDatas}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItemRecentData}
                  />
                ) : (
                  <View style={styles.addressItemView}>
                    <Text
                      style={[
                        styles.noAddressText,
                        {
                          color: textColorStyle,
                        },
                      ]}
                    >
                      {translateData.noAddressFound}
                    </Text>
                  </View>
                )}
              </View>
              <View style={[external.mb_15]}>
                <Button
                  title={translateData.proceed}
                  onPress={gotoBook}
                  disabled={isProcessing}
                  loading={proceedLoading}
                />
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>
                    {translateData.bookingNote}
                  </Text>
                  <Button
                    title={translateData.close}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}