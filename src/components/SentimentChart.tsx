import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { JournalEntry } from "@/api/client";

const chartConfig = {
  positive: {
    label: "Positive",
    color: "#22c55e",
  },
  neutral: {
    label: "Neutral",
    color: "#64748b",
  },
  negative: {
    label: "Negative",
    color: "#ef4444",
  },
};

interface TrendDataPoint {
  date: string;
  sentiment_score: number;
  entry_id: number;
  entryDate: string;
}

interface DistributionDataPoint {
  sentiment: string;
  count: number;
  fill: string;
}

const SentimentChart = () => {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<
    DistributionDataPoint[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { entries, loading: entriesLoading } = useJournalEntries();

  // Memoize the update functions to prevent unnecessary re-renders
  const updateSentimentDistribution = useCallback((data: JournalEntry[]) => {
    console.log("Updating sentiment distribution with journal entries:", data);

    // Initialize counts
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    // Count sentiments based on sentiment_score
    data.forEach((entry) => {
      if (
        entry.sentiment_score !== undefined &&
        entry.sentiment_score !== null
      ) {
        if (entry.sentiment_score >= 7) {
          counts.positive++;
        } else if (entry.sentiment_score >= 4) {
          counts.neutral++;
        } else {
          counts.negative++;
        }
      }
    });

    console.log("Sentiment counts:", counts);

    // Create distribution data
    const newDistributionData: DistributionDataPoint[] = [
      {
        sentiment: "Positive (7-10)",
        count: counts.positive,
        fill: chartConfig.positive.color,
      },
      {
        sentiment: "Neutral (4-6)",
        count: counts.neutral,
        fill: chartConfig.neutral.color,
      },
      {
        sentiment: "Negative (1-3)",
        count: counts.negative,
        fill: chartConfig.negative.color,
      },
    ];

    console.log("New distribution data:", newDistributionData);
    setDistributionData(newDistributionData);
  }, []);

  const updateTrendData = useCallback((data: JournalEntry[]) => {
    console.log("Updating trend data with journal entries:", data);

    if (!data || data.length === 0) {
      setTrendData([]);
      return;
    }

    // Filter entries that have sentiment scores and sort by date
    const entriesWithSentiment = data
      .filter(
        (entry) =>
          entry.sentiment_score !== undefined && entry.sentiment_score !== null
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .slice(-10); // Take last 10 entries

    const newTrendData: TrendDataPoint[] = entriesWithSentiment.map(
      (entry) => ({
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sentiment_score: entry.sentiment_score || 0,
        entry_id: entry.journal_entry_id,
        entryDate: entry.created_at,
      })
    );

    console.log("New trend data:", newTrendData);
    setTrendData(newTrendData);
  }, []);

  // Memoize the fetch function to prevent infinite loops
  const processSentimentData = useCallback(() => {
    if (!entries || entries.length === 0) {
      console.log("No journal entries available");
      setTrendData([]);
      setDistributionData([]);
      return;
    }

    try {
      console.log("Processing sentiment data for entries:", entries);

      // Update both trend and distribution data
      updateTrendData(entries);
      updateSentimentDistribution(entries);
    } catch (error) {
      console.error("Error processing sentiment data:", error);
      setTrendData([]);
      setDistributionData([]);
    }
  }, [entries, updateTrendData, updateSentimentDistribution]);

  useEffect(() => {
    setLoading(entriesLoading);
    if (!entriesLoading) {
      processSentimentData();
    }
  }, [entriesLoading, processSentimentData]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">
                Loading sentiment data...
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">
                Loading sentiment data...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  No sentiment data available
                </div>
                <div className="text-xs text-muted-foreground">
                  Write journal entries to see your sentiment analysis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  No sentiment data available
                </div>
                <div className="text-xs text-muted-foreground">
                  Write journal entries to see your sentiment distribution
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sentiment scores over time ({trendData.length} entries)
          </p>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 10]}
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Sentiment Score",
                      angle: -90,
                      // position: "insideLeft",
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: any, name: any) => [
                      `${value}`,
                      name === "sentiment_score" ? "Sentiment Score" : name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment_score"
                    stroke="#8766B4"
                    strokeWidth={2}
                    dot={{ fill: "#8766B4", strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">
                No sentiment data to display
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total entries by sentiment ({entries.length} total)
          </p>
        </CardHeader>
        <CardContent>
          {distributionData.length > 0 &&
          distributionData.some((d) => d.count > 0) ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={distributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="sentiment"
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: any) => [`${value} entries`, "Count"]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">
                No distribution data to display
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentChart;
