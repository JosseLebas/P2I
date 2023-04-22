import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Connexion from "../screens/Connexion";

// Screen stack for settings tab
const ConnexionStack = createNativeStackNavigator();

const ConnexionStackNavigator = () => {
  return (
    <ConnexionStack.Navigator
      initialRouteName="RootConnexion"
      screenOptions={{ headerShown: false, tabBarVisible: false }}
    >
      <ConnexionStack.Screen
        name="RootConnexion"
        component={Connexion}
        options={{ headerShown: false, tabBarVisible: false }}
      />
    </ConnexionStack.Navigator>
  );
};

export default ConnexionStackNavigator;
