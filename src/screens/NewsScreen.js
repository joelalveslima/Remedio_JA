import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import texts from "../localization";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
  TEXT_STYLES,
} from "../constants/theme";
import {
  getHealthNewsOrdered,
  getCategoryColor,
  formatNewsDate,
} from "../data/healthNews";

export default function NewsScreen({ navigation }) {
  const [expandedNewsId, setExpandedNewsId] = useState(null);

  // Obter todas as notícias (não apenas as 3 primeiras)
  const healthNewsData = getHealthNewsOrdered(10); // Mostra até 10 notícias

  const handleNewsPress = (newsId) => {
    setExpandedNewsId(expandedNewsId === newsId ? null : newsId);
  };

  const renderNewsItem = ({ item }) => {
    const isExpanded = expandedNewsId === item.id;

    return (
      <TouchableOpacity
        style={styles.newsCard}
        onPress={() => handleNewsPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.newsHeader}>
          <View style={styles.newsCategory}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.newsDate}>{formatNewsDate(item.date)}</Text>
        </View>

        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSummary}>
          {isExpanded ? item.fullText : item.summary}
        </Text>

        {!isExpanded && (
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>{texts.readMore}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
          </View>
        )}

        {isExpanded && (
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Recolher</Text>
            <Ionicons name="chevron-up" size={16} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.iconWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.healthNews}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>{texts.newsSubtitle}</Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={healthNewsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          contentContainerStyle={styles.newsListContainer}
          ItemSeparatorComponent={() => <View style={{ height: SPACING.md }} />}
        />
      </View>

      {/* Botões de navegação inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.iconWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color={COLORS.iconWhite} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.heavy,
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    flex: 1,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  subtitle: {
    ...TEXT_STYLES.descriptionText,
    marginBottom: SPACING.xl,
    textAlign: "center",
    fontSize: FONT_SIZES.base,
  },

  // Lista de notícias
  newsListContainer: {
    paddingBottom: SPACING.xl,
  },
  newsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: Platform.OS === "ios" ? 16 : 12,
    padding: SPACING.xl,
    ...SHADOWS.light,
    borderWidth: Platform.OS === "ios" ? 0 : 1,
    borderColor: COLORS.border,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  newsCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  categoryText: {
    ...TEXT_STYLES.captionText,
    fontSize: FONT_SIZES.sm,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: COLORS.textSecondary,
  },
  newsDate: {
    ...TEXT_STYLES.captionText,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  newsTitle: {
    ...TEXT_STYLES.cardTitle,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  newsSummary: {
    ...TEXT_STYLES.descriptionText,
    fontSize: FONT_SIZES.base,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  readMoreText: {
    ...TEXT_STYLES.captionText,
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },

  // Navegação inferior
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: Platform.OS === "ios" ? SPACING.md + 4 : SPACING.md + 2,
    paddingHorizontal: SPACING.xxxl + 8,
    paddingBottom: Platform.OS === "ios" ? SPACING.xl + 2 : SPACING.md + 2,
    justifyContent: "space-around",
    ...SHADOWS.medium,
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: Platform.OS === "ios" ? 12 : 10,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    minWidth: 48,
    minHeight: 48,
  },
});
