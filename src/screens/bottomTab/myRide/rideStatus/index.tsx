import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ridesStatusData } from "../../../../data/rideStatus/index";
import { appColors } from "@src/themes";
import { styles } from "./styles";
import { commonStyles } from "../../../../styles/commonStyle";
import { ActiveRide } from "./activeRide/index";
import { PendingRide } from "./pendingRide/index";
import { CompletedRide } from "./completedRide/index";
import { CancelRide } from "./cancelRide/index";
import { ScheduleRide } from "./scheduleRide/index";
import { useValues } from "../../../../../App";
import { useLoadingContext } from "@src/utils/context";
import { SkeletonRideStatus } from "./component";

export function RideStatus() {
  const { isRTL, isDark } = useValues();
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const [selected, setSelected] = useState(0);
  const rideStatusData = ridesStatusData();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current && !addressLoaded) {
      isMounted.current = true;
      setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => setSelected(item.id)}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor,
        },
        { borderColor: isDark ? appColors.darkBorder : appColors.border },
        item.id === selected ? { borderColor: appColors.primary } : null,
      ]}
    >
      <Text
        style={[
          commonStyles.mediumTextBlack12,
          item.id === selected ? { color: appColors.primary } : { color: appColors.regularText },
        ]}
      >
        {item.title}
      </Text>
    </Pressable>
  );

  if (!addressLoaded) {
    return <SkeletonRideStatus />;
  }

  return (
    <View>
      <View style={styles.mainView}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderItem}
          data={rideStatusData}
          inverted={isRTL}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selected === 0 && <ActiveRide />}
        {selected === 1 && <PendingRide />}
        {selected === 2 && <ScheduleRide />}
        {selected === 3 && <CompletedRide />}
        {selected === 4 && <CancelRide />}
      </ScrollView>
    </View>
  );
}
