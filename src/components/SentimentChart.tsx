
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSentimentAnalysis, SentimentAnalysis } from "@/hooks/useSentimentAnalysis";

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
  sentiment: string;
  confidence: number;
  index: number;
}

interface DistributionDataPoint {
  sentiment: string;
  count: number;
  fill: string;
}

const SentimentChart = () => {
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getSentimentHistory } = useSentimentAnalysis();

  // Memoize the update functions to prevent unnecessary re-renders
  const updateSentimentDistribution = useCallback((data: SentimentAnalysis[]) => {
    console.log('Updating sentiment distribution with data:', data);
    
    // Initialize counts
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    // Count sentiments
    data.forEach(entry => {
      const sentiment = entry.sentiment_label?.toLowerCase();
      if (sentiment === 'positive') {
        counts.positive++;
      } else if (sentiment === 'negative') {
        counts.negative++;
      } else {
        counts.neutral++;
      }
    });

    console.log('Sentiment counts:', counts);

    // Create distribution data
    const newDistributionData: DistributionDataPoint[] = [
      { 
        sentiment: 'Positive', 
        count: counts.positive, 
        fill: chartConfig.positive.color 
      },
      { 
        sentiment: 'Neutral', 
        count: counts.neutral, 
        fill: chartConfig.neutral.color 
      },
      { 
        sentiment: 'Negative', 
        count: counts.negative, 
        fill: chartConfig.negative.color 
      },
    ];

    console.log('New distribution data:', newDistributionData);
    setDistributionData(newDistributionData);
  }, []);

  const updateTrendData = useCallback((data: SentimentAnalysis[]) => {
    console.log('Updating trend data with:', data);
    
    if (!data || data.length === 0) {
      setTrendData([]);
      return;
    }

    // Take last 10 entries and reverse for chronological order
    const recentEntries = data.slice(0, 10).reverse();
    
    const newTrendData: TrendDataPoint[] = recentEntries.map((entry, index) => ({
      date: new Date(entry.analyzed_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      sentiment: entry.sentiment_label,
      confidence: Math.round(entry.confidence_score * 100),
      index: index + 1
    }));

    console.log('New trend data:', newTrendData);
    setTrendData(newTrendData);
  }, []);

  // Memoize the fetch function to prevent infinite loops
  const fetchSentimentData = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching sentiment data for user:', user.id);
      
      const data = await getSentimentHistory(user.id);
      console.log('Raw sentiment data received:', data);
      
      setSentimentData(data);
      
      // Update both trend and distribution data
      updateTrendData(data);
      updateSentimentDistribution(data);
      
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setSentimentData([]);
      setTrendData([]);
      setDistributionData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, getSentimentHistory, updateTrendData, updateSentimentDistribution]);

  useEffect(() => {
    fetchSentimentData();
  }, [fetchSentimentData]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">Loading sentiment data...</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-sm text-muted-foreground">Loading sentiment data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sentimentData.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">No sentiment data available</div>
                <div className="text-xs text-muted-foreground">Write journal entries to see your sentiment analysis</div>
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
                <div className="text-sm text-muted-foreground mb-2">No sentiment data available</div>
                <div className="text-xs text-muted-foreground">Write journal entries to see your sentiment distribution</div>
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
            Confidence scores over time ({trendData.length} entries)
          </p>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any, name: any) => [
                      `${value}%`,
                      name === 'confidence' ? 'Confidence' : name
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
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
              <div className="text-sm text-muted-foreground">No trend data to display</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total entries by sentiment ({sentimentData.length} total)
          </p>
        </CardHeader>
        <CardContent>
          {distributionData.length > 0 && distributionData.some(d => d.count > 0) ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    formatter={(value: any) => [`${value} entries`, 'Count']}
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
              <div className="text-sm text-muted-foreground">No distribution data to display</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentChart;
