
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import MoodSelector from "@/components/MoodSelector";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/contexts/AuthContext";
import { useJournalEntries } from "@/hooks/useJournalEntries";

const AddJournal = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { createEntry } = useJournalEntries();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !mood) {
      toast({
        title: "Please fill in all fields",
        description: "Title, content, and mood are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await createEntry(title, content, mood);
      
      toast({
        title: "Journal entry saved!",
        description: "Your thoughts have been recorded successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error saving entry",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDraft = () => {
    toast({
      title: "Draft saved!",
      description: "Your entry has been saved as a draft.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
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
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Journal Entry</h1>
          <p className="text-muted-foreground">
            Today, I give myself permission to pause, reflect, and express. My 
            thoughts are valid, my feelings matter, and through journaling, I 
            gain clarity and peace. This moment is mine, and I embrace it fully.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#AD5E23] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">J</span>
                  </div>
                  <span>Journal Entry</span>
                  <span className="ml-auto bg-black text-white px-3 py-1 rounded-full text-sm">
                    {new Date().getDate()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MoodSelector selectedMood={mood} onMoodChange={setMood} />
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Entry Title</Label>
                    <Input
                      id="title"
                      placeholder="Give your entry a title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Thoughts</Label>
                    <Textarea
                      id="content"
                      placeholder="Type or paste (⌘V) your text here or upload a document"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] text-base leading-relaxed"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="bg-[#8766B4] hover:bg-[#8766B4]/90 flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Entry"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDraft}
                      disabled={isSaving}
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Sidebar */}
          <div className="lg:col-span-1">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJournal;
