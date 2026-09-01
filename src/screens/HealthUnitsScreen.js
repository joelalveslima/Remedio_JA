import React from "react";
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, FONT_SIZES, SHADOWS, SPACING } from "../constants/theme";
import { unidades } from "../data/unidades";
import { getResponsiveConfig } from "../utils/safeAreaUtils";

export default function HealthUnitsScreen({ navigation }) {
  const safeAreaConfig = getResponsiveConfig();

  const openGps = (unit) => {
    const coordinates = `${unit.latitude},${unit.longitude}`;
    const url =
      Platform.OS === "android"
        ? `geo:${coordinates}?q=${coordinates}(${encodeURIComponent(unit.nome)})`
        : `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

    Linking.openURL(url);
  };

  const renderUnit = ({ item }) => (
    <View style={styles.unitCard}>
      <View style={styles.unitIcon}>
        <Ionicons name="business-outline" size={22} color={COLORS.primary} />
      </View>
      <View style={styles.unitContent}>
        <Text style={styles.unitName}>{item.nome}</Text>
        <Text style={styles.unitAddress}>Localização disponível no GPS</Text>
        <Text style={styles.unitSchedule}>
          {item.horario.semana.inicio} às {item.horario.semana.fim}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={() => openGps(item)}
        accessibilityLabel={`Abrir GPS para ${item.nome}`}
        accessibilityRole="button"
      >
        <Ionicons name="navigate-outline" size={22} color={COLORS.textWhite} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: safeAreaConfig.safeAreaTop }]}>
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={safeAreaConfig.isTranslucent}
      />
      <View
        style={[
          styles.header,
          {
            marginTop:
              Platform.OS === "android" ? -safeAreaConfig.safeAreaTop : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Postos de Saúde</Text>
          <Text style={styles.headerSubtitle}>Encontre a unidade mais conveniente</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id}
        renderItem={renderUnit}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listTitle}>{unidades.length} unidades disponíveis</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxxl,
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerContent: { alignItems: "center", flex: 1 },
  headerTitle: { color: COLORS.textWhite, fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl },
  headerSubtitle: { color: COLORS.textWhite, fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, marginTop: SPACING.xs, opacity: 0.85 },
  headerSpacer: { width: 40 },
  listContent: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  listTitle: { color: COLORS.textSecondary, fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, marginBottom: SPACING.md },
  unitCard: {
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.light,
  },
  unitIcon: { alignItems: "center", backgroundColor: COLORS.primaryLight, borderRadius: 20, height: 40, justifyContent: "center", marginRight: SPACING.md, width: 40 },
  unitContent: { flex: 1 },
  unitName: { color: COLORS.textPrimary, fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md },
  unitAddress: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, marginTop: 2 },
  unitSchedule: { color: COLORS.primaryDark, fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, marginTop: SPACING.xs },
  gpsButton: { alignItems: "center", backgroundColor: COLORS.primary, borderRadius: 20, height: 40, justifyContent: "center", marginLeft: SPACING.sm, width: 40 },
});