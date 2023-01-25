import {
  Button,
  Divider,
  Layout,
  Spinner,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { Image, Platform, ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import Spacer from "../components/spacer";
import Modal from "react-native-modal";
import parsePhoneNumber from "libphonenumber-js";

export default function Page() {
  const anonKey = process.env.ANON_KEY;
  const [contact, setContact] = useState(null);
  const [canShowModal, setCanShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  const uploadContacts = useCallback(async () => {
    if (isLoading) {
      return;
    }
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      if (isLoading) {
        return;
      }
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
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const response = await fetch(
      "https://pnptmikyqnpyxktceelg.functions.supabase.co/get-contact",
      {
        headers: {
          Authorization: "Bearer " + anonKey,
        },
      }
    );

    setIsLoading(false);

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

          {isLoading && <Spinner size="small" status="primary" />}
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

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            <View
              style={{
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              {canShowModal ? (
                <>
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
                          When you click "Get Contact" Button, you will be
                          randomly assigned a contact from the database, you can
                          then send them a campaign message via WhatsApp or SMS.
                        </Text>
                        <Spacer height={10} />
                        <Text style={{ color: "#fff" }} category="s1">
                          The idea is to reach out to as many Nigerians as
                          possible, free via WhatsApp or without conventional
                          SMS Gateways, and to remind them to vote Labour Party
                          and Join the Obidents Movement.
                        </Text>
                      </View>
                      <Button onPress={getRandomContact} disabled={isLoading}>
                        Get Contact
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
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
                          To avoid spamming, Please come back later to get
                          another contact.
                        </Text>
                      </View>
                    </>
                  )}
                </>
              )}

              <Spacer height={30} />

              {Platform.OS != "web" && (
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
                    <Text style={{ color: "#fff" }} category="s1">
                      By clicking the button below, you will be uploading 50
                      phone numbers from your phone to the database, The contact
                      will be randomly assigned to participants of the campaign.
                    </Text>
                    <Spacer height={10} />
                    <Text style={{ color: "#fff" }} category="s1">
                      Note: This App will not upload your contact names or any
                      other information, only phone numbers.{`\n`}To avoid
                      numbers from being assigned to multiple participants, we
                      will mark the numbers as used after they have been
                      assigned and all contacts will be deleted after the
                      election.
                    </Text>
                  </View>

                  <Button onPress={uploadContacts} disabled={isLoading}>
                    Upload Contacts
                  </Button>
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
        onBackdropPress={() => {
          setCanShowModal(false);
          setContact(null);
        }}
        onBackButtonPress={() => {
          setCanShowModal(false);
          setContact(null);
        }}
      >
        <ContactsModal contact={contact} />
      </Modal>
    </Layout>
  );
}

const messages = [
  `Under APC and PDP leadership, schools have been closing irregularly, homelessness is on the rise and cost of living have skyrocketed, businesses are closing and we still do not have constant power supply. It's time for a change.
 
Vote and Support Labour party (LP) and the Obi-Datti Movement, let's give nigeria another chance.`,
  "Join the movement for real change. Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. Together, they have a clear and actionable plan to address the issues that matter most to us. Together, we can create a better future for all.",
  "Don't miss out on the opportunity to elect a leader who truly cares about our future. Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. Together they have the experience, the vision, and the courage to bring about the change we need.",
  "Tired of the same old political rhetoric? Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. They offers a new way of doing politics, based on transparency, accountability, and collaboration. With them as our leaders, we will be able to tackle the challenges of our time and build a brighter future.",
  "Want a representative who will truly listen to your concerns? Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. They are committed to listening to the needs and aspirations of our community and working tirelessly to make them a reality. With them by our side, we will be able to achieve the common good and create a more just and equitable society.",
  "Let's work together to create a better future for all. Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. They are candidates for all of us, who will work to create jobs, improve education, protect the environment, and promote social justice. With them as our leaders, we will be able to achieve our aspirations and make our community a better place to live.",
  "Don't just sit on the sidelines, be a part of the solution. Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President and make a difference. By casting your vote for them, you will be supporting candidates who are dedicated to serving the public interest and working to create a more inclusive and equitable society. With them as our leaders, we can achieve real change and make a positive impact in our community.",
  "Looking for candidates who will fight for the common good? Vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. They understand the issues and concerns facing our community, and have a clear and actionable plan to address them. With them by our side, we will be able to make a real difference and build a brighter future for all.",
  "Time for a change, vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President. They are candidates who are committed to bringing about real change and making a positive impact in our community. With them as our leaders, we will be able to address the issues that matter most to us and create a more inclusive and equitable society. Don't miss this opportunity to make a difference and vote for Peter Obi of Labor Party (LP) for President and Datti Baba-Ahmed as Vice President.",
];

const ContactsModal = ({ contact }) => {
  const [randomIndex, setRandomIndex] = useState(() =>
    Math.floor(Math.random() * messages.length)
  );

  const shareToSMS = async () => {
    await Linking.openURL(
      `sms:${contact.number}${Platform.select({
        default: "?",
        ios: "&",
      })}body=${encodeURIComponent(message)}`
    );
  };

  const message = useMemo(() => {
    return messages[randomIndex];
  }, [randomIndex]);

  const shareToWhatsApp = async () => {
    const number = parsePhoneNumber(contact.number, "NG");
    if (number.isValid()) {
      await Linking.openURL(
        `whatsapp://send?phone=${number.number}&text=${message}`
      );
    }
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
        <Text category="s1">Contact: {contact.number}</Text>
        <Spacer height={5} />
        <Text category="s1">Campaign Message: </Text>
        <Text category="s1">{message}</Text>
        <Spacer height={10} />
        <Button onPress={() => setRandomIndex(Math.floor(Math.random() * 9))}>
          Change Message
        </Button>

        <Spacer height={30} />

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

        <Spacer height={20} />
      </SafeAreaView>
    </Layout>
  );
};
