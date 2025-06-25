
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSentimentAnalysis } from './useSentimentAnalysis';
import { useToast } from '@/hooks/use-toast';

export interface JournalEntry {
  journal_entry_id: number;
  user_id: string;
  entry_date: string;
  text: string;
  sentiment_score: number | null;
  ai_suggestion: any;
  chat_log: any;
  status: string;
  word_count: number | null;
  created_at: string;
  updated_at: string;
  user_prompt_id: number | null;
}

export const useJournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { analyzeSentiment } = useSentimentAnalysis();
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching journal entries for user:', user.id);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched journal entries:', data);
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (title: string, content: string, mood: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const fullText = `${title}\n\n${content}`;
      
      console.log('Creating journal entry:', { title, content, mood, wordCount });
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          text: fullText,
          word_count: wordCount,
          ai_suggestion: { mood: mood },
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Created journal entry:', data);
      
      // Trigger sentiment analysis in the background
      try {
        console.log('Starting sentiment analysis for entry:', data.journal_entry_id);
        await analyzeSentiment(fullText, data.journal_entry_id);
        console.log('Sentiment analysis completed for entry:', data.journal_entry_id);
        
        toast({
          title: "Entry Created",
          description: "Your journal entry has been saved and analyzed for sentiment insights.",
        });
      } catch (sentimentError) {
        console.error('Sentiment analysis failed:', sentimentError);
        toast({
          title: "Entry Created",
          description: "Your journal entry has been saved, but sentiment analysis failed.",
          variant: "destructive",
        });
      }
      
      // Refresh entries after creating
      await fetchEntries();
      return data;
    } catch (err) {
      console.error('Error creating journal entry:', err);
      toast({
        title: "Error",
        description: "Failed to create journal entry. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    error,
    createEntry,
    refetch: fetchEntries
  };
};
