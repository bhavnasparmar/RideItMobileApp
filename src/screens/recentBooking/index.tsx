import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import { appColors } from '@src/themes'
import { CalenderSmall, ClockSmall, Gps, PickLocation } from '@src/utils/icons'
import { external } from '@src/styles/externalStyle'
import { styles } from './styles'
import { useValues } from '@App'
import { Button, formatDateTime } from '@src/commonComponent'
import { useAppNavigation } from '@src/utils/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { userRideLocation } from '@src/api/store/actions'

export function Recentbooking({ recentRideData }) {
    const { bgFullStyle, textColorStyle, viewRTLStyle, isDark, textRTLStyle } = useValues();
    const dispatch = useDispatch();
    const { zoneValue } = useSelector((state: any) => state.zone);
    if (!recentRideData || recentRideData.length === 0) {
        return null;
    }
    const { translateData } = useSelector((state) => state.setting);
    const { navigate } = useAppNavigation();
    const gotoBook = (item: { id: any; locations: string | any[]; service_id: any; service_category_id: any }) => {

        const ride_number = item?.id;
        const destination = item?.locations?.[item.locations.length - 1];
        const stops: never[] = [];
        const pickupLocation = item?.locations?.[0];
        const categoryId = item?.service_id
        const scheduleDate = null
        const categoryOptionID = item?.service_category_id


        dispatch(userRideLocation({ ride_number }))
            .unwrap()
            .then((res: any) => {
                const zoneValue = res?.data[0];
                navigate("BookRide", {
                    destination,
                    stops,
                    pickupLocation,
                    categoryId,
                    zoneValue,
                    scheduleDate,
                    categoryOptionID,
                });
            })
            .catch((error: any) => {
                console.error('Booking failed:', error);
            });
    };

    const renderItem = ({ item }:any) => {
        const { date, time } = formatDateTime(item?.created_at);

        return (
            <View
                style={[styles.view, {
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                    backgroundColor: bgFullStyle,
                }]}>
                <View style={{ flexDirection: viewRTLStyle }}>
                    <View style={styles.viewWidth}>
                        <View style={{ flexDirection: viewRTLStyle }}>
                            <View style={styles.imageView}>
                                {/* <Image source={{
                                    uri: item.vehicle_type.vehicle_image_url
                                }} style={styles.img} /> */}
                                <Image source={require('../../assets/images/homeScreenImage/rideLogo.png')} style={styles.img} />
                            </View>
                            <View style={styles.textView}>
                                {/* <Text style={[styles.textId, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>#{item.ride_number}</Text> */}
                                                                <Text style={[styles.textId, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>#{'123456'}</Text>

                                {/* <Text style={styles.price}>{zoneValue?.currency_symbol}{item.total}</Text> */}
                                <Text style={styles.price}>{zoneValue?.currency_symbol}{'2'}</Text>
                                <Text style={[styles.textId, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{Number('12').toFixed(1)} {'km'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewWidth1}>
                        <View style={[styles.clockSmallView1, { flexDirection: viewRTLStyle }]}>
                            <View style={styles.clockSmall}>
                                <CalenderSmall />
                            </View>
                            {/* <Text style={styles.date}>{date}</Text> */}
                        </View>
                        <View style={[styles.clockSmallView, { flexDirection: viewRTLStyle }]}>
                            <View style={styles.clockSmall}>
                                <ClockSmall />
                            </View>
                            <Text style={styles.date}>{time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.border} />
                <View style={[{ flexDirection: viewRTLStyle }, { backgroundColor: bgFullStyle }]}>
                    <View style={[external.fd_column, external.mh_15, external.mt_8]}>
                        <PickLocation height={12} width={12} colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                        <View style={styles.icon} />
                        <Gps height={12} width={12} colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                    </View>
                    <View style={[external.pv_10]}>
                        <Text style={[styles.itemStyle, { color: textColorStyle, width: '100%' }]}>
                            10
                            {/* {item?.locations[0]?.length > 42
                                ? `${item.locations[0].slice(0, 42)}...`
                                : item?.locations[0]} */}
                        </Text>
                        <View style={styles.dashedLine} />
                        <Text style={[styles.pickUpLocationStyles, { color: textColorStyle }]}>{10000}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button textColor={appColors.whiteColor} title={'book'} onPress={() => gotoBook(item)} />
                </View>
            </View>
        )
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
            <Text style={[styles.recentRides, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}>{translateData?.homeRecentRides ? translateData?.homeRecentRides : 'Baroda to dahod'}</Text>
            <FlatList
                data={recentRideData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
