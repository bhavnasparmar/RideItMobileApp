import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useValues } from "@App";
import styles from "./styles";

export function ProfileContainer() {
  const { viewRTLStyle } = useValues();
  const { self } = useSelector((state: any) => state.account);
  const { taxidoSettingData } = useSelector((state: any) => state.setting);

  const char = self?.name ? self.name.charAt(0) : "";
  const [greeting, setGreeting] = useState("Hello");
  const [welcom, setWelcome] = useState("Welcome Back");

  useEffect(() => {
    const greetingsMsg = ["Hi", "Hey", "Hello"];
    if (
      taxidoSettingData?.taxido_values?.general &&
      Array.isArray(taxidoSettingData.taxido_values.general.greetings)
    ) {
      const randomGreeting =
        greetingsMsg[Math.floor(Math.random() * greetingsMsg?.length)];
      const greetingsFromApi = taxidoSettingData.taxido_values.general.greetings;

      const goodMorningMsg = greetingsFromApi.find(
        (msg) => typeof msg === "string"
      );
      setGreeting(randomGreeting);
      setWelcome(goodMorningMsg);
    }
  }, [taxidoSettingData]);

  return (
    <View style={[styles.mainView, { flexDirection: viewRTLStyle }]}>
      <View style={styles.imageView}>
        {self?.profile_image?.original_url ? (
          <Image
            style={styles.imageStyle}
            source={self?.profile_image?.original_url }
          />
        ) : (
          <View style={styles.textView}>
            <Text style={styles.charText}>{char || "G"}</Text>
          </View>
        )}
      </View>
      <View style={styles.viewText}>
        <Text style={styles.text}>{welcom}</Text>
        <Text style={styles.selfName}>
          {greeting} {self?.name?.split(" ")[0] || "Guest"},
        </Text>
      </View>
    </View>
  );
}
