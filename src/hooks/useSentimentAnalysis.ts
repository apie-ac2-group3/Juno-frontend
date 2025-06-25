import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      console.log('Starting sentiment analysis for entry:', journalEntryId);
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { text, journalEntryId }
      });

      if (error) {
        console.error('Sentiment analysis error:', error);
        // Create a fallback sentiment analysis record
        await createFallbackSentimentRecord(text, journalEntryId);
        return null;
      }

      console.log('Sentiment analysis completed:', data);
      
      toast({
        title: "Sentiment Analysis Complete",
        description: "Your journal entry has been analyzed for emotional insights.",
      });

      return data?.analysis;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      // Create a fallback sentiment analysis record
      await createFallbackSentimentRecord(text, journalEntryId);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createFallbackSentimentRecord = async (text: string, journalEntryId: number) => {
    try {
      // Create a simple fallback sentiment analysis
      const textLength = text.length;
      const positiveWords = ['happy', 'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'joy'];
      const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed'];
      
      const lowercaseText = text.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
      
      let sentiment = 'neutral';
      let confidence = 0.6;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        confidence = Math.min(0.8, 0.5 + (positiveCount * 0.1));
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        confidence = Math.min(0.8, 0.5 + (negativeCount * 0.1));
      }

      console.log('Creating fallback sentiment record:', { sentiment, confidence, journalEntryId });

      const { data, error } = await supabase
        .from('sentiment_analysis')
        .insert({
          journal_entry_id: journalEntryId,
          sentiment_label: sentiment,
          confidence_score: confidence,
          emotions: {
            joy: sentiment === 'positive' ? confidence : 0.2,
            sadness: sentiment === 'negative' ? confidence : 0.2,
            anger: sentiment === 'negative' ? confidence * 0.5 : 0.1,
            fear: 0.1,
            surprise: 0.2
          },
          keywords: extractSimpleKeywords(text)
        });

      if (error) {
        console.error('Error creating fallback sentiment record:', error);
      } else {
        console.log('Fallback sentiment record created:', data);
      }
    } catch (error) {
      console.error('Error in createFallbackSentimentRecord:', error);
    }
  };

  const extractSimpleKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 5); // Return first 5 unique words
  };

  const getSentimentHistory = useCallback(async (userId: string) => {
    try {
      console.log('Fetching sentiment history for user:', userId);
      
      const { data, error } = await supabase
        .from('sentiment_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('analyzed_at', { ascending: false });

      if (error) {
        console.error('Error fetching sentiment history:', error);
        throw error;
      }
      
      console.log('Raw sentiment data from database:', data);
      
      if (!data || data.length === 0) {
        console.log('No sentiment data found for user');
        return [];
      }
      
      // Transform the data to match our interface
      const transformedData: SentimentAnalysis[] = data.map(item => ({
        id: item.id,
        journal_entry_id: item.journal_entry_id,
        sentiment_label: item.sentiment_label,
        confidence_score: item.confidence_score,
        emotions: item.emotions as {
          joy: number;
          sadness: number;
          anger: number;
          fear: number;
          surprise: number;
        } | null,
        keywords: item.keywords || [],
        analyzed_at: item.analyzed_at
      }));

      console.log('Transformed sentiment data:', transformedData);
      return transformedData;
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
