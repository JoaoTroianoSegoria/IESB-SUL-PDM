import { StyleSheet, Text, View } from "react-native"
import Svg, { Circle, G } from "react-native-svg"
import { colors } from "../constants/colors"
import { globalStyles } from "../styles/globalStyles"

const CHART_SIZE = 160
const STROKE_WIDTH = 26
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2
const CENTER = CHART_SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PieChart({ categories, totalsById, transactionCount }) {
  const segments = categories
    .map((category) => ({
      category,
      value: Number(totalsById[category.id] ?? 0),
    }))
    .filter((segment) => segment.value > 0)

  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  if (total <= 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Transações por categoria</Text>
        <View style={styles.emptyChart}>
          <Text style={globalStyles.secondaryText}>Sem transações</Text>
        </View>
      </View>
    )
  }

  let offset = 0

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Transações por categoria</Text>

      <View style={styles.chartArea}>
        <View style={styles.chartWrapper}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke={colors.background}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {segments.map((segment) => {
                const arc = (segment.value / total) * CIRCUMFERENCE
                const dashOffset = -offset
                offset += arc

                return (
                  <Circle
                    key={segment.category.id}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={segment.category.background}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${arc} ${CIRCUMFERENCE - arc}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                )
              })}
            </G>
          </Svg>

          <View style={styles.centerLabel}>
            <Text style={styles.centerValue}>{transactionCount}</Text>
            <Text style={globalStyles.secondaryText}>transações</Text>
          </View>
        </View>

        <View style={styles.legend}>
          {segments.map((segment) => {
            const percentage = Math.round((segment.value / total) * 100)

            return (
              <View key={segment.category.id} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: segment.category.background },
                  ]}
                />
                <View style={styles.legendText}>
                  <Text style={globalStyles.primaryText}>
                    {segment.category.displayName}
                  </Text>
                  <Text style={globalStyles.secondaryText}>
                    {percentage}% · {formatCurrency(segment.value)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
  },
  chartArea: {
    alignItems: "center",
    gap: 14,
  },
  chartWrapper: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primaryText,
  },
  legend: {
    width: "100%",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
  },
  emptyChart: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
})

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
