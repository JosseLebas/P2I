import React from "react";
import { View, Text } from "react-native";
import { navbar } from "../theme/styles";

const Navbar = () => {
  return (
    <View style={navbar.container}>
      <Text style={navbar.text}>Accueil</Text>
      <Text style={navbar.text}>Collection</Text>
      <Text style={navbar.text}>Boutique</Text>
    </View>
  );
};

export default Navbar;
