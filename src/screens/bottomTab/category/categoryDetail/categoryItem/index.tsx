import {  Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styles } from '../style';
import { appColors } from '@src/themes';
import { ArrowService } from '@utils/icons';
import { useValues } from '@App';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Images from '@src/utils/images';


export function CategoryItem({ item, onPress }) {
  const { viewRTLStyle, bgFullStyle, textRTLStyle, isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgFullStyle }]}>
      <TouchableOpacity onPress={onPress} style={styles.imageView} activeOpacity={0.7}>
        <FastImage
          resizeMode="contain"
          style={styles.imgBg}
          source={
            item?.service_image_url
              ? { uri: item.service_image_url }
              : Images.imagePlaceholder
          }
        />
        <View style={[styles.mainView, { flexDirection: viewRTLStyle }]}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={[styles.roundedShadowContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}>
            <ArrowService />
          </View>
        </View>
        <Text style={[styles.text, { textAlign: textRTLStyle }]}>{translateData?.quickAndReliableRideService}</Text>
      </TouchableOpacity>
    </View>
  );
};

