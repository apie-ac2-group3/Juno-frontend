import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, MessageCircle, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, AnalysisResponse } from "@/api/client";

interface JournalEntryInsightsProps {
  journalEntryId: number;
  userId: string | number;
}

const JournalEntryInsights = ({
  journalEntryId,
  userId,
}: JournalEntryInsightsProps) => {
  const [insights, setInsights] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!userId || journalEntryId === 0) {
        // Skip analysis for sample entries (id: 0)
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const analysisResult = await apiClient.analyzeJournal(journalEntryId);
        setInsights(analysisResult);
      } catch (error) {
        console.error("Error fetching entry insights:", error);
        setError("Failed to load AI insights");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [journalEntryId, userId]);

  const getSentimentColor = (score: number) => {
    if (score >= 8) return "bg-green-500 text-white";
    if (score >= 6) return "bg-yellow-500 text-white";
    if (score >= 4) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 8) return "Very Positive";
    if (score >= 6) return "Positive";
    if (score >= 4) return "Neutral";
    if (score >= 2) return "Negative";
    return "Very Negative";
  };

  if (loading) {
    return (
      <Card className="mt-4 border-purple-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
            <div className="text-sm text-muted-foreground">
              Analyzing insights...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="mt-4 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              No AI insights available for this entry
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-purple-200/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-purple-600" />
          AI Insights for this Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentiment Score */}
        <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Sentiment Score</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getSentimentColor(insights.sentimentScore)}>
              {insights.sentimentScore}/10
            </Badge>
            <span className="text-xs text-muted-foreground">
              {getSentimentLabel(insights.sentimentScore)}
            </span>
          </div>
        </div>

        {/* AI Counsel */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">AI Counsel</span>
          </div>
          <div className="p-3 bg-white/70 rounded-lg border-l-4 border-purple-400">
            <p className="text-sm text-gray-700 leading-relaxed">
              {insights.counsel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntryInsights;
