import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Pressable, Image } from "react-native";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { Back, Send, Mic, Emoji, More } from "@utils/icons";
import { appColors } from "@src/themes";
import { useValues } from "../../../App";
import { styles } from "./styles";
import EmojiPicker from "rn-emoji-keyboard";
import Voice from "@react-native-voice/voice";
import Images from "@utils/images";
import { useAppNavigation } from "@src/utils/navigation";
import "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import { useRoute, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

export function ChatScreen() {
  const { goBack } = useAppNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { driverId, riderId, rideId, driverName, driverImage } =
    route.params || {};

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(1);
  const { translateData } = useSelector((state) => state.setting);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    "https://cdn-icons-png.flaticon.com/512/219/219976.png"
  );

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const amPM = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${amPM}`;
  };

  const handlePick = (emoji: { emoji: string }): void => {
    if (emoji && emoji.emoji) {
      setMessage((prev) => prev + emoji.emoji);
    }
  };

  const onSpeechStart = () => {
    setStarted(true);
  };

  const onSpeechEnd = () => {
    setStarted(false);
  };

  const onSpeechResults = (e: any) => {
    if (e.value && e.value.length > 0) {
      setResults(e.value);
      setMessage((prev) => prev + " " + e.value[0]);
    }
  };

  const startRecognizing = async () => {
    setOpacity(0.7);
    try {
      await Voice.start("en-US");
      setResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    setOpacity(1);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const clearChat = () => {
    setMessages([]);
  };

  const ride_Id = `${rideId}`;
  const currentUserId = `${riderId}`;
  const chatWithUserId = `${driverId}`;

  const chatId = [ride_Id, currentUserId, chatWithUserId].sort().join("_");


  const messagesRef = firestore()
    .collection("rides")
    .doc(chatId)
    .collection("messages");

  useEffect(() => {
    const unsubscribeMessages = messagesRef
      .orderBy("timestamp", "asc")
      .onSnapshot(
        (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(fetchedMessages);
          setLoading(false);
        },
        (err) => {
          setError("Error fetching messages: " + err.message);
          setLoading(false);
        }
      );

    return () => {
      unsubscribeMessages();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (input.trim()) {
      try {
        await messagesRef.add({
          message: input,
          senderId: currentUserId,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setInput("");
      } catch (error) {
        setError("Failed to send message: " + error.message);
      }
    }
  };

  const {
    bgFullStyle,
    bgFullLayout,
    textColorStyle,
    viewRTLStyle,
    textRTLStyle,
    bgContainer,
    isDark,
    isRTL,
  } = useValues();
  return (
    <View style={[commonStyles.flexContainer]}>
      <View
        style={[
          styles.view_Main,
          { backgroundColor: bgFullStyle, flexDirection: viewRTLStyle },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.backButton,
            { borderColor: isDark ? appColors.darkBorder : appColors.border },
            { backgroundColor: isDark ? bgContainer : appColors.lightGray },
          ]}
          onPress={goBack}
        >
          <Back />
        </TouchableOpacity>
        <View style={[external.mh_10, external.fg_1]}>
          <Text
            style={[
              styles.templetionStyle,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}
          >
            {driverName}
          </Text>
          <Text
            style={[
              commonStyles.mediumTextBlack12,
              external.mt_2,
              { color: appColors.primary, textAlign: textRTLStyle },
            ]}
          >
            {translateData.online}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}

          style={[
            styles.backButton,
            { borderColor: isDark ? appColors.darkBorder : appColors.border },
            { backgroundColor: isDark ? bgContainer : appColors.lightGray },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <More />
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={0.7}

            style={[styles.modalContainer]}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          >
            <View style={[styles.modalSub]}>
              <TouchableOpacity
                activeOpacity={0.7}

                style={styles.modalTextView}
                onPress={() => {
                }}
              >
                <Text style={styles.modalText}>{translateData.callNow}</Text>
              </TouchableOpacity>
              <View
                style={[styles.modalBorder, { borderColor: colors.border }]}
              />
              <TouchableOpacity
                activeOpacity={0.7}

                style={styles.modalTextView}
                onPress={clearChat}
              >
                <Text style={styles.modalText}>{translateData.clearChat}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.listStyle}
        renderItem={({ item }) => {
          const timestamp = item.timestamp
            ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : "Sending...";

          return (
            <View
              style={[
                styles.mainView,
                {
                  flexDirection:
                    item.senderId === currentUserId ? "row-reverse" : "row",
                },
              ]}
            >
              {item.senderId !== currentUserId && (
                <Image
                  source={
                    driverImage ? { uri: driverImage } : Images.defultImage
                  }
                  style={[
                    styles.imageStyle,
                    {
                      borderColor: colors.border,
                    },
                  ]}
                />
              )}

              <View
                style={[
                  styles.messageContainer,
                  item.senderId === currentUserId
                    ? styles.senderMessage
                    : styles.receiverMessage,
                ]}
              >
                <Text
                  style={
                    ([
                      styles.messageText,
                      item.senderId !== currentUserId
                        ? styles.senderMessageText
                        : styles.receiverMessageText,
                    ],
                      { textAlign: isRTL ? "right" : "left" })
                  }
                >
                  {item.message}
                </Text>

                <Text
                  style={[
                    styles.messageText,
                    item.senderId !== currentUserId
                      ? styles.senderMessageTime
                      : styles.receiverMessageTime,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {timestamp}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: bgFullLayout },
          { flexDirection: viewRTLStyle },
        ]}
      >
        <View
          style={[
            styles.textInputView,
            {
              backgroundColor: bgFullStyle,
              flexDirection: viewRTLStyle,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsOpen(true)}>
            <Emoji />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              { textAlign: textRTLStyle },
              { color: textColorStyle },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder={translateData.typeHere}
            multiline
            placeholderTextColor={appColors.subtitle}
          />
          <Pressable
            style={[styles.mic, { opacity: opacity }]}
            onPressIn={startRecognizing}
            onPressOut={stopRecognizing}
          >
            <Mic />
          </Pressable>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.7}
          >
            <Send />
          </TouchableOpacity>
        </View>
      </View>
      {isOpen && (
        <View>
          <EmojiPicker
            onEmojiSelected={handlePick}
            open={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </View>
      )}
    </View>
  );
}
