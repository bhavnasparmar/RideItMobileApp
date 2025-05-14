import { StyleSheet } from 'react-native';
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from '@src/themes';
import { external } from '../../../../styles/externalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: windowHeight(13),
  },
  headerContainer: {
    backgroundColor: appColors.whiteColor,
    height: '15%',
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: windowHeight(19),
  },
  profileImageWrapper: {
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(74),
    borderColor: appColors.whiteColor,
  },
  profileImage: {
    width: windowHeight(73),
    height: windowHeight(73),
    borderRadius: windowHeight(50),
  },
  editIconContainer: {
    width: windowHeight(26.5),
    height: windowHeight(26.5),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(24),
    position: 'absolute',
    alignSelf: 'flex-end',
    flexGrow: 1,
    top: '68%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginHorizontal: windowHeight(14),
    height:windowHeight(100),
    bottom:windowHeight(7),
    flex:1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: windowHeight(17),
    marginBottom: windowHeight(28),
  },
  containerStyle: {
    ...external.mh_20,
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: windowHeight(0),
    width: '90%',
    paddingBottom: windowHeight(16),
  },
  char: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT25,
    backgroundColor: appColors.primary,
    width: windowHeight(75),
    height: windowHeight(74),
    borderRadius: windowHeight(74),
    textAlign: 'center',
    paddingVertical: windowHeight(25),
  },
  countryCode: {
    justifyContent: "space-between",
    width: windowWidth(55),
  },
  dialCode: {
    color: appColors.regularText,
    fontFamily: appFonts.regular
  },
  countryCodeContainer: {
    width: windowWidth(100),
    height: windowHeight(39),
    borderRadius: windowHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  phoneNumberInput: {
    width: windowWidth(326),
    height: windowHeight(39),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(4),
    marginHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    flexDirection: 'row',
  },
  iconContainer: {
    height: windowHeight(39),
    width: windowWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: windowHeight(4),
    marginHorizontal: windowWidth(5)
  },
  touchbleView: {
    position: "absolute",
    top: windowHeight(0),
    left:windowHeight(0),
    right: windowHeight(0),
    bottom: windowHeight(0),
  },
  countryMainView:{ marginTop: windowHeight(14.9) },
});
