import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Connexion from "../screens/Connexion";

// Screen stack for home tab
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Connexion" component={Connexion} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
