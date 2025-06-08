import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import { RootStackParamList } from "./types";
import { MyTabs } from "./myTab/index";

import {
  Splash,
  Onboarding,
  OtpVerification,
  SignUp,
  Notifications,
  HomeScreen,
  DateTimeSchedule,
  EditProfile,
  PromoCodeScreen,
  SavedLocation,
  AppPageScreen,
  CompleteRide,
  CancelRideScreen,
  PendingRideScreen,
  FindingDriver,
  Outstation,
  LocationDrop,
  ChooseRiderScreen,
  AddNewRider,
  BookRide,
  OnTheWayDetails,
  DriverInfos,
  ChatScreen,
  RideActive,
  Payment,
  Wallet,
  PaymentMethod,
  ActiveRideScreen,
  ScheduleRideScreen,
  LocationSelect,
  AddLocation,
  Calander,
  DriverDetails,
  TopUpWallet,
  HomeService,
  PaymentWebView,
  DetailContainer,
  RentalLocation,
  RentalLocationSearch,
  PaymentRental,
  PromoCodeDetail,
  RentalBooking,
  RentalVehicleSelect,
  CreateTicket,
  SupportTicket,
  TicketDetails,
  RentalCarDetails,
  AmbulancePayment,
  NoService,
  AmbulanceSearch,
  BookAmbulance,
} from "@src/screens";

import { NoInternet } from "@src/components";
import { SignIn } from "../screens/auth/signIn/index";
import { LocationSave } from "@src/screens/bottomTab/profileTab/savedLocation/component/locationSave";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyStack: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {!isConnected ? (
          <Stack.Screen name="NoInternet" component={NoInternet} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="MyTabs" component={MyTabs} />
            <Stack.Screen name="PromoCodeScreen" component={PromoCodeScreen} />
            <Stack.Screen name="SavedLocation" component={SavedLocation} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="AppPageScreen" component={AppPageScreen} />
            <Stack.Screen name="CompleteRide" component={CompleteRide} />
            <Stack.Screen name="LocationSelect" component={LocationSelect} />
            <Stack.Screen name="ActiveRideScreen" component={ActiveRideScreen} />
            <Stack.Screen name="CancelRideScreen" component={CancelRideScreen} />
            <Stack.Screen name="PendingRideScreen" component={PendingRideScreen} />
            <Stack.Screen name="ScheduleRideScreen" component={ScheduleRideScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="DateTimeSchedule" component={DateTimeSchedule} />
            <Stack.Screen name="Rental" component={DetailContainer} />
            <Stack.Screen name="DriverDetails" component={DriverDetails} />
            <Stack.Screen name="FindingDriver" component={FindingDriver} />
            <Stack.Screen name="Outstation" component={Outstation} />
            <Stack.Screen name="Ride" component={LocationDrop} />
            <Stack.Screen name="ChooseRiderScreen" component={ChooseRiderScreen} />
            <Stack.Screen name="AddNewRider" component={AddNewRider} />
            <Stack.Screen name="BookRide" component={BookRide} />
            <Stack.Screen name="OnTheWayDetails" component={OnTheWayDetails} />
            <Stack.Screen name="DriverInfos" component={DriverInfos} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="RideActive" component={RideActive} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="PaymentRental" component={PaymentRental} />
            <Stack.Screen name="Calander" component={Calander} />
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="PromoCodeDetail" component={PromoCodeDetail} />
            <Stack.Screen name="AddLocation" component={AddLocation} />
            <Stack.Screen name="TopUpWallet" component={TopUpWallet} />
            <Stack.Screen name="HomeService" component={HomeService} />
            <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
            <Stack.Screen name="RentalLocation" component={RentalLocation} />
            <Stack.Screen name="RentalLocationSearch" component={RentalLocationSearch} />
            <Stack.Screen name="LocationSave" component={LocationSave} />
            <Stack.Screen name="RentalBooking" component={RentalBooking} />
            <Stack.Screen name="RentalVehicleSelect" component={RentalVehicleSelect} />
            <Stack.Screen name="CreateTicket" component={CreateTicket} />
            <Stack.Screen name="SupportTicket" component={SupportTicket} />
            <Stack.Screen name="TicketDetails" component={TicketDetails} />
            <Stack.Screen name="RentalCarDetails" component={RentalCarDetails} />
            <Stack.Screen name="AmbulanceSearch" component={AmbulanceSearch} />
            <Stack.Screen name="BookAmbulance" component={BookAmbulance} />
            <Stack.Screen name="AmbulancePayment" component={AmbulancePayment} />
            <Stack.Screen name="NoService" component={NoService} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
