import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { BalanceTopup, List } from "./component/index";
import { Header } from "@src/commonComponent";
import { useValues } from "../../../App";
import { appColors } from "@src/themes";
import { useDispatch, useSelector } from "react-redux";
import { walletData } from "../../api/store/actions/walletActions";
import Images from "@src/utils/images";
import { NoInternet } from "@src/components";
import styles from "./styles";
import { SkeltonAppPage } from "../bottomTab/profileTab/appPageScreen/component";
import { useTheme } from "@react-navigation/native";
import { paymentsData } from "@src/api/store/actions";

export function Wallet() {
  const dispatch = useDispatch();
  const { textColorStyle, isDark, bgFullLayout } = useValues();
  const { walletTypedata, statusCode } = useSelector(
    (state: any) => state.wallet
  );
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const { translateData } = useSelector((state: any) => state.setting);

  useEffect(() => {
    refresh();
  }, [dispatch]);

  const refresh = async () => {
    setLoading(true);
    setLoading(false);
  };

    useEffect(() => {
      dispatch(paymentsData());
    }, []);
    

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: isDark ? appColors.primaryText : appColors.lightGray,
        },
      ]}
    >
      <Header value={translateData.myWallet} />
      <BalanceTopup balance={walletTypedata?.balance || 0} />
      <Text style={[styles.title, { color: textColorStyle }]}>
        {translateData.history}
      </Text>

      {loading ? (
        <View
          style={[
            styles.dataView,
            { backgroundColor: bgFullLayout, borderColor: colors.border },
          ]}
        >
          <View style={styles.skeltonAppPage}>
            <SkeltonAppPage />
          </View>
        </View>
      ) : walletTypedata?.histories?.data?.length > 0 ? (
        <List dataList={walletTypedata.histories.data} />
      ) : (
        <View style={styles.noInternet}>
          <NoInternet
            btnHide
            title={translateData.noBalance}
            details={translateData.noBalanceDes}
            image={isDark ? Images.noBalanceDark : Images.noBalance}
            infoIcon
            status={`${translateData.statusCode} ${statusCode}`}
            onRefresh={refresh}
          />
        </View>
      )}
    </View>
  );
}
