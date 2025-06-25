
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterMood: (mood: string | null) => void;
  onFilterDate: (period: string) => void;
}

const SearchAndFilter = ({ onSearch, onFilterMood, onFilterDate }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😄' },
    { value: 'content', label: 'Content', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'sad', label: 'Sad', emoji: '😔' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' }
  ];

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleMoodFilter = (mood: string) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onFilterMood(newMood);
  };

  const handlePeriodFilter = (period: string) => {
    setSelectedPeriod(period);
    onFilterDate(period);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search your journal entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>

        {/* Mood Filter */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Filter by Mood</h4>
          <div className="flex gap-2 flex-wrap">
            {moods.map((mood) => (
              <Badge
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleMoodFilter(mood.value)}
              >
                {mood.emoji} {mood.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Filter by Time</h4>
          <div className="flex gap-2 flex-wrap">
            {periods.map((period) => (
              <Badge
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handlePeriodFilter(period.value)}
              >
                {period.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
