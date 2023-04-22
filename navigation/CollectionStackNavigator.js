import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Collection from "../screens/Collection";

// Screen stack for settings tab
const CollectionStack = createNativeStackNavigator();

const CollectionStackNavigator = () => {
  return (
    <CollectionStack.Navigator
      initialRouteName="Connexion"
      screenOptions={{ headerShown: false }}
    >
      <CollectionStack.Screen name="RootCollection" component={Collection} />
    </CollectionStack.Navigator>
  );
};

export default CollectionStackNavigator;
