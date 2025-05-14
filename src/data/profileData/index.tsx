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
      title: translateData.general,
      data: [
        {
          icon: <ProfileSetting />,
          title: translateData.profileSettings,
          screenName: "EditProfile",
        },
        {
          icon: <Location />,
          title: translateData.savedLocation,
          screenName: "SavedLocation",
        },
        {
          icon: <PromoCode />,
          title: translateData.promoCodeList,
          screenName: "PromoCodeScreen",
        },
      ],
    },
    {
      title: translateData.appDetails,
      data: [
        {
          icon: <AppPages />,
          title: translateData.appPages,
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData.shareApp,
          screenName: "Share",
        },
        {
          icon: <Chat />,
          title: translateData.chatSupport,
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
      title: translateData.appDetails,
      data: [
        {
          icon: <AppPages />,
          title: translateData.appPages,
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData.shareApp,
          screenName: "Share",
        },
      ],
    },
  ];
};
