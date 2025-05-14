import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { external } from '../../../../../../styles/externalStyle';
import { PackageItem } from './packageItem/index';
import { useDispatch, useSelector } from 'react-redux';
import { packageDataGet } from '@src/api/store/actions/packageAction';
import { distance } from '@turf/turf';

export function KmDetails({ onPackageSelect, onpackageVehicle }) {
  const [selectedId, setSelectedId] = useState(null);
  const { packageList } = useSelector(state => state.package);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(packageDataGet());
  }, []);

  const handlePress = (item) => {
    setSelectedId(item.id);
    const details = { hour: item.hour, distance: item.distance, id: item.id, distanceType: item.distance_type };
    onPackageSelect(details);
    const vehicleDetails = item.vehicle_types;
    onpackageVehicle(vehicleDetails);
  };

  const renderItem = ({ item }) => (
    <PackageItem
      item={item}
      isSelected={item.id === selectedId}
      onPress={() => handlePress(item)}
    />
  );

  return (
    <View style={external.mv_15}>
      <FlatList
        horizontal={true}
        renderItem={renderItem}
        data={packageList.data}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={external.mh_5}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
