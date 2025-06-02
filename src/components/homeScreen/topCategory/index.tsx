import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import { TitleRenderItem } from "./titleRenderItem/index";
import { appColors, appFonts } from "@src/themes";
import { Location, Search } from "@src/utils/icons";
import { useValues } from "@App";
import { useAppNavigation } from "@src/utils/navigation";
import Images from "@src/utils/images";
import { useSelector } from "react-redux";
import { getValue } from "@src/utils/localstorage";

export function TopCategory({ categoryData }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const { bgFullStyle, isDark, viewRTLStyle, textRTLStyle } = useValues()
  const { navigate } = useAppNavigation();
  const isScrollable = categoryData?.length > 4;
  const { translateData } = useSelector((state) => state.setting);
  const [recentDatas, setRecentDatas] = useState<string[]>([]);


  const locationData = [
    { id: '1', label: 'New youk city', isTop: true },
    { id: '2', label: 'Adajan, Gujarat', isTop: false },
  ];

  useEffect(() => {
    if (categoryData?.length > 0) {
      setSelectedSubcategory(categoryData[0]);
    }
  }, [categoryData]);

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

  const handlePress = () => {
    const item = selectedSubcategory;
    if (!item) return;
    if (item.slug === 'intercity' || item.slug === 'ride' || item.slug === 'ride-freight' || item.slug === 'intercity-freight' || item.slug === 'intercity-parcel' || item.slug === 'ride-parcel' || item.slug === 'schedule-freight' || item.slug === 'schedule-parcel') {

      navigate('Ride', {
        service_ID: item.service_id,
        service_name: item.service_type,
        service_category_ID: item.id,
        service_category_slug: item.slug,
      });
    } else if (item.slug === 'package') {
      navigate('RentalLocation', {
        service_ID: item.service_id,
        service_name: item.service_type,
        service_category_ID: item.id,
        service_category_slug: item.slug,
      });
    } else if (item.slug === 'schedule') {
      navigate('Ride', {
        service_ID: item.service_id,
        service_name: item.service_type,
        service_category_ID: item.id,
        service_category_slug: item.slug,
      });
    } else if (item.slug === 'rental') {
      navigate('RentalBooking', {
        service_ID: item.service_id,
        service_name: item.service_type,
        service_category_ID: item.id,
        service_category_slug: item.slug,
      });
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.mainLine} />
        <FlatList
          data={categoryData}
          renderItem={({ item, index }) => (
            <TitleRenderItem
              item={item}
              index={index}
              selectedIndex={selectedIndex}
              onPress={() => {
                setSelectedIndex(index);
                setSelectedSubcategory(item);
              }}
              isScrollable={isScrollable}
              totalItems={categoryData.length}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name.toString()}
        />
      </View>
      {categoryData?.length > 0 && (
        <>
          {selectedSubcategory?.slug != 'rental' && selectedSubcategory?.slug != 'package' && (
            <TouchableOpacity onPress={handlePress}
              style={[styles.packageMainView, {
                backgroundColor: bgFullStyle,

                borderColor: isDark ? appColors.darkBorder : appColors.border,

              }]}
            >
              <View
                style={[styles.searchView, {
                  backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,

                  flexDirection: viewRTLStyle,

                }]}
              >
                <Search />
                <Text
                  style={[styles.whereNext, {

                    color: isDark ? appColors.whiteColor : appColors.primaryText
                  }]}
                >
                  {translateData?.whereNext}
                </Text>
              </View>
              <Text
                style={[styles.homeRecentSearch, {

                  textAlign: textRTLStyle
                }]}
              >{translateData?.homeRecentSearch}
              </Text>
              <FlatList
                data={recentDatas.slice(0, 2)}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={({ item, index }) => (
                  <>
                    <View style={[styles.centerLocation, { flexDirection: viewRTLStyle }]}>
                      <Location />
                      <Text
                        style={[
                          styles.adajanText,
                          { color: isDark ? appColors.whiteColor : appColors.primaryText }
                        ]}
                      >
                        {item.location}
                      </Text>
                    </View>

                    {index < recentDatas.slice(0, 2).length - 1 && item.location && (
                      <View
                        style={[
                          styles.locationLine,
                          { borderColor: isDark ? appColors.darkBorder : appColors.border }
                        ]}
                      />
                    )}
                  </>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, fontFamily: appFonts.regular }}>
                      No Address found
                    </Text>
                  </View>
                }
              />

            </TouchableOpacity>
          )}

          {selectedSubcategory?.slug === 'rental' && (

            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Image source={Images.rentalBanner} style={styles.rentalImage} />
            </TouchableOpacity>
          )}
          {selectedSubcategory?.slug === 'package' && (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Image source={Images.packagebanner} style={styles.rentalImage} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

