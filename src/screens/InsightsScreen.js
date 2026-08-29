import React, { useCallback, useMemo, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  PanResponder,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";

import Svg, {
  Circle,
  Line,
  Text as SvgText,
} from "react-native-svg";

import { getMoodMeta } from "../utils/insightsHelper";
import { loadInsightsData } from "../services/insightsDataService";

const { width } = Dimensions.get("window");

const BG = "#E5EEFF";
const GREEN = "#A7E2AF";
const PURPLE = "#8E7BE8";
const BLACK = "#111111";
const GRAY = "#888787";
const CARD = "#FFFFFF";

const EMPTY_DAILY = {
  dateText: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }),
  primaryMood: "neutral",
  moodScore: 6.5,
  hasMoodData: false,
  sourceCount: 0,
  journalInsight:
    "No reliable journal emotion analysis has been recorded today.",
  faceScanInsight:
    "No face scan check-in has been recorded today.",
  chatInsight:
    "No reliable chatbot emotion analysis has been recorded today.",
  dailyReflection:
    "There is not enough check-in data yet today. Journal, Chat, or Face Scan can help build your daily insight.",
};

const EMPTY_WEEKLY = {
  weeklyMoodTrend: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].map((day) => ({
    day,
    mood: null,
    score: null,
    hasData: false,
  })),

  distribution: [],

  engagement: [
    { name: "Chatbot", count: 0 },
    { name: "Journal", count: 0 },
    { name: "Face scanning", count: 0 },
  ],

  daysWithData: 0,
  weeklyReflection:
    "There is not enough check-in data to build a weekly pattern yet.",
};

function ToggleButton({ activeTab, setActiveTab }) {
  return (
    <View style={styles.toggleContainer}>
      {["daily", "weekly"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.toggleButton,
            activeTab === tab && styles.activeToggle,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === tab && styles.activeToggleText,
            ]}
          >
            {tab === "daily" ? "Daily" : "Weekly"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function WeeklyMoodTrend({ data = [] }) {
  const chartWidth = width - 100;
  const chartHeight = 158;

  const left = 25;
  const right = 10;
  const top = 15;
  const bottom = 30;

  const usableWidth = chartWidth - left - right;
  const usableHeight = chartHeight - top - bottom;

  const safeData = Array.isArray(data) ? data : [];
  const count = Math.max(safeData.length, 2);

  const getX = (index) =>
    left + (usableWidth / (count - 1)) * index;

  const getY = (score) =>
    top + ((10 - score) / 9) * usableHeight;

  const segments = [];

  for (let i = 0; i < safeData.length - 1; i += 1) {
    const current = safeData[i];
    const next = safeData[i + 1];

    if (
      current?.hasData &&
      next?.hasData &&
      Number.isFinite(current.score) &&
      Number.isFinite(next.score)
    ) {
      segments.push({
        id: `${current.day}-${next.day}`,
        x1: getX(i),
        y1: getY(current.score),
        x2: getX(i + 1),
        y2: getY(next.score),
      });
    }
  }

  return (
    <View style={styles.trendWrapper}>
      <Svg width={chartWidth} height={chartHeight}>
        {[10, 7, 4, 1].map((score) => {
          const y = getY(score);

          return (
            <React.Fragment key={score}>
              <Line
                x1={left}
                y1={y}
                x2={chartWidth - right}
                y2={y}
                stroke="#E8EEF5"
                strokeWidth={1}
              />

              <SvgText
                x={2}
                y={y + 4}
                fontSize={10}
                fill="#555555"
              >
                {score}
              </SvgText>
            </React.Fragment>
          );
        })}

        {segments.map((segment) => (
          <Line
            key={segment.id}
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            stroke={PURPLE}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        ))}

        {safeData.map((item, index) => (
          <SvgText
            key={`day-${item.day}-${index}`}
            x={getX(index) - 9}
            y={chartHeight - 7}
            fontSize={10}
            fill="#555555"
          >
            {item.day}
          </SvgText>
        ))}
      </Svg>

      {safeData.map((item, index) => {
        if (
          !item?.hasData ||
          !item?.mood ||
          !Number.isFinite(item.score)
        ) {
          return null;
        }

        const mood = getMoodMeta(item.mood);

        return (
          <View
            key={`mood-${item.day}-${item.mood}-${index}`}
            style={[
              styles.trendMoodWrap,
              {
                left: getX(index) - 18,
                top: getY(item.score) - 18,
                borderColor: mood.color,
              },
            ]}
          >
            <Image
              source={mood.icon}
              style={styles.trendMoodIcon}
              resizeMode="contain"
            />
          </View>
        );
      })}
    </View>
  );
}

function DonutChart({ distribution = [] }) {
  if (!Array.isArray(distribution) || distribution.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Ionicons
          name="pie-chart-outline"
          size={38}
          color="#A7A7B0"
        />

        <Text style={styles.emptyChartText}>
          More check-ins are needed to build your weekly emotion
          distribution.
        </Text>
      </View>
    );
  }

  const size = 138;
  const radius = 50;
  const strokeWidth = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let used = 0;

  return (
    <View style={styles.distributionRow}>
      <View style={styles.donutBox}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ECECEC"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {distribution.map((item, index) => {
            const mood = getMoodMeta(item.mood);

            const percent = Number.isFinite(Number(item.percent))
              ? Number(item.percent)
              : 0;

            const length =
              (percent / 100) * circumference;

            const offset =
              circumference -
              (used / 100) * circumference;

            used += percent;

            return (
              <Circle
                key={`donut-${item.mood}-${index}`}
                cx={center}
                cy={center}
                r={radius}
                stroke={mood.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${length} ${
                  circumference - length
                }`}
                strokeDashoffset={offset}
                rotation={-90}
                originX={center}
                originY={center}
              />
            );
          })}
        </Svg>

        <View style={styles.donutCenter}>
          <Text style={styles.donutCenterText}>
            This{"\n"}week
          </Text>
        </View>
      </View>

      <View style={styles.legendBox}>
        {distribution.map((item, index) => {
          const mood = getMoodMeta(item.mood);

          return (
            <View
              key={`legend-${item.mood}-${index}`}
              style={styles.legendRow}
            >
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: mood.color },
                ]}
              />

              <Image
                source={mood.icon}
                style={styles.legendIcon}
                resizeMode="contain"
              />

              <Text
                style={styles.legendLabel}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              <Text style={styles.legendPercent}>
                {item.percent}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function EngagementRow({ item }) {
  const icon =
    item.name === "Journal"
      ? "book-open"
      : item.name === "Face scanning"
      ? "camera"
      : "message-circle";

  const count = Number(item?.count) || 0;

  return (
    <View style={styles.engagementRow}>
      <View style={styles.engagementLeft}>
        <Feather
          name={icon}
          size={17}
          color={GRAY}
        />

        <Text style={styles.engagementName}>
          {item.name}
        </Text>
      </View>

      <View style={styles.engagementBars}>
        {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
          <View
            key={bar}
            style={[
              styles.smallBar,
              bar <= count && styles.activeSmallBar,
            ]}
          />
        ))}
      </View>

      <Text style={styles.engagementCount}>
        {count}x
      </Text>
    </View>
  );
}

function InsightCard({
  icon,
  title,
  text,
  note,
}) {
  return (
    <View style={styles.largeCard}>
      <View style={styles.cardTitleRow}>
        <Feather
          name={icon}
          size={18}
          color={PURPLE}
        />

        <Text style={styles.cardTitleText}>
          {title}
        </Text>
      </View>

      <Text style={styles.cardBody}>
        {text}
      </Text>

      {note ? (
        <Text style={styles.sourceNote}>
          {note}
        </Text>
      ) : null}
    </View>
  );
}

function SmallInsightCard({
  icon,
  title,
  text,
}) {
  return (
    <View style={styles.smallInsightCard}>
      <View style={styles.cardTitleRow}>
        <Feather
          name={icon}
          size={16}
          color={PURPLE}
        />

        <Text style={styles.smallCardTitle}>
          {title}
        </Text>
      </View>

      <Text style={styles.smallCardBody}>
        {text}
      </Text>
    </View>
  );
}

function DailyView({
  daily,
  refreshing,
  onRefresh,
}) {
  const mood = getMoodMeta(
    daily?.primaryMood || "neutral"
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={PURPLE}
          colors={[PURPLE]}
        />
      }
    >
      <View style={styles.dailyMoodCard}>
        <Image
          source={mood.icon}
          style={styles.dailyMoodIcon}
          resizeMode="contain"
        />

        <View style={styles.dailyMoodTextBox}>
          <Text style={styles.dailyCardTitle}>
            Today’s Mood • {daily.dateText}
          </Text>

          {daily.hasMoodData ? (
            <>
              <Text style={styles.bigMoodName}>
                {mood.name}
              </Text>

              <Text style={styles.moodScore}>
                {daily.moodScore}/10
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.bigMoodName}>
                No data yet
              </Text>

              <Text style={styles.noMoodText}>
                Use Journal, Chat, or Face Scan
              </Text>
            </>
          )}
        </View>
      </View>

      <InsightCard
        icon="book-open"
        title="Journal Insight"
        text={daily.journalInsight}
      />

      <View style={styles.twoCardRow}>
        <SmallInsightCard
          icon="camera"
          title="Face Scan"
          text={daily.faceScanInsight}
        />

        <SmallInsightCard
          icon="message-circle"
          title="Chat Support"
          text={daily.chatInsight}
        />
      </View>

      <InsightCard
        icon="sun"
        title="Today’s Reflection"
        text={daily.dailyReflection}
        note={
          daily.sourceCount > 0
            ? `Based on ${daily.sourceCount} of 3 available Healio check-in sources.`
            : null
        }
      />
    </ScrollView>
  );
}

function WeeklyView({
  weekly,
  refreshing,
  onRefresh,
}) {
  const engagement = Array.isArray(weekly?.engagement)
    ? weekly.engagement
    : EMPTY_WEEKLY.engagement;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={PURPLE}
          colors={[PURPLE]}
        />
      }
    >
      <View style={styles.weeklyTrendCard}>
        <View style={styles.weeklyHeaderRow}>
          <Text style={styles.cardTitle}>
            Weekly Mood Trend
          </Text>

          <Text style={styles.daysText}>
            {weekly.daysWithData || 0}/7 days
          </Text>
        </View>

        <WeeklyMoodTrend
          data={weekly.weeklyMoodTrend}
        />

        {(weekly.daysWithData || 0) === 0 && (
          <Text style={styles.emptyTrendText}>
            No reliable emotion check-ins recorded this week yet.
          </Text>
        )}
      </View>

      <View style={styles.distributionCard}>
        <Text style={styles.sectionCardTitle}>
          Emotion Distribution
        </Text>

        <DonutChart
          distribution={weekly.distribution}
        />
      </View>

      <View style={styles.engagementCard}>
        <Text style={styles.sectionCardTitle}>
          Weekly Engagement
        </Text>

        {engagement.map((item, index) => (
          <EngagementRow
            key={`${item.name}-${index}`}
            item={item}
          />
        ))}

        <Text style={styles.engagementNote}>
          Based on this week’s Journal entries, Face Scan
          check-ins, and Chatbot sessions.
        </Text>
      </View>

      <InsightCard
        icon="bar-chart-2"
        title="Weekly Reflection"
        text={weekly.weeklyReflection}
      />
    </ScrollView>
  );
}

export default function InsightsScreen({
  navigation,
}) {
  const [activeTab, setActiveTab] = useState("daily");
  const [daily, setDaily] = useState(EMPTY_DAILY);
  const [weekly, setWeekly] = useState(EMPTY_WEEKLY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadInsights = useCallback(
    async (fullLoader = false) => {
      if (fullLoader) {
        setLoading(true);
      }

      setLoadError(false);

      try {
        const result = await loadInsightsData();

        setDaily(
          result?.daily || EMPTY_DAILY
        );

        setWeekly(
          result?.weekly || EMPTY_WEEKLY
        );
      } catch (error) {
        console.warn(
          "Insights load error:",
          error
        );

        setLoadError(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadInsights(true);
    }, [loadInsights])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadInsights(false);
  }, [loadInsights]);

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 35 &&
          Math.abs(gesture.dy) < 25,

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -45) {
            setActiveTab("weekly");
          } else if (gesture.dx > 45) {
            setActiveTab("daily");
          }
        },
      }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BG}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HomeTab")
          }
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
        >
          <Ionicons
            name="chevron-back"
            size={34}
            color={BLACK}
          />
        </TouchableOpacity>

        <ToggleButton
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityLabel="Refresh insights"
        >
          <Ionicons
            name="refresh"
            size={23}
            color={BLACK}
          />
        </TouchableOpacity>
      </View>

      {loadError && (
        <View style={styles.errorBanner}>
          <Ionicons
            name="cloud-offline-outline"
            size={17}
            color="#775E26"
          />

          <Text style={styles.errorText}>
            Some insight data could not be loaded. Pull down to
            try again.
          </Text>
        </View>
      )}

      <View
        style={styles.content}
        {...swipeResponder.panHandlers}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={PURPLE}
            />

            <Text style={styles.loadingTitle}>
              Building your insights
            </Text>

            <Text style={styles.loadingText}>
              Looking at your Journal, Chat, and Face Scan
              check-ins...
            </Text>
          </View>
        ) : activeTab === "daily" ? (
          <DailyView
            daily={daily}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        ) : (
          <WeeklyView
            weekly={weekly}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    flex: 1,
  },

  header: {
    height: 90,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  refreshButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleContainer: {
    width: 235,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#DDE5EB",
    flexDirection: "row",
    overflow: "hidden",
  },

  toggleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activeToggle: {
    backgroundColor: GREEN,
    borderRadius: 20,
  },

  toggleText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    color: GRAY,
  },

  activeToggleText: {
    color: BLACK,
  },

  scrollContent: {
    paddingHorizontal: 31,
    paddingBottom: 80,
  },

  errorBanner: {
    marginHorizontal: 31,
    marginBottom: 6,
    padding: 12,
    borderRadius: 15,
    backgroundColor: "#FFF5D9",
    flexDirection: "row",
    alignItems: "center",
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#775E26",
  },

  dailyMoodCard: {
    minHeight: 165,
    borderRadius: 25,
    backgroundColor: CARD,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    marginTop: 18,
    marginBottom: 25,
  },

  dailyMoodIcon: {
    width: 105,
    height: 105,
    marginRight: 20,
  },

  dailyMoodTextBox: {
    flex: 1,
  },

  dailyCardTitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: BLACK,
    marginBottom: 13,
  },

  bigMoodName: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 27,
    color: BLACK,
  },

  moodScore: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 17,
    color: BLACK,
    marginTop: 5,
  },

  noMoodText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12,
    color: GRAY,
    marginTop: 6,
  },

  largeCard: {
    minHeight: 124,
    borderRadius: 22,
    backgroundColor: CARD,
    padding: 25,
    marginBottom: 25,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitleText: {
    marginLeft: 8,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 16,
    color: BLACK,
  },

  cardBody: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: GRAY,
  },

  sourceNote: {
    marginTop: 15,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 11,
    lineHeight: 16,
    color: "#9A99A3",
  },

  twoCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  smallInsightCard: {
    width: "48%",
    minHeight: 155,
    borderRadius: 20,
    backgroundColor: CARD,
    padding: 18,
  },

  smallCardTitle: {
    flex: 1,
    marginLeft: 7,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    color: BLACK,
  },

  smallCardBody: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: GRAY,
  },

  weeklyTrendCard: {
    minHeight: 268,
    borderRadius: 24,
    backgroundColor: CARD,
    paddingHorizontal: 24,
    paddingTop: 26,
    marginTop: 18,
    marginBottom: 22,
  },

  weeklyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 16,
    color: BLACK,
    marginBottom: 13,
  },

  daysText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 11,
    color: PURPLE,
    marginBottom: 13,
  },

  trendWrapper: {
    width: "100%",
    height: 170,
    marginTop: 18,
    position: "relative",
  },

  trendMoodWrap: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.3,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  trendMoodIcon: {
    width: 34,
    height: 34,
  },

  emptyTrendText: {
    marginTop: -14,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 11,
    color: "#9A99A3",
  },

  distributionCard: {
    minHeight: 230,
    borderRadius: 24,
    backgroundColor: CARD,
    padding: 24,
    marginBottom: 22,
  },

  sectionCardTitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 19,
    color: BLACK,
    marginBottom: 18,
  },

  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  donutBox: {
    width: 138,
    height: 138,
    alignItems: "center",
    justifyContent: "center",
  },

  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },

  donutCenterText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    lineHeight: 19,
    color: GRAY,
    textAlign: "center",
  },

  legendBox: {
    flex: 1,
    marginLeft: 18,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },

  legendLabel: {
    flex: 1,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 12,
    color: GRAY,
  },

  legendPercent: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 12,
    color: GRAY,
  },

  emptyChart: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyChartText: {
    marginTop: 12,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: GRAY,
    textAlign: "center",
  },

  engagementCard: {
    minHeight: 155,
    borderRadius: 20,
    backgroundColor: CARD,
    padding: 24,
    marginBottom: 25,
  },

  engagementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  engagementLeft: {
    width: 125,
    flexDirection: "row",
    alignItems: "center",
  },

  engagementName: {
    marginLeft: 9,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 13,
    color: GRAY,
  },

  engagementBars: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
  },

  smallBar: {
    width: 6,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#DADADA",
    marginRight: 5,
  },

  activeSmallBar: {
    backgroundColor: PURPLE,
  },

  engagementCount: {
    marginLeft: 7,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 13,
    color: GRAY,
  },

  engagementNote: {
    marginTop: 3,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 10.5,
    lineHeight: 16,
    color: "#9A99A3",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 45,
  },

  loadingTitle: {
    marginTop: 18,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 18,
    color: BLACK,
  },

  loadingText: {
    marginTop: 9,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: GRAY,
    textAlign: "center",
  },
});