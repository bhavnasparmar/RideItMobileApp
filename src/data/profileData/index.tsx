import React from "react";
import {
  AppPages,
  Chat,
  Location,
  ProfileSetting,
  PromoCode,
  Share,
} from "@utils/icons";
import { useSelector } from "react-redux";

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
  ];
};

export const useGuestData = () => {
  const { translateData } = useSelector((state: any) => state.setting);

  return [
    {
      title: translateData?.appDetails,
      data: [
        {
          icon: <AppPages />,
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
