import { StyleSheet } from 'react-native';
import { commonStyles } from '../../styles/commonStyle';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    width: windowHeight(30),
    height: windowHeight(30),
    backgroundColor: appColors.whiteColor,
    borderColor: appColors.primaryGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(5),
    ...commonStyles.shadowContainer,
  },
  dateTimeView: {
    paddingHorizontal: windowHeight(12),
    paddingBottom: windowHeight(14.5),
  },
  locateOnMapView: {
    justifyContent: "space-between",
    marginBottom: windowWidth(5)
  },
  viewContainer: {
    backgroundColor: appColors.whiteColor,
    flex: 1,
    paddingTop: windowHeight(20),
  },
  horizontalView: {
    paddingHorizontal: windowHeight(14),
  },
  subtitleText: {
    ...commonStyles.regularText,
    fontWeight: '300',
    fontSize: fontSizes.FONT16,
    color: appColors.regularText,
  },
  titleText: {
    ...commonStyles.mediumText23,
    fontSize: fontSizes.FONT19,
  },  
  iconView: {
    width: windowHeight(27),
    height: windowHeight(27),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(27),
    marginHorizontal: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    ...commonStyles.shadowContainer,
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(6),
    marginVertical: windowHeight(17),
    borderWidth: windowHeight(1),
  },
  recentView: {
    backgroundColor: appColors.lightGray,
    paddingHorizontal: windowHeight(16),
    paddingTop: windowHeight(16),
  },
  viewStyle: {
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowHeight(8),
    elevation: 2,
    borderWidth: windowHeight(1),
    borderColor: appColors.lightGray,
  },
  chooseAnotherAccount: {
    ...commonStyles.mediumTextBlack12,
    ...external.mh_5,
    fontSize: fontSizes.FONT19,
    color: appColors.primary,
  },
  spaceing: {
    marginHorizontal: windowWidth(8)
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.modelBg,
  },
  modalContainer: {
    width: 300,
    padding: windowHeight(18),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(8.9),
    alignItems: 'center',
  },
  modalText: {
    marginBottom: windowHeight(18.5),
    textAlign: 'center',
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
  },
  pickBtn: {
    height: windowHeight(43),
    width: "49%",
    borderRadius: windowHeight(5.6),
    marginVertical: windowHeight(14),
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(5),
  },
  saveBtn: {
    height: windowHeight(43),
    backgroundColor: appColors.primary,
    width: "49%",
    borderRadius: windowHeight(5.6),
    marginVertical: windowHeight(14),
    alignItems: "center",
    justifyContent: "center",
  },
  addressBtn: {
    marginHorizontal: windowHeight(11),
    marginVertical: windowHeight(4.8),
    width:'100%'
  },
  addressView: {
    backgroundColor: appColors.lightGray,
    height: windowHeight(30),
    width: windowHeight(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(40),
  },
  noDataText: {
    height: windowHeight(45),
    textAlign: "center",
    fontSize: fontSizes.FONT19,
    top: windowHeight(15),
    fontFamily: appFonts.regular,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  historyBtn: {
    backgroundColor: appColors.lightGray,
    height: windowHeight(30),
    width: windowHeight(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(40),
  },
  locationText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(5),
  },
  locationText1: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(10),
    width:'79%',
    textAlign:'left',
  },
  bottomLine: {
    borderBottomWidth: windowHeight(0.9),
    borderBottomColor: appColors.lightGray,
    marginVertical:windowHeight(3)
  }

});
export { styles };
