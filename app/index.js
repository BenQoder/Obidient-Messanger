import { Button, Divider, Layout, Text, useTheme } from "@ui-kitten/components";
import { Image, Platform, ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import Spacer from "../components/spacer";
import Modal from "react-native-modal";
import Whatsapp from "../components/WhatsAppIcon";
import MessageDots from "../components/MessageDotsIcon";

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

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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

        <View style={{ paddingHorizontal: 15, marginTop: 30, flex: 1 }}>
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
              other Nigerians to vote Labour party.
            </Text>
          </View>

          <Divider style={{}} />

          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              {!contact && (
                <>
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
                    <Text appearance="alternative" category="s1">
                      When you click "Get Contact" Button, you will be randomly
                      assigned a contact from the database, you can then send
                      them a campaign message via WhatsApp or SMS.
                    </Text>
                    <Spacer height={10} />
                    <Text style={{ color: "#fff" }} category="s1">
                      The idea is to reach out to as many Nigerians as possible,
                      free via WhatsApp or without conventional SMS Gateways,
                      and to remind them to vote Labour Party and Join the
                      Obidents Movement.
                    </Text>
                  </View>
                  <Button onPress={getRandomContact}>Get Contact</Button>
                </>
              )}

              <Spacer height={30} />

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
                  By clicking the button below, you will be uploading 50 phone
                  numbers from your phone to the database, The contact will be
                  randomly assigned to participants of the campaign.
                </Text>
                <Spacer height={10} />
                <Text style={{ color: "#fff" }} category="s1">
                  Note: This App will not upload your contact names or any other
                  information, only phone numbers.{`\n`}To avoid numbers from
                  being assigned to multiple participants, we will mark the
                  numbers as used after they have been assigned and all contacts
                  will be deleted after the election.
                </Text>
              </View>

              {Platform.OS != "web" && (
                <>
                  <Button onPress={uploadContacts}>Upload Contacts</Button>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <Modal
        hasBackdrop
        style={{
          margin: 0,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
        visible={!!contact}
        onBackdropPress={() => setContact(null)}
        onBackButtonPress={() => setContact(null)}
      >
        <ContactsModal contact={contact} />
      </Modal>
    </Layout>
  );
}

const ContactsModal = ({ contact }) => {
  const shareToSMS = async () => {
    await Linking.openURL(
      `sms:${contact.number}${Platform.select({
        default: "?body=",
        ios: "&body=",
      })}Here is the Peter Obi, message`
    );
  };

  const shareToWhatsApp = async () => {
    await Linking.openURL(
      `whatsapp://send?phone=${contact.number}&text=Here is the Peter Obi, message`
    );
  };

  if (!contact) {
    return <View />;
  }

  return (
    <Layout
      style={{
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        minHeight: 300,
        padding: 15,
      }}
    >
      <SafeAreaView edges={["bottom"]}>
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
            <Button onPress={shareToWhatsApp} status="success">
              Share Whatsapp
            </Button>
          </View>

          <View style={{ width: "48%" }}>
            <Button
              // accessoryLeft={<MessageDots color="orange" />}
              onPress={shareToSMS}
              appearance="outline"
              status="success"
            >
              Share SMS
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};
