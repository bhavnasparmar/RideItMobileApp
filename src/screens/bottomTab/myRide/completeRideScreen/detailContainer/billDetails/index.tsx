import { Text, View } from 'react-native';
import React from 'react';
import { SolidLine, DetailContainer } from '@src/commonComponent';
import { external } from '../../../../../../styles/externalStyle';
import { styles } from './styles';
import { useValues } from '../../../../../../../App';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { appColors } from '@src/themes';
import { BillDetailsInterface } from '@src/api/interface/rideRequestInterface';
import { useSelector } from 'react-redux';

interface BillDetailsProps {
  billDetail: BillDetailsInterface;
}

export function BillDetails({ billDetail }: BillDetailsProps) {

  const { textColorStyle, textRTLStyle, viewRTLStyle, isDark } = useValues();
  const { translateData } = useSelector((state) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);

  return (
    <View>
      <View style={styles.viewHeder}>
        <Text style={[styles.billSummary, { color: textColorStyle, textAlign: textRTLStyle }]}>
          {translateData?.billSummary}
        </Text>
        <SolidLine color={isDark ? appColors.darkBorder : appColors.border} />
        <View style={[external.mt_10]}>
          <DetailContainer value={[zoneValue.currency_symbol, zoneValue?.exchange_rate * billDetail.ride_fare]} title={translateData?.rideFare} />
        </View>
        <View style={[external.mv_10]}>
          <DetailContainer value={[zoneValue.currency_symbol, zoneValue?.exchange_rate * billDetail.tax]} title={translateData?.billDetailsTax} />
        </View>
        <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
          <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData?.platformFees}</Text>
          <Text style={[commonStyles.regularText, { color: appColors.alertRed, textAlign: textRTLStyle }]}>
            {[zoneValue.currency_symbol, zoneValue?.exchange_rate * billDetail.platform_fees]}
          </Text>
        </View>
      </View>
      <View style={[styles.container, { borderColor: isDark ? appColors.darkBorder : appColors.primaryGray }]} />
      <View style={styles.detailContainerText}>
        <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
          <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData?.totalBill}</Text>
          <Text style={[commonStyles.regularText, { color: appColors.price, textAlign: textRTLStyle }]}>
            {[zoneValue.currency_symbol, zoneValue?.exchange_rate * billDetail.total]}
          </Text>
        </View>
      </View>
    </View>
  );
};
