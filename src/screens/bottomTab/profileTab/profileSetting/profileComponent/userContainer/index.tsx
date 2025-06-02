import React, { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { walletData } from "@src/api/store/actions/walletActions";
import { getValue } from "@src/utils/localstorage";
import { appColors, fontSizes } from "@src/themes";
import { commonStyles } from "../../../../../../styles/commonStyle";
import { external } from "../../../../../../styles/externalStyle";
import { styles } from "./style";
import { useValues } from "../../../../../../../App";
import { UserContainerSkeleton } from "./userSkeleton";

export function UserContainer() {
  const { bgFullStyle, textColorStyle, viewRTLStyle } = useValues();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { self } = useSelector((state) => state.account);
  const { walletTypedata } = useSelector((state) => state.wallet);
  const char = self?.name ? self.name.charAt(0) : "";
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { translateData } = useSelector((state: any) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(walletData());
      const value = await getValue("token");
      setToken(value);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);


  return (
    <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
      {loading ? (
        <UserContainerSkeleton />
      ) : (
        <>
          <View style={[external.fd_row, external.ai_center, { flexDirection: viewRTLStyle }]}>
            {self?.profile_image?.original_url ? (
              <Image
                style={styles.userImage}
                source={self?.profile_image?.original_url}
              />
            ) : (
              <View style={styles.nameTag}>
                <Text style={[styles.char, { color: appColors.whiteColor }]}>
                  {char || translateData?.g}
                </Text>
              </View>
            )}
            {self?.name ? (
              <View style={styles.userView}>
                <Text style={[commonStyles.mediumTextBlack, { color: textColorStyle }]}>
                  {self?.name}
                </Text>
                <Text style={[commonStyles.regularText, external.mt_3]}>
                  {self?.email}
                </Text>
              </View>
            ) : (
              <Text style={[commonStyles.mediumTextBlack, { color: textColorStyle }]}>
                {translateData?.guest ? translateData?.guest : ""}
              </Text>
            )}
          </View>
          {token && (
            <TouchableOpacity
              style={[styles.walletContainer, { flexDirection: viewRTLStyle }]}
              onPress={() => navigate("Wallet")}
              activeOpacity={0.7}
            >
              <Text style={styles.walletBalance}>{translateData?.balance ? translateData?.balance : 'My wallet balance'}</Text>
              <Text
                style={[
                  commonStyles.mediumTextBlack,
                  { color: appColors.whiteColor, fontSize: fontSizes.FONT20 },
                ]}
              >
                {zoneValue?.currency_symbol ? zoneValue?.currency_symbol : '₹'}
                {(zoneValue?.exchange_rate ?? 0) * (walletTypedata?.balance ?? 0)}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );


}
