import { useState, useEffect } from "react";
import { apiClient, JournalEntry, AnalysisResponse } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useJournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!isAuthenticated) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching journal entries from backend");
      const data = await apiClient.getJournals();
      console.log("Fetched journal entries:", data);
      setEntries(data || []);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (title: string, content: string, mood: string) => {
    if (!isAuthenticated) throw new Error("User not authenticated");

    try {
      console.log("Creating journal entry:", { title, content, mood });

      // First create a blank journal entry
      const newEntry = await apiClient.createJournal();

      // Then update it with content
      const fullText = `${title}\n\n${content}`;
      const updatedEntry = await apiClient.updateJournal(
        newEntry.journal_entry_id,
        fullText
      );

      console.log("Created and updated journal entry:", updatedEntry);

      // Analyze the journal entry for sentiment and AI counsel
      let analysisResult: AnalysisResponse | null = null;
      try {
        console.log("Analyzing journal entry:", updatedEntry.journal_entry_id);
        analysisResult = await apiClient.analyzeJournal(
          updatedEntry.journal_entry_id
        );
        console.log("Analysis result:", analysisResult);
      } catch (analysisError) {
        console.error("Error analyzing journal entry:", analysisError);
        // Don't throw here - the entry was created successfully, analysis is optional
      }

      toast({
        title: "Entry Created",
        description: "Your journal entry has been saved successfully.",
      });

      // Refresh entries after creating
      await fetchEntries();
      return { entry: updatedEntry, analysis: analysisResult };
    } catch (err) {
      console.error("Error creating journal entry:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create journal entry. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateEntry = async (id: number, content: string) => {
    if (!isAuthenticated) throw new Error("User not authenticated");

    try {
      console.log("Updating journal entry:", { id, content });
      const updatedEntry = await apiClient.updateJournal(id, content);
      console.log("Updated journal entry:", updatedEntry);

      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated successfully.",
      });

      // Refresh entries after updating
      await fetchEntries();
      return updatedEntry;
    } catch (err) {
      console.error("Error updating journal entry:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update journal entry. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteEntry = async (id: number) => {
    if (!isAuthenticated) throw new Error("User not authenticated");

    try {
      // Optimistically remove the entry from the UI first
      setEntries((prev) =>
        prev.filter((entry) => entry.journal_entry_id !== id)
      );

      await apiClient.deleteJournal(id);

      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting journal entry:", err);

      // If the delete failed, refresh the entries to restore the UI state
      await fetchEntries();

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete journal entry. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [isAuthenticated]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
};
