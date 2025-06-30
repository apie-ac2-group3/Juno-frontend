import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart } from "lucide-react";

interface JournalAnalysisProps {
  analysisResult: {
    sentimentScore: number;
    counsel: string;
  } | null;
  isLoading?: boolean;
}

const JournalAnalysis: React.FC<JournalAnalysisProps> = ({
  analysisResult,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  const getSentimentColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 8) return "Very Positive";
    if (score >= 6) return "Positive";
    if (score >= 4) return "Neutral";
    if (score >= 2) return "Negative";
    return "Very Negative";
  };

  return (
    <Card className="mt-6 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Analysis & Insights
        </CardTitle>
        <p className="text-sm text-purple-600/70">
          Powered by advanced sentiment analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sentiment Score */}
        <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-pink-100">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-800">
                  Sentiment Score
                </span>
                <p className="text-xs text-gray-500">Emotional tone analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {analysisResult.sentimentScore}
                  <span className="text-sm text-gray-500 font-normal">/10</span>
                </div>
                <Badge
                  className={`${getSentimentColor(
                    analysisResult.sentimentScore
                  )} text-white text-xs px-2 py-1`}
                >
                  {getSentimentLabel(analysisResult.sentimentScore)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${getSentimentColor(
                analysisResult.sentimentScore
              )}`}
              style={{
                width: `${(analysisResult.sentimentScore / 10) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* AI Counsel */}
        <div className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-100">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">AI Counsel</h4>
              <p className="text-xs text-gray-500">
                Personalized guidance for you
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg" />
            <div className="relative p-4 rounded-lg border border-purple-200/50">
              <p className="text-gray-700 leading-relaxed italic">
                "{analysisResult.counsel}"
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalAnalysis;
