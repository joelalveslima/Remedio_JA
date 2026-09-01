import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Easing } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import NewsScreen from "./src/screens/NewsScreen";
import HealthUnitsScreen from "./src/screens/HealthUnitsScreen";
import { COLORS } from "./src/constants/theme";

// Previne que a splash screen seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

// Configuração personalizada de transição
const customTransition = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
  cardStyleInterpolator:
    Platform.OS === "android"
      ? CardStyleInterpolators.forFadeFromBottomAndroid
      : CardStyleInterpolators.forHorizontalIOS,
};

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
          ...customTransition,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            ...customTransition,
          }}
        />
        <Stack.Screen
          name="Detalhes"
          component={DetailScreen}
          options={{
            ...customTransition,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Noticias"
          component={NewsScreen}
          options={{
            ...customTransition,
          }}
        />
        <Stack.Screen
          name="Postos"
          component={HealthUnitsScreen}
          options={{
            ...customTransition,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
