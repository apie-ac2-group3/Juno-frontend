import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useEffect, useState, useCallback } from "react";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { JournalEntry } from "@/api/client";
import { TrendingUp, Smile, Meh, Frown } from "lucide-react";

interface MoodDataPoint {
  date: string;
  moodScore: number;
  moodLabel: string;
  entryCount: number;
}

// Mood mapping - you can adjust these based on your mood selector values
const MOOD_SCORES = {
  "very-happy": 10,
  happy: 8,
  good: 7,
  okay: 5,
  sad: 3,
  "very-sad": 1,
  angry: 2,
  excited: 9,
  calm: 6,
  stressed: 3,
  anxious: 2,
  grateful: 8,
  proud: 9,
  disappointed: 3,
  confused: 4,
  energetic: 8,
  tired: 4,
  peaceful: 7,
  frustrated: 3,
  hopeful: 7,
};

const chartConfig = {
  moodScore: {
    label: "Mood Score",
    color: "#8766B4",
  },
};

const MoodTrendChart = () => {
  const [moodTrendData, setMoodTrendData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageMood, setAverageMood] = useState<number>(0);
  const { entries, loading: entriesLoading } = useJournalEntries();

  const getMoodScore = (moodText: string): number => {
    const mood = moodText?.toLowerCase().replace(/\s+/g, "-");
    return MOOD_SCORES[mood as keyof typeof MOOD_SCORES] || 5; // Default to neutral
  };

  const getMoodLabel = (score: number): string => {
    if (score >= 8) return "Great";
    if (score >= 6) return "Good";
    if (score >= 4) return "Okay";
    if (score >= 2) return "Low";
    return "Very Low";
  };

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="h-4 w-4 text-green-500" />;
    if (score >= 4) return <Meh className="h-4 w-4 text-yellow-500" />;
    return <Frown className="h-4 w-4 text-red-500" />;
  };

  const processMoodData = useCallback(() => {
    if (!entries || entries.length === 0) {
      setMoodTrendData([]);
      setAverageMood(0);
      return;
    }

    // Group entries by date and calculate average mood for each day
    const moodByDate: {
      [key: string]: { scores: number[]; labels: string[] };
    } = {};

    entries.forEach((entry) => {
      // Extract mood from entry text or use a default approach
      // For now, we'll simulate mood extraction from the text content
      // In a real app, you might store mood separately or extract it differently
      const dateKey = new Date(entry.created_at).toLocaleDateString();

      if (!moodByDate[dateKey]) {
        moodByDate[dateKey] = { scores: [], labels: [] };
      }

      // For demo purposes, let's generate mood based on sentiment score if available
      let moodScore = 5; // Default neutral
      if (
        entry.sentiment_score !== null &&
        entry.sentiment_score !== undefined
      ) {
        moodScore = Math.round(entry.sentiment_score);
      } else {
        // Generate a random mood score for demo (remove this in production)
        moodScore = Math.floor(Math.random() * 10) + 1;
      }

      moodByDate[dateKey].scores.push(moodScore);
      moodByDate[dateKey].labels.push(getMoodLabel(moodScore));
    });

    // Convert to chart data
    const chartData: MoodDataPoint[] = Object.entries(moodByDate)
      .map(([date, data]) => {
        const averageScore =
          data.scores.reduce((sum, score) => sum + score, 0) /
          data.scores.length;
        return {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          moodScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
          moodLabel: getMoodLabel(averageScore),
          entryCount: data.scores.length,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 days

    setMoodTrendData(chartData);

    // Calculate overall average mood
    const overallAverage =
      chartData.reduce((sum, point) => sum + point.moodScore, 0) /
      chartData.length;
    setAverageMood(Math.round(overallAverage * 10) / 10);
  }, [entries]);

  useEffect(() => {
    setLoading(entriesLoading);
    if (!entriesLoading) {
      processMoodData();
    }
  }, [entriesLoading, processMoodData]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Loading mood data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!entries || entries.length === 0 || moodTrendData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">
            No mood data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
        <div className="flex items-center gap-1">
          {getMoodIcon(averageMood)}
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">{averageMood}/10</div>
            <p className="text-xs text-muted-foreground">
              Average mood ({moodTrendData.length} days)
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">
              {getMoodLabel(averageMood)}
            </div>
          </div>
        </div>

        <div className="h-[80px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodTrendData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 10]} hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: any) => [
                    `${value}/10`,
                    "Mood Score",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#8766B4"
                  fill="#8766B4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Past {moodTrendData.length} days</span>
          <span>
            {moodTrendData.reduce((sum, point) => sum + point.entryCount, 0)}{" "}
            entries
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrendChart;
