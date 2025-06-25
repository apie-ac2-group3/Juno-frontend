
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, journalEntryId } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log('Starting sentiment analysis for journal entry:', journalEntryId);

    // Analyze sentiment using Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze the sentiment of this journal entry and return ONLY a JSON object in this exact format (no markdown, no code blocks, just raw JSON):
{
  "sentiment_label": "positive|neutral|negative",
  "confidence_score": 0.85,
  "emotions": {
    "joy": 0.7,
    "sadness": 0.1,
    "anger": 0.0,
    "fear": 0.1,
    "surprise": 0.1
  },
  "keywords": ["word1", "word2", "word3"],
  "insight": "A brief insight about the emotional state and themes in this entry."
}

Journal entry: "${text}"`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 512,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    let aiResponse = data.candidates[0].content.parts[0].text;
    console.log('Raw AI response:', aiResponse);
    
    // Clean up the response - remove markdown code blocks if present
    aiResponse = aiResponse.trim();
    if (aiResponse.startsWith('```json')) {
      aiResponse = aiResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (aiResponse.startsWith('```')) {
      aiResponse = aiResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    console.log('Cleaned AI response:', aiResponse);
    
    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse response:', aiResponse);
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    console.log('Parsed analysis result:', analysisResult);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get auth token from request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    // Use the service role key to get user from the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Inserting sentiment analysis for user:', user.id);

    // Insert sentiment analysis
    const { error: insertError } = await supabase
      .from('sentiment_analysis')
      .insert({
        journal_entry_id: journalEntryId,
        user_id: user.id,
        sentiment_label: analysisResult.sentiment_label,
        confidence_score: analysisResult.confidence_score,
        emotions: analysisResult.emotions,
        keywords: analysisResult.keywords
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Sentiment analysis inserted successfully');

    // Update journal entry with sentiment
    const { error: updateError } = await supabase
      .from('journal_entries')
      .update({
        sentiment_label: analysisResult.sentiment_label,
        confidence_score: analysisResult.confidence_score
      })
      .eq('journal_entry_id', journalEntryId);

    if (updateError) {
      console.error('Journal entry update error:', updateError);
      throw updateError;
    }

    console.log('Journal entry updated successfully');

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze sentiment',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
