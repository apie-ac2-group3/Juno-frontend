
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSentimentAnalysis, SentimentAnalysis } from "@/hooks/useSentimentAnalysis";

const AIInsights = () => {
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [insights, setInsights] = useState({
    dominantMood: '',
    moodTrend: '',
    keyThemes: [] as string[],
    averageConfidence: 0
  });
  const { user } = useAuth();
  const { getSentimentHistory } = useSentimentAnalysis();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;
      
      const data = await getSentimentHistory(user.id);
      setSentimentData(data);
      
      if (data.length === 0) return;

      // Calculate insights
      const sentimentCounts = data.reduce((acc, entry) => {
        acc[entry.sentiment_label] = (acc[entry.sentiment_label] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantMood = Object.entries(sentimentCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

      // Calculate trend (last 5 vs previous 5)
      const recent = data.slice(0, 5);
      const previous = data.slice(5, 10);
      const recentAvg = recent.reduce((sum, entry) => {
        const score = entry.sentiment_label === 'positive' ? 1 : 
                     entry.sentiment_label === 'neutral' ? 0 : -1;
        return sum + score;
      }, 0) / recent.length;
      
      const previousAvg = previous.length > 0 ? previous.reduce((sum, entry) => {
        const score = entry.sentiment_label === 'positive' ? 1 : 
                     entry.sentiment_label === 'neutral' ? 0 : -1;
        return sum + score;
      }, 0) / previous.length : 0;

      const moodTrend = recentAvg > previousAvg ? 'improving' : 
                       recentAvg < previousAvg ? 'declining' : 'stable';

      // Extract key themes from keywords
      const allKeywords = data.flatMap(entry => entry.keywords || []);
      const keywordCounts = allKeywords.reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const keyThemes = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([keyword]) => keyword);

      const averageConfidence = data.reduce((sum, entry) => sum + entry.confidence_score, 0) / data.length;

      setInsights({
        dominantMood,
        moodTrend,
        keyThemes,
        averageConfidence
      });
    };

    fetchInsights();
  }, [user, getSentimentHistory]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  if (sentimentData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#8766B4]" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Write more journal entries to see AI insights about your emotional patterns.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#8766B4]" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Dominant Mood</span>
            </div>
            <Badge className={getMoodColor(insights.dominantMood)}>
              {insights.dominantMood}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getTrendIcon(insights.moodTrend)}
              <span className="text-sm font-medium">Mood Trend</span>
            </div>
            <Badge variant="outline">
              {insights.moodTrend}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Key Themes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.keyThemes.map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Analysis Confidence</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#8766B4] h-2 rounded-full" 
              style={{ width: `${insights.averageConfidence * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(insights.averageConfidence * 100)}% average confidence
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
