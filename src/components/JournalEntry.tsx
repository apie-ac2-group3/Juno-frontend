import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import JournalEntryInsights from "./JournalEntryInsights";
import { useAuth } from "@/contexts/AuthContext";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useState } from "react";

interface JournalEntryProps {
  entry: {
    id: number;
    date: string;
    mood: string;
    title: string;
    content: string;
    aiInsight: string;
  };
  onDelete?: (id: number) => void; // Callback for when entry is deleted
}

const JournalEntry = ({ entry, onDelete }: JournalEntryProps) => {
  const { user } = useAuth();
  const { deleteEntry } = useJournalEntries();
  const [isDeleting, setIsDeleting] = useState(false);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-100 text-green-800";
      case "sad":
        return "bg-blue-100 text-blue-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      case "excited":
        return "bg-yellow-100 text-yellow-800";
      case "anxious":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (entry.id === 0) {
      // Don't allow deletion of sample entry
      return;
    }

    try {
      setIsDeleting(true);

      // Call the onDelete callback immediately for optimistic UI update
      if (onDelete) {
        onDelete(entry.id);
      }

      await deleteEntry(entry.id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      // If deletion fails and we have a callback, we might want to restore the UI
      // For now, the hook will handle refreshing the entries
    } finally {
      setIsDeleting(false);
    }
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
              <p className="text-sm text-muted-foreground">
                {formatDate(entry.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getMoodColor(entry.mood)}>{entry.mood}</Badge>
            {/* Delete button - only show for real entries, not sample entry */}
            {entry.id !== 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this journal entry? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {entry.content}
          </p>

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
        <JournalEntryInsights journalEntryId={entry.id} userId={user.id} />
      )}
    </div>
  );
};

export default JournalEntry;
