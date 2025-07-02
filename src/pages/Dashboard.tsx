import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  Star,
  Trophy,
  Crown,
  Zap,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import JournalEntry from "@/components/JournalEntry";
import SearchAndFilter from "@/components/SearchAndFilter";
import SentimentChart from "@/components/SentimentChart";
import AIInsights from "@/components/AIInsights";
import JournalAnalysis from "@/components/JournalAnalysis";
import MoodTrendChart from "@/components/MoodTrendChart";
import { useAuth } from "@/contexts/AuthContext";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useToast } from "@/hooks/use-toast";
import {
  AnalysisResponse,
  JournalEntry as JournalEntryType,
} from "@/api/client";

// Badge configuration
const BADGES = [
  {
    name: "Starter",
    requirement: 1,
    icon: Zap,
    color: "bg-green-500",
    description: "First journal entry!",
  },
  {
    name: "Scribe",
    requirement: 7,
    icon: Award,
    color: "bg-blue-500",
    description: "7 journal entries",
  },
  {
    name: "Author",
    requirement: 30,
    icon: Star,
    color: "bg-purple-500",
    description: "30 journal entries",
  },
  {
    name: "Historian",
    requirement: 100,
    icon: Trophy,
    color: "bg-orange-500",
    description: "100 journal entries",
  },
  {
    name: "Legend",
    requirement: 365,
    icon: Crown,
    color: "bg-yellow-500",
    description: "365 journal entries",
  },
];

// Helper function to get earned badges
const getEarnedBadges = (journalCount: number) => {
  return BADGES.filter((badge) => journalCount >= badge.requirement);
};

// Helper function to get next badge
const getNextBadge = (journalCount: number) => {
  return BADGES.find((badge) => journalCount < badge.requirement);
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<{
    entry: JournalEntryType;
    analysis: AnalysisResponse;
  } | null>(null);
  const [deletedEntryIds, setDeletedEntryIds] = useState<Set<number>>(
    new Set()
  );

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { entries, loading: entriesLoading } = useJournalEntries();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Debug logging
  console.log("Dashboard render - entries count:", entries.length);
  console.log(
    "Dashboard render - entries:",
    entries.map((e) => ({
      id: e.journal_entry_id,
      text: e.text?.substring(0, 50),
    }))
  );

  // Handle navigation state from AddJournal
  useEffect(() => {
    if (location.state) {
      const {
        newEntry,
        analysis,
        showAnalysis: shouldShowAnalysis,
        showSuccess,
      } = location.state;

      if (shouldShowAnalysis && newEntry && analysis) {
        setAnalysisData({ entry: newEntry, analysis });
        setShowAnalysis(true);
        toast({
          title: "Entry Saved Successfully!",
          description:
            "Your journal has been analyzed. See the insights below.",
        });
      } else if (showSuccess && newEntry) {
        toast({
          title: "Entry Saved!",
          description: "Your journal entry has been saved successfully.",
        });
      }

      // Clear the location state
      navigate("/dashboard", { replace: true });
    }
  }, [location.state, navigate, toast]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Hardcoded sample entry - always show this when no real entries exist
  const sampleEntry = {
    id: 0,
    date: "2025-06-15",
    mood: "happy",
    title: "Very Pleasant",
    content: "Yeah! I've won $10k. I'm a Nepali Millionaire nowwww!",
    aiInsight:
      "Your journal entry has been saved successfully. Keep writing to track your progress!",
  };

  // Handle optimistic delete
  const handleOptimisticDelete = (entryId: number) => {
    setDeletedEntryIds((prev) => new Set([...prev, entryId]));
  };

  // Reset deleted entries when entries change (successful delete from backend)
  useEffect(() => {
    setDeletedEntryIds(new Set());
  }, [entries]);

  // Transform entries to match the expected format for JournalEntry component
  const transformedEntries = entries
    .filter((entry) => !deletedEntryIds.has(entry.journal_entry_id)) // Filter out optimistically deleted entries
    .map((entry) => {
      const lines = entry.text?.split("\n") || [];
      const title = lines[0] || "Untitled Entry";
      const content = lines.slice(2).join("\n") || "";
      const mood = entry.ai_suggestion?.mood || "neutral";

      return {
        id: entry.journal_entry_id,
        date: entry.entry_date || entry.created_at.split("T")[0],
        mood: mood,
        title: title,
        content: content,
        aiInsight:
          entry.ai_suggestion?.counsel ||
          "Your journal entry has been saved successfully. Keep writing to track your progress!",
        sentimentScore: entry.sentiment_score,
        // Add created_at for sorting purposes
        created_at: entry.created_at,
      };
    })
    .sort((a, b) => {
      // Sort by created_at in descending order (latest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  // Always include sample entry if no real entries, or show all entries if they exist
  const allEntries =
    transformedEntries.length > 0 ? transformedEntries : [sampleEntry];

  // Filter entries based on search and filters
  const filteredEntries = allEntries.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMood = moodFilter === null || entry.mood === moodFilter;

    // Enhanced date filtering logic
    const matchesDate = (() => {
      if (dateFilter === "all") return true;

      // Always show sample entry when no real entries
      if (entry.id === 0 && transformedEntries.length === 0) return true;

      const entryDate = new Date(entry.date);
      const now = new Date();

      switch (dateFilter) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesMood && matchesDate;
  });

  if (authLoading || entriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto p-6 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back to your journal
            </h1>
            <p className="text-muted-foreground">
              Track your thoughts, moods, and personal growth
            </p>
          </div>
          <Button asChild className="bg-[#8766B4] hover:bg-[#8766B4]/90">
            <Link to="/add-journal">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>

        {/* Analysis Results (shown when navigating from AddJournal) */}
        {showAnalysis && analysisData && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Latest Entry Analysis
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalysis(false)}
              >
                Dismiss
              </Button>
            </div>

            {/* Show the latest entry */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Latest Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      analysisData.entry.created_at
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-sm">{analysisData.entry.text}</div>
                </div>
              </CardContent>
            </Card>

            {/* Show the analysis */}
            <JournalAnalysis
              analysisResult={analysisData.analysis}
              isLoading={false}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entries.length}</div>
              <p className="text-xs text-muted-foreground">Keep writing!</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Writing Streak
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Badges Display */}
                <div className="space-y-3">
                  <div className="text-lg font-semibold">Badges Earned</div>

                  {/* Earned Badges */}
                  <div className="flex flex-wrap gap-2">
                    {getEarnedBadges(entries.length).length > 0 ? (
                      getEarnedBadges(entries.length).map((badge) => {
                        const IconComponent = badge.icon;
                        return (
                          <Badge
                            key={badge.name}
                            className={`${badge.color} text-white flex items-center gap-1 px-2 py-1`}
                            title={badge.description}
                          >
                            <IconComponent className="w-3 h-3" />
                            {badge.name}
                          </Badge>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No badges earned yet
                      </div>
                    )}
                  </div>

                  {/* Next Badge Progress */}
                  {getNextBadge(entries.length) && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Next Badge: {getNextBadge(entries.length)?.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                (entries.length /
                                  (getNextBadge(entries.length)?.requirement ||
                                    1)) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entries.length}/
                          {getNextBadge(entries.length)?.requirement}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* All badges earned message */}
                  {!getNextBadge(entries.length) && entries.length >= 365 && (
                    <div className="text-sm text-purple-600 font-medium">
                      🎉 Congratulations! You've earned all badges!
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <MoodTrendChart />
        </div>

        {/* AI Insights and Sentiment Analysis */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AIInsights />
          </div>
          <div className="lg:col-span-2">
            <SentimentChart />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter
            onSearch={setSearchQuery}
            onFilterMood={setMoodFilter}
            onFilterDate={setDateFilter}
          />
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                {transformedEntries.length === 0
                  ? "Recent Entries"
                  : filteredEntries.length === allEntries.length
                  ? "Recent Entries"
                  : `Filtered Entries (${filteredEntries.length})`}
              </h2>
              {transformedEntries.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Sorted by newest first
                </p>
              )}
            </div>
            {filteredEntries.length !== allEntries.length && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setMoodFilter(null);
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Always show sample entry notification when no real entries */}
          {transformedEntries.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                📝 This is a sample journal entry to show you how your entries
                will look. Start writing your first entry!
              </p>
            </div>
          )}

          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <JournalEntry
                key={entry.id}
                entry={entry}
                onDelete={handleOptimisticDelete}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No entries match your current filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setMoodFilter(null);
                    setDateFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
