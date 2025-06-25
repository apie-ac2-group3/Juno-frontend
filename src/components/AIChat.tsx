
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to help you reflect on your thoughts and feelings. What's on your mind today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        content: msg.content,
        isUser: msg.isUser
      }));

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: inputMessage,
          conversationHistory 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error calling AI:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Chat Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#8766B4]">Chat with AI ↗</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-[#8766B4] text-white ml-4'
                    : 'bg-muted text-muted-foreground mr-4'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted p-3 rounded-lg mr-4">
                <p className="text-sm text-muted-foreground">AI is thinking...</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder="Ask me anything about journaling or your feelings..."
              className="min-h-[100px]"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              className="w-full bg-[#8766B4] hover:bg-[#8766B4]/90"
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
