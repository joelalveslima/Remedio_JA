import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  SHADOWS,
  TEXT_STYLES,
  ICON_SIZES,
} from "../constants/theme";
import {
  getHealthNewsOrdered,
  healthCampaigns,
  getCategoryColor,
  formatNewsDate,
} from "../data/healthNews";
import { getResponsiveConfig } from "../utils/safeAreaUtils";

const { width } = Dimensions.get("window");

export default function NewsScreen({ navigation }) {
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [expandedCampaignId, setExpandedCampaignId] = useState(null);
  const [activeTab, setActiveTab] = useState("news");
  const healthNewsData = getHealthNewsOrdered(10);
  const currentMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(new Date());
  const currentMonthLabel =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const currentCampaigns = healthCampaigns.filter(
    (campaign) => campaign.month.toLocaleLowerCase("pt-BR") === currentMonth
  );

  // Configuração responsiva para safe area
  const safeAreaConfig = getResponsiveConfig();

  const handleNewsPress = (newsId) => {
    setExpandedNewsId(expandedNewsId === newsId ? null : newsId);
  };

  const renderCampaignItem = (campaign) => {
    const isExpanded = expandedCampaignId === campaign.id;

    return (
    <TouchableOpacity
      key={campaign.id}
      style={styles.campaignCard}
      onPress={() =>
        setExpandedCampaignId(isExpanded ? null : campaign.id)
      }
      activeOpacity={0.8}
      accessibilityLabel={`${campaign.name}. ${
        isExpanded ? "Ocultar explicação" : "Mostrar explicação"
      }`}
    >
      <View style={[styles.campaignAccent, { backgroundColor: campaign.color }]} />
      <View style={styles.campaignContent}>
        <View style={styles.campaignHeader}>
          <View
            style={[
              styles.monthBadge,
              { backgroundColor: campaign.color },
            ]}
          >
            <Text style={[styles.monthText, { color: campaign.textColor }]}>
              {campaign.month}
            </Text>
          </View>
          <Ionicons name="ribbon" size={30} color={campaign.color} />
        </View>
        <Text style={styles.campaignName}>{campaign.name}</Text>
        <Text style={styles.campaignTheme}>{campaign.theme}</Text>
        {isExpanded && (
          <Text style={styles.campaignDescription}>{campaign.description}</Text>
        )}
        <View style={styles.campaignAction}>
          <Text style={styles.campaignActionText}>
            {isExpanded ? "Ocultar explicação" : "Sobre a campanha"}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  const renderNewsItem = ({ item, index }) => {
    const isExpanded = expandedNewsId === item.id;
    const categoryColor = getCategoryColor(item.category);

    return (
      <View
        style={[styles.newsCard, { marginTop: index === 0 ? 0 : SPACING.md }]}
      >
        {/* Header com categoria e data */}
        <View style={styles.newsHeader}>
          <View style={styles.headerLeft}>
            <View
              style={[styles.categoryBadge, { backgroundColor: categoryColor }]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            {/* Indicador de prioridade na mesma linha da categoria */}
            {item.priority === "high" && (
              <View style={styles.priorityIndicator}>
                <Ionicons name="alert-circle" size={12} color={COLORS.error} />
                <Text style={styles.priorityText}>Importante</Text>
              </View>
            )}
          </View>
          <Text style={styles.newsDate}>{formatNewsDate(item.date)}</Text>
        </View>

        {/* Título */}
        <Text style={styles.newsTitle}>{item.title}</Text>

        {/* Conteúdo */}
        <Text style={styles.newsSummary} numberOfLines={isExpanded ? 0 : 3}>
          {isExpanded ? item.fullText : item.summary}
        </Text>

        {/* Botão de expansão */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => handleNewsPress(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandButtonText}>
            {isExpanded ? "Ver menos" : "Ler mais"}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { paddingTop: safeAreaConfig.safeAreaTop }]}
    >
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={safeAreaConfig.isTranslucent}
      />

      {/* Header moderno */}
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
          style={styles.headerBackButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notícias</Text>
          <Text style={styles.headerSubtitle}>Saúde & Bem-estar</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "news" && styles.tabButtonActive]}
            onPress={() => setActiveTab("news")}
          >
            <Ionicons
              name="newspaper-outline"
              size={18}
              color={activeTab === "news" ? COLORS.textWhite : COLORS.primary}
            />
            <Text style={[styles.tabText, activeTab === "news" && styles.tabTextActive]}>
              Notícias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "campaigns" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("campaigns")}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={
                activeTab === "campaigns" ? COLORS.textWhite : COLORS.primary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "campaigns" && styles.tabTextActive,
              ]}
            >
              Campanhas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>
            {activeTab === "news"
              ? "Boletim de Saúde"
              : `Campanhas de ${currentMonthLabel}`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {activeTab === "news"
              ? "Campanhas, orientações e avisos importantes para você"
              : "Conheça a campanha de saúde deste mês"}
          </Text>
        </View>

        {activeTab === "news" ? (
          <View style={styles.newsContainer}>
            {healthNewsData.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderNewsItem({ item, index })}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={styles.campaignsContainer}>
            {currentCampaigns.map(renderCampaignItem)}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation moderno */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.textWhite} />
          <Text style={styles.navButtonText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color={COLORS.textWhite} />
          <Text style={styles.navButtonText}>Início</Text>
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

  // Header moderno
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    ...SHADOWS.heavy,
    elevation: 12,
    marginBottom: SPACING.lg,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: SPACING.md,
  },
  headerTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.textWhite,
    fontWeight: "700",
    fontSize: 20,
  },
  headerSubtitle: {
    ...TEXT_STYLES.caption,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40, 
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  tabBar: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    flexDirection: "row",
    marginTop: SPACING.lg,
    padding: SPACING.xs,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 42,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: SPACING.sm,
  },
  tabTextActive: {
    color: COLORS.textWhite,
  },

 
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    marginHorizontal: SPACING.xs,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  statNumber: {
    ...TEXT_STYLES.title,
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 24,
  },
  statLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  // Title Section
  titleSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  // News Container
  newsContainer: {
    paddingBottom: SPACING.xxxl,
  },
  campaignsContainer: {
    paddingBottom: SPACING.xxxl,
  },
  campaignCard: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: SPACING.md,
    overflow: "hidden",
    ...SHADOWS.light,
  },
  campaignAccent: {
    width: 6,
  },
  campaignContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  campaignHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  monthBadge: {
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  monthText: {
    ...TEXT_STYLES.caption,
    fontSize: 12,
    fontWeight: "700",
  },
  campaignName: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  campaignTheme: {
    ...TEXT_STYLES.caption,
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  campaignDescription: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  campaignAction: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: SPACING.md,
  },
  campaignActionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    marginRight: SPACING.xs,
  },

  // News Card modernizada
  newsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    position: "relative",
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  categoryText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: "600",
    fontSize: 12,
  },
  newsDate: {
    ...TEXT_STYLES.caption,
    color: COLORS.textLight,
    fontSize: 12,
  },
  newsTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  newsSummary: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignSelf: "center",
    minWidth: 100,
  },
  expandButtonText: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  priorityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.2)",
  },
  priorityText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Bottom Navigation moderno
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md + (Platform.OS === "ios" ? 34 : 16),
    ...SHADOWS.heavy,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: SPACING.md,
  },
  navButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: SPACING.sm,
  },
});
