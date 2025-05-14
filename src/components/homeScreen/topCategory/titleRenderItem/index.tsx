import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styles } from '../styles';
import { useValues } from '@App';
import { appColors } from '@src/themes';
import Images from '@src/utils/images';

const { width } = Dimensions.get("window");

export function TitleRenderItem({ item, index, selectedIndex, onPress, isScrollable, totalItems }) {
  const { isDark } = useValues()

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item, index)}
      style={[styles.item, { width: isScrollable ? width / 4 : width / totalItems }]}
    >
      {/* <Image source={{
        uri: item.service_category_image_url
      }} style={styles.image} /> */}
      <Image

        style={styles.image}
        source={
          item?.service_category_image_url
            ? { uri: item.service_category_image_url }
            : Images.imagePlaceholder
        }
      />
      <Text style={[styles.text, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
        {item.name}
      </Text>
      <View style={[styles.highlightLine, selectedIndex !== index && styles.invisibleLine]} />
    </TouchableOpacity>
  );
}


