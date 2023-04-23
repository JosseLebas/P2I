import React from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import CollectionStackNavigator from "./CollectionStackNavigator";
import ShopStackNavigator from "./ShopStackNavigator";

const Tab = createBottomTabNavigator();

const RootTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Icons will be different if the tab is focused
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Accueil") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Collection") {
              iconName = focused ? "cards" : "cards-outline";
            } else if (route.name === "Boutique") {
              iconName = focused ? "cart" : "cart-outline";
            }
            // You can return any component that you like here!
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#FEFEFE",
          tabBarInactiveTintColor: "#8D9AAE",
          tabBarStyle: {
            height: "8%",
            backgroundColor: "#2B2E42",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Accueil" component={HomeStackNavigator} />
        <Tab.Screen name="Collection" component={CollectionStackNavigator} />
        <Tab.Screen name="Boutique" component={ShopStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootTabNavigator;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B2E42",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    height: "8%",
    width: "100%",
  },
  text: {
    color: "#FEFEFE",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
