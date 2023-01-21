import { Button, Layout, Text } from "@ui-kitten/components";
import { Image, Platform, StyleSheet, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

export default function Page() {
  const anonKey = process.env.ANON_KEY;
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <Layout style={styles.container}>
      <SafeAreaView>
        <Image
          source={require("../assets/lp-logo-large.png")}
          style={{ width: 80, height: 80 }}
        />
        <Text category="h4">Hello </Text>
        <Text category="p1">This is the first page of your app.</Text>

        {Platform.OS != "web" && (
          <>
            <Button onPress={uploadContacts}>Upload Contacts</Button>
          </>
        )}

        {!contact ? (
          <>
            <Button onPress={getRandomContact}>Get Random Contact</Button>
          </>
        ) : (
          <>
            <Text>Contact: {contact.number}</Text>
            <Button onPress={shareToWhatsApp}>Share Whatsapp</Button>
            <Button onPress={shareToSMS}>Share SMS</Button>
          </>
        )}
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
