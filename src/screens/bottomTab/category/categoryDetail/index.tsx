import { FlatList, View } from 'react-native';
import React, { useState } from 'react';
import { external } from '../../../../styles/externalStyle';
import { CategoryItem } from './categoryItem/index';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '@src/utils/navigation';
import { homeScreenData } from '@src/api/store/actions';

export function CategoryDetail() {
  const { navigate } = useAppNavigation();
  const { serviceData } = useSelector((state: any) => state.service);
  const dispatch = useDispatch();

  const renderItem = ({ item }: { item: any }) => {
    const service = item.slug;
    const handlePress = () => {
      if (item.slug === 'ambulance') {
        navigate('AmbulanceSearch');
        dispatch(homeScreenData({ service }))
      } else if (item.slug === 'cab' || item.slug === 'parcel' || item.slug === 'freight') {
        dispatch(homeScreenData({ service }))
        navigate('HomeService', { itemName: item.name, serviceValue: item });
      } else if (item.slug === 'car_pooling') {
        navigate('CarpoolingHome', { itemName: item.name, serviceValue: item });
      }
    };
    return <CategoryItem item={item} onPress={handlePress} />;
  };

  return (
    <View style={[external.as_center]}>
      <FlatList
        data={serviceData?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.someUniqueField}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};
