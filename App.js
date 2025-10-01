import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Easing } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import NewsScreen from "./src/screens/NewsScreen";
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
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

// Transição para modal (para DetailScreen)
const modalTransition = {
  gestureEnabled: true,
  gestureDirection: "vertical",
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 350,
        easing: Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 300,
        easing: Easing.in(Easing.bezier(0.25, 0.46, 0.45, 0.94)),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
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
            ...modalTransition,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Noticias"
          component={NewsScreen}
          options={{
            ...customTransition,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
