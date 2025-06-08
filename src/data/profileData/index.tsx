import React from "react";
import {
  AppPages,
  Bank,
  Chat,
  DocumentSetting,
  Location,
  Office,
  ProfileSetting,
  PromoCode,
  Share,
  SideCar,
  VehicleSetting,
} from "@utils/icons";
import { useSelector } from "react-redux";
import Icons from '../../utils/icons/icons'
import { appColors } from "@src/themes";


export const useProfileData = () => {
  const { translateData } = useSelector((state: any) => state.setting);

  return [
    {
      title: translateData?.general ?  translateData?.general : "General",
      data: [
        {
          icon: <ProfileSetting />,
          title: translateData?.profileSettings ? translateData?.profileSettings : "Profile Setting",
          screenName: "EditProfile",
        },
        {
          icon: <Location />,
          title: translateData?.savedLocation ?  translateData?.savedLocation : "Save Location",
          screenName: "SavedLocation",
        },
        // {
        //   icon: <PromoCode />,
        //   title: translateData?.promoCodeList ? translateData?.promoCodeList : "",
        //   screenName: "PromoCodeScreen",
        // },
      ],
    },
    {
      title: translateData?.appDetails ? translateData?.appDetails : "AppDetails",
      data: [
        {
          icon: <AppPages />,
          title: translateData?.appPages ?  translateData?.appPages : "App Pages", 
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData?.shareApp ?  translateData?.shareApp : "Share",
          screenName: "Share",
        },
        {
          icon: <Chat />,
          title: translateData?.chatSupport ?  translateData?.chatSupport : "Chat Support",
          screenName: "SupportTicket",
        },
      ],
    },
     {
      title: translateData?.registrationDetails ? translateData?.registrationDetails : "Registration Details",
      data: [
        {
          icon: <Office colors={appColors.gray}/>,
          title: translateData?.documentRegistration || "Document Registration", 
          screenName: "DocumentDetail",
        },
        {
          icon: <SideCar />,
          title: translateData?.vehicleRegistration || "Vehicle Registration",
          screenName: "VehicleDetail",
        },
        {
          icon: <Bank />,
          title: translateData?.bankDetails || "Bank Details",
          screenName: "BankDetails",
        },
      ],
    },
  ];
};

export const useGuestData = () => {
  const { translateData } = useSelector((state: any) => state.setting);

  return [
    {
      title: translateData?.appDetails,
      data: [
        {
          icon:  <AppPages />,
          title: translateData?.appPages ?   translateData?.appPages : "App Page",
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData?.shareApp ?  translateData?.shareApp : "Share",
          screenName: "Share",
        },
      ],
    },
  ];
};
