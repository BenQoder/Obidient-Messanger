import { View, Text, Dimensions } from "react-native";
import React from "react";
import * as eva from "@eva-design/eva";
import { Slot } from "expo-router";

import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ApplicationProvider,
  IconRegistry,
  Layout,
} from "@ui-kitten/components";
import * as theme from "../assets/theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function AppLayout() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...theme }}
        // customMapping={mapping}
      >
        <SafeAreaProvider>
          <Layout style={{ flex: 1, backgroundColor: "rgba(255,0,0,0.4)" }}>
            <Layout
              style={{
                maxWidth: 550,
                marginLeft: "auto",
                marginRight: "auto",
                height: Dimensions.get("window").height,
              }}
            >
              <Slot />
            </Layout>
          </Layout>
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}
