import { View, Text } from "react-native";
import React from "react";

export default function Spacer({ height = 0, width = 0 }) {
  return <View style={{ width, height }} />;
}
