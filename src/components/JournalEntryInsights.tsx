
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSentimentAnalysis, SentimentAnalysis } from "@/hooks/useSentimentAnalysis";

interface JournalEntryInsightsProps {
  journalEntryId: number;
  userId: string;
}

const JournalEntryInsights = ({ journalEntryId, userId }: JournalEntryInsightsProps) => {
  const [insights, setInsights] = useState<SentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { getSentimentHistory } = useSentimentAnalysis();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const allInsights = await getSentimentHistory(userId);
        const entryInsight = allInsights.find(insight => 
          insight.journal_entry_id === journalEntryId
        );
        setInsights(entryInsight || null);
      } catch (error) {
        console.error('Error fetching entry insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [journalEntryId, userId, getSentimentHistory]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Analyzing insights...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">No AI insights available for this entry</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-[#8766B4]/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-[#8766B4]" />
          AI Insights for this Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3" />
              <span className="text-xs font-medium">Sentiment</span>
            </div>
            <Badge className={getMoodColor(insights.sentiment_label)}>
              {insights.sentiment_label}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3 h-3" />
              <span className="text-xs font-medium">Confidence</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(insights.confidence_score * 100)}%
            </div>
          </div>
        </div>

        {insights.emotions && (
          <div className="space-y-2">
            <span className="text-xs font-medium">Emotional Breakdown</span>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(insights.emotions).map(([emotion, score]) => (
                <div key={emotion} className="text-center">
                  <div className="text-xs capitalize text-muted-foreground">{emotion}</div>
                  <div className="text-xs font-medium">{Math.round(score * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights.keywords && insights.keywords.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium">Key Themes</span>
            <div className="flex flex-wrap gap-1">
              {insights.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalEntryInsights;
