import { StyleSheet } from 'react-native';
import { windowHeight } from '@src/themes';
 

const styles = StyleSheet.create({
    driverMarker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker: {
        width: windowHeight(40),
        height: windowHeight(40),
        resizeMode: 'contain'
    }
});
export { styles };
