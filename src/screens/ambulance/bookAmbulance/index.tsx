import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { Button, CommonModal, Header } from "@src/commonComponent";
import { appColors } from "@src/themes";
import { Ambulance, CloseCircle, IdCard, PickLocation } from "@src/utils/icons";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@src/api/store";
import { useRoute } from "@react-navigation/native";
import { ambulancebook } from "@src/api/store/actions";
import FastImage from "react-native-fast-image";
import Images from "@src/utils/images";
import styles from "./styles";
import { useValues } from "@App";

export function BookAmbulance() {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute();
    const { location, lat, lng } = route.params;
    const [selectedId, setSelectedId] = useState(null);
    const { ambulanceList } = useSelector((state) => state.ambulance);
    const [selectedAmbulance, setSelectedAmbulance] = useState();
    const [waiting, setWaiting] = useState(false);
    const { viewRTLStyle, isDark, textRTLStyle, bgContainer } = useValues()
    const { translateData } = useSelector((state) => state.setting);
    const { zoneValue } = useSelector((state: any) => state.zone);

    const bookAmbulance = () => {
        setWaiting(true)
        const payload = {
            service_id: 4,
            location_coordinates: [
                {
                    lat: lat,
                    lng: lng
                }
            ],
            locations: [
                location
            ],
            payment_method: "cash",
            select_type: "manual",
            ambulance_id: selectedAmbulance?.id,
            cucurrency_code: zoneValue?.currency_code
        };

        dispatch(ambulancebook(payload))
            .unwrap()
            .then((res: any) => {

            })
            .catch((error: any) => {
                console.error('Booking failed:', error);
            });
    };


    return (
        <View style={styles.mainView}>
            <Header value={translateData?.bookAmbulance} />
            <ScrollView style={{ backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5' }}>
                <View
                    style={[styles.mainContainer, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View>
                        <PickLocation />
                    </View>
                    <View style={styles.pickUpView}>
                        <Text
                            style={[styles.pickUp, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        >
                            {translateData?.pickupLocation}
                        </Text>
                        <Text
                            style={[styles.locationText, { textAlign: textRTLStyle }]}
                        >
                            {location?.length > 75 ? location.substring(0, 75) + "..." : location}

                        </Text>
                    </View>
                </View>
                <Text
                    style={[styles.description, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                >
                    {translateData?.additionalDescription}
                </Text>
                <View
                    style={[styles.ambulanceView, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View style={styles.idCard}>
                        <IdCard />
                    </View>
                    <View>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border, textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                            multiline
                            numberOfLines={5}
                            placeholder={translateData?.writePlaceholder}
                            placeholderTextColor={appColors.gray}
                        />
                    </View>
                </View>
                <Text
                    style={[styles.ambulanceText, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                >
                    {translateData?.selectAmbulance}
                </Text>


                <FlatList
                    data={ambulanceList?.data}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        const isSelected = selectedId === item.id;
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedId(item.id);
                                    setSelectedAmbulance(item);
                                }}
                                style={[styles.container, {
                                    backgroundColor: isSelected
                                        ? (isDark ? appColors.darkPrimary : appColors.lightButton)
                                        : (isDark ? appColors.darkPrimary : appColors.whiteColor)
                                    , borderColor: isSelected ? appColors.price : (isDark ? appColors.darkBorder : appColors.border),
                                }, { flexDirection: viewRTLStyle }]}>
                                <View
                                    style={[styles.bottomView]}
                                >
                                    <Ambulance />
                                </View>
                                <View
                                    style={styles.textView}>
                                    <Text
                                        style={[styles.itemText, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        style={[styles.text, { textAlign: textRTLStyle }]}>
                                        {translateData?.emergencySupport}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
                <CommonModal
                    isVisible={waiting}
                    animationType={'none'}
                    onPress={() => setWaiting(false)}
                    value={
                        <View style={styles.modelView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setWaiting(false)}>
                                <CloseCircle />
                            </TouchableOpacity>
                            <FastImage source={Images.waiting} style={styles.waitingImg} resizeMode="contain" />
                            <Text style={styles.ambulanceApprovalText}>{translateData?.ambulanceApproval}</Text>
                        </View>
                    }

                />
            </ScrollView>
            <View style={styles.btn}>
                <Button title={translateData?.bookAmbulance} onPress={bookAmbulance} />
            </View>
        </View>
    );
}
