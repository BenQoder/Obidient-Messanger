import React from "react";
import Svg, { Path } from "react-native-svg";

const Whatsapp = (props) => (
  <Svg width={24} height={24} {...props}>
    <Path
      d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"
      stroke="currentColor"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1"
      stroke="currentColor"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Whatsapp;
