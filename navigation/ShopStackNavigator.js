import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Shop from "../screens/Shop";

// Screen stack for settings tab
const ShopStack = createNativeStackNavigator();

const ShopStackNavigator = () => {
  return (
    <ShopStack.Navigator
      initialRouteName="Connexion"
      screenOptions={{ headerShown: false }}
    >
      <ShopStack.Screen name="Shop" component={Shop} />
    </ShopStack.Navigator>
  );
};

export default ShopStackNavigator;
