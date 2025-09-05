import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import NewsScreen from "./src/screens/NewsScreen";
import { COLORS } from "./src/constants/theme";

// Previne que a splash screen seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Hide splash screen when app loads
    SplashScreen.hideAsync();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={Platform.OS === "android"}
      />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={DetailScreen} />
        <Stack.Screen name="Noticias" component={NewsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
