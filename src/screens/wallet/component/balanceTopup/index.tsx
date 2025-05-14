import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Images from '@utils/images';
import styles from './styles';
import { useValues } from '../../../../../App'
import { useAppNavigation } from '@src/utils/navigation';
import { useSelector } from 'react-redux';

interface BalanceTopupProps {
    balance: number | any;
}

export function BalanceTopup({ balance }: BalanceTopupProps) {
    const { navigate } = useAppNavigation();
    const { viewRTLStyle } = useValues()
    const { translateData } = useSelector((state: any) => state.setting);
    const { zoneValue } = useSelector((state: any) => state.zone);


    const gotoTopUp = () => {
        navigate('TopUpWallet')
    }

    return (
        <View>
            <View style={styles.mainBalance}>
                <Image source={Images.walletBg} style={styles.walletImage} />
                <View style={[styles.subBalance, { flexDirection: viewRTLStyle }]}>
                    <View style={styles.balanceView}>
                        <Text style={styles.balanceTitle}>{translateData.totalBalance}</Text>
                        <Text style={styles.totalBalance}>{zoneValue.currency_symbol}{(zoneValue?.exchange_rate ?? 0) * (balance ?? 0)}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={gotoTopUp} style={styles.topupBtn}>
                        <Text style={styles.topupTitle}>{translateData.topupWallet}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.dashLine} />
        </View>
    )
}