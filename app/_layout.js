import { View, Text } from "react-native";
import React from "react";
import * as eva from "@eva-design/eva";
import { Slot } from "expo-router";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
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
          <Slot />
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}
