import { Text, View } from 'react-native';
import React from 'react';
import { external } from '../../styles/externalStyle';
import { styles } from './styles';
import { Gps, PickLocation } from '@utils/icons';
import { useValues } from '../../../App';
import { appColors, windowHeight } from '@src/themes';

// export function LocationDetails({ locationDetails }) {
//   const { bgFullStyle, textColorStyle, iconColorStyle, viewRTLStyle, textRTLStyle, isDark } = useValues();

//   return (
//     <View
//       style={[
//         styles.addressContainer,
//         { flexDirection: viewRTLStyle },
//         { backgroundColor: bgFullStyle },
//       ]}>
//       <View style={[external.fd_column, external.mh_15, external.mt_8]}>
//         <PickLocation height={12} width={12} colors={iconColorStyle} />
//         <View style={styles.icon} />
//         <Gps height={12} width={12} colors={iconColorStyle} />
//       </View>
//       <View style={[external.pv_10, external.mh_5]}>
//         <Text
//           style={[
//             styles.itemStyle,
//             { color: textColorStyle },
//             { textAlign: textRTLStyle },
//           ]}>
//           {locationDetails[0]}
//         </Text>
//         <View style={[styles.dashedLine, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
//         <View style={{ paddingHorizontal: windowHeight(2.5), right: windowHeight(1.8) }}>
//           <Text style={[styles.pickUpLocationStyles, { color: textColorStyle }]}>
//             {locationDetails[1]}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };




export function LocationDetails({ locationDetails }) {
  const {
    bgFullStyle,
    textColorStyle,
    iconColorStyle,
    viewRTLStyle,
    textRTLStyle,
    isDark
  } = useValues();

  return (
    <View
      style={[
        styles.addressContainer,
        { flexDirection: viewRTLStyle },
        { backgroundColor: bgFullStyle },
      ]}
    >
      <View style={[external.fd_column, external.mh_15, external.mt_8]}>
        <PickLocation height={12} width={12} colors={iconColorStyle} />
        {locationDetails[1] && (
          <>
            <View style={styles.icon} />
            <Gps height={12} width={12} colors={iconColorStyle} />
          </>
        )}
      </View>

      <View style={[external.pv_10, external.mh_5]}>
        <Text
          style={[
            styles.itemStyle,
            { color: textColorStyle, textAlign: textRTLStyle },
          ]}
        >
          {locationDetails[0]}
        </Text>

        {locationDetails[1] && (
          <>
            <View
              style={[
                styles.dashedLine,
                { borderColor: isDark ? appColors.darkBorder : appColors.border },
              ]}
            />
            <View style={{ paddingHorizontal: windowHeight(2.5), right: windowHeight(1.8) }}>
              <Text style={[styles.pickUpLocationStyles, { color: textColorStyle }]}>
                {locationDetails[1]}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
