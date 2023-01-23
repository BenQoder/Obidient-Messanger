import Svg, { Path, Line } from "react-native-svg";
import React from "react";

const Message = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
    <Line x1="8" y1="9" x2="16" y2="9" />
    <Line x1="8" y1="13" x2="14" y2="13" />
  </Svg>
);

export default Message;
