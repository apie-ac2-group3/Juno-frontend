import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SentimentAnalysis {
  id: string;
  journal_entry_id: number;
  sentiment_label: string;
  confidence_score: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  } | null;
  keywords: string[];
  analyzed_at: string;
}

export const useSentimentAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeSentiment = async (text: string, journalEntryId: number) => {
    setLoading(true);
    try {
      console.log('Starting local sentiment analysis for entry:', journalEntryId);
      
      // Simple local sentiment analysis
      const analysis = performLocalSentimentAnalysis(text);
      
      console.log('Local sentiment analysis completed:', analysis);
      
      toast({
        title: "Sentiment Analysis Complete",
        description: `Detected sentiment: ${analysis.sentiment_label}`,
      });

      return analysis;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const performLocalSentimentAnalysis = (text: string) => {
    // Simple sentiment analysis based on keyword matching
    const positiveWords = [
      'happy', 'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
      'love', 'joy', 'excited', 'pleased', 'satisfied', 'grateful', 'blessed',
      'awesome', 'brilliant', 'cheerful', 'delighted', 'thrilled'
    ];
    
    const negativeWords = [
      'sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 
      'disappointed', 'upset', 'depressed', 'anxious', 'worried', 'stressed',
      'horrible', 'disgusted', 'furious', 'miserable', 'devastated', 'heartbroken'
    ];

    const neutralWords = [
      'okay', 'fine', 'normal', 'average', 'typical', 'usual', 'regular',
      'standard', 'ordinary', 'common'
    ];

    const lowercaseText = text.toLowerCase();
    const words = lowercaseText.split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
      if (neutralWords.some(neut => word.includes(neut))) neutralCount++;
    });

    let sentiment = 'neutral';
    let confidence = 0.6;
    let emotions = {
      joy: 0.2,
      sadness: 0.2,
      anger: 0.1,
      fear: 0.1,
      surprise: 0.2
    };

    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      sentiment = 'positive';
      confidence = Math.min(0.9, 0.5 + (positiveCount * 0.1));
      emotions = {
        joy: confidence,
        sadness: 0.1,
        anger: 0.05,
        fear: 0.05,
        surprise: 0.3
      };
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      sentiment = 'negative';
      confidence = Math.min(0.9, 0.5 + (negativeCount * 0.1));
      emotions = {
        joy: 0.1,
        sadness: confidence,
        anger: confidence * 0.6,
        fear: confidence * 0.4,
        surprise: 0.1
      };
    }

    return {
      id: Date.now().toString(),
      journal_entry_id: 0, // Will be set by caller
      sentiment_label: sentiment,
      confidence_score: confidence,
      emotions,
      keywords: extractSimpleKeywords(text),
      analyzed_at: new Date().toISOString()
    };
  };

  const extractSimpleKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Remove common stop words
    const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'would', 'about'];
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    const uniqueWords = [...new Set(filteredWords)];
    return uniqueWords.slice(0, 5); // Return first 5 unique words
  };

  const getSentimentHistory = useCallback(async (userId: string) => {
    try {
      console.log('Local sentiment history not implemented for user:', userId);
      // For now, return empty array as we don't have persistent storage
      // In a real implementation, this could be stored in localStorage or sent to backend
      return [];
    } catch (error) {
      console.error('Error fetching sentiment history:', error);
      return [];
    }
  }, []);

  return {
    analyzeSentiment,
    getSentimentHistory,
    loading
  };
};
