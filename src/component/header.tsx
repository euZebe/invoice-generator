import React from "react";
import { Text } from "ink";
import Gradient from "ink-gradient";

const Header = () => (
  <>
    <Gradient name="rainbow">
      <Text>*************************</Text>
    </Gradient>
    <Text>*** Invoice generator ***</Text>
    <Gradient name="rainbow">
      <Text>*************************</Text>
    </Gradient>
  </>
);

export default Header;
