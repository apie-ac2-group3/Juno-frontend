
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import JournalEntry from "@/components/JournalEntry";
import SearchAndFilter from "@/components/SearchAndFilter";
import SentimentChart from "@/components/SentimentChart";
import AIInsights from "@/components/AIInsights";
import { useAuth } from "@/contexts/AuthContext";
import { useJournalEntries } from "@/hooks/useJournalEntries";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { entries, loading: entriesLoading } = useJournalEntries();
  const navigate = useNavigate();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Hardcoded sample entry - always show this when no real entries exist
  const sampleEntry = {
    id: 0,
    date: "2025-06-15",
    mood: "happy",
    title: "Very Pleasant",
    content: "Yeah! I've won $10k. I'm a Nepali Millionaire nowwww!",
    aiInsight: "Your journal entry has been saved successfully. Keep writing to track your progress!"
  };

  // Transform entries to match the expected format for JournalEntry component
  const transformedEntries = entries.map(entry => {
    const lines = entry.text?.split('\n') || [];
    const title = lines[0] || 'Untitled Entry';
    const content = lines.slice(2).join('\n') || '';
    const mood = entry.ai_suggestion?.mood || 'neutral';
    
    return {
      id: entry.journal_entry_id,
      date: entry.entry_date || entry.created_at.split('T')[0],
      mood: mood,
      title: title,
      content: content,
      aiInsight: "Your journal entry has been saved successfully. Keep writing to track your progress!"
    };
  });

  // Always include sample entry if no real entries, or show all entries if they exist
  const allEntries = transformedEntries.length > 0 ? transformedEntries : [sampleEntry];

  // Filter entries based on search and filters
  const filteredEntries = allEntries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMood = moodFilter === null || entry.mood === moodFilter;
    
    // Simple date filtering - for sample entry, always match if no real entries
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'week' && new Date(entry.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (entry.id === 0 && transformedEntries.length === 0); // Always show sample entry when no real entries
    
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
            <h1 className="text-3xl font-bold text-foreground">Welcome back to your journal</h1>
            <p className="text-muted-foreground">Track your thoughts, moods, and personal growth</p>
          </div>
          <Button asChild className="bg-[#8766B4] hover:bg-[#8766B4]/90">
            <Link to="/add-journal">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entries.length}</div>
              <p className="text-xs text-muted-foreground">Keep writing!</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Writing Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Coming soon!</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Coming soon!</p>
            </CardContent>
          </Card>
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
            <h2 className="text-2xl font-semibold">
              {transformedEntries.length === 0 ? "Recent Entries" : 
               filteredEntries.length === allEntries.length 
                ? "Recent Entries" 
                : `Filtered Entries (${filteredEntries.length})`}
            </h2>
            {filteredEntries.length !== allEntries.length && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setMoodFilter(null);
                  setDateFilter('all');
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
                📝 This is a sample journal entry to show you how your entries will look. Start writing your first entry!
              </p>
            </div>
          )}
          
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <JournalEntry key={entry.id} entry={entry} />
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
                    setSearchQuery('');
                    setMoodFilter(null);
                    setDateFilter('all');
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
