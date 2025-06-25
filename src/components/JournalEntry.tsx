
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JournalEntryInsights from "./JournalEntryInsights";
import { useAuth } from "@/contexts/AuthContext";

interface JournalEntryProps {
  entry: {
    id: number;
    date: string;
    mood: string;
    title: string;
    content: string;
    aiInsight: string;
  };
}

const JournalEntry = ({ entry }: JournalEntryProps) => {
  const { user } = useAuth();

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "bg-green-100 text-green-800";
      case "sad": return "bg-blue-100 text-blue-800";
      case "neutral": return "bg-gray-100 text-gray-800";
      case "excited": return "bg-yellow-100 text-yellow-800";
      case "anxious": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full space-y-0">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#AD5E23] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{entry.title}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
            </div>
          </div>
          <Badge className={getMoodColor(entry.mood)}>
            {entry.mood}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{entry.content}</p>
          
          {entry.aiInsight && (
            <div className="bg-[#8766B4]/10 p-4 rounded-lg border-l-4 border-[#8766B4]">
              <h4 className="font-medium text-[#8766B4] mb-2">AI Insight</h4>
              <p className="text-sm text-muted-foreground">{entry.aiInsight}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* AI Insights for this specific journal entry */}
      {user?.id && (
        <JournalEntryInsights 
          journalEntryId={entry.id} 
          userId={user.id} 
        />
      )}
    </div>
  );
};

export default JournalEntry;
