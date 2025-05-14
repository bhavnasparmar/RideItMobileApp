import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useValues } from '../../../../../App'
import styles from '../../styles'
import { Star } from '@utils/icons'

export function DriverData({ driverData, driverDetail }) {
    const { viewRTLStyle, textColorStyle } = useValues();

    return (
        <TouchableOpacity style={{ flexDirection: viewRTLStyle }} onPress={driverData} activeOpacity={0.7}
        >
            <Image source={{ uri: driverDetail?.profile_image?.original_url }} style={styles.userImage} />
            <View style={styles.profileData} >
                <Text style={[styles.name, { color: textColorStyle }]}>{driverDetail?.name}</Text>
                <View style={{ flexDirection: viewRTLStyle }} >
                    <View style={styles.star}>
                        <Star />
                    </View>
                    <Text style={[styles.rating, { color: textColorStyle }]}>4.8</Text>
                    <Text style={styles.review}>(127)</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
