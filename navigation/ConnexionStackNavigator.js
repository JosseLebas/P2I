import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Connexion from "../screens/Connexion";

// Screen stack for settings tab
const ConnexionStack = createNativeStackNavigator();

//tabBarVisible false n'enlève pas la barre de navigation dans la page de connexion, je ne sais pas comment faire
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
