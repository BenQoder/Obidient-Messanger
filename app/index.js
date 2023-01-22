import { Button, Divider, Layout, Text, useTheme } from "@ui-kitten/components";
import { Image, Platform, StyleSheet, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import Spacer from "../components/spacer";

export default function Page() {
  const anonKey = process.env.ANON_KEY;
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  const uploadContacts = useCallback(async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      setIsLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const randomContacts = data
          .sort(() => 0.5 - Math.random())
          .slice(0, 50)
          .reduce((prev, current) => {
            if (current.phoneNumbers) {
              current.phoneNumbers.forEach((phoneNumber) => {
                prev.push(phoneNumber.number);
              });
            }
            return prev;
          }, []);

        const response = await fetch(
          "https://pnptmikyqnpyxktceelg.functions.supabase.co/upload-contacts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + anonKey,
            },
            body: JSON.stringify({
              contacts: randomContacts,
            }),
          }
        );
      }

      setIsLoading(false);
    }
  }, []);

  const getRandomContact = async () => {
    setIsLoading(true);
    const response = await fetch(
      "https://pnptmikyqnpyxktceelg.functions.supabase.co/get-contact",
      {
        headers: {
          Authorization: "Bearer " + anonKey,
        },
      }
    );

    setIsLoading(true);

    if (response.status !== 200) {
      return;
    }

    const json = await response.json();

    setContact(json.data[0] ?? null);
  };

  const shareToSMS = async () => {
    await Linking.openURL(
      `sms:${contact.number}?=Here is the Peter Obi, message`
    );
  };

  const shareToWhatsApp = async () => {
    await Linking.openURL(
      `whatsapp://send?phone=${contact.number}&text=Here is the Peter Obi, message`
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <View
          style={{
            // justifyContent: "center",
            marginTop: 30,
            flexDirection: "row",
            // flex: 1,
            paddingHorizontal: 15,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/lp-logo-large.png")}
            style={{ width: 60, height: 60 }}
          />

          <Spacer width={5} />

          <View style={{ flex: 1 }}>
            <Text category="h6">Join the {`\n`}movement</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15, marginTop: 30 }}>
          <View
            style={{
              paddingBottom: 15,
            }}
          >
            <Text allowFontScaling={false} category="h6">
              Obi | Datti Messenger
            </Text>

            <Spacer height={2} />

            <Text allowFontScaling={false} category="s1">
              Obidents this is your new campaign messenger, mobilize and remind
              other obidients to vote Labour party.
            </Text>
          </View>

          <Divider style={{}} />

          <View
            style={{
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 15,
                backgroundColor: "#0f1218",
                borderRadius: 5,
                marginBottom: 10,
                borderWidth: 1,
                borderStyle: "dotted",
                borderColor: theme["color-primary-500"],
              }}
            >
              <Text style={{ color: "#fff" }} category="s1">
                Clicking on get random contact will select random contacts you
                can quickly message.
              </Text>
            </View>
            {!contact ? (
              <>
                <Button onPress={getRandomContact}>Get Random Contact</Button>
              </>
            ) : (
              <>
                <Text>Contact: {contact.number}</Text>
                <Spacer height={5} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ width: "48%" }}>
                    <Button onPress={shareToWhatsApp}>Share Whatsapp</Button>
                  </View>

                  <View style={{ width: "48%" }}>
                    <Button onPress={shareToSMS} appearance="outline">
                      Share SMS
                    </Button>
                  </View>
                </View>
              </>
            )}

            <Spacer height={10} />

            <View
              style={{
                padding: 15,
                backgroundColor: "#0f1218",
                borderRadius: 5,
                marginBottom: 10,
                borderWidth: 1,
                borderStyle: "dotted",
                borderColor: theme["color-primary-500"],
              }}
            >
              <Text style={{ color: "#fff" }} category="s1">
                Clicking on upload contact will randomly upload 50 contacts from
                your contact list.
              </Text>
            </View>

            {Platform.OS != "web" && (
              <>
                <Button onPress={uploadContacts}>Upload Contacts</Button>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 24,
//   },
// });
