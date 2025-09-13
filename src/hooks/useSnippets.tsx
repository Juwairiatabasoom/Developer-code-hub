import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Snippet, CreateSnippetData, UpdateSnippetData } from "@/types/snippet";

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSnippets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load snippets",
        variant: "destructive",
      });
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSnippet = async (snippetData: CreateSnippetData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('snippets')
        .insert([{
          ...snippetData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Snippet created successfully",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create snippet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSnippet = async (id: string, updates: UpdateSnippetData) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => prev.map(snippet => 
        snippet.id === id ? { ...snippet, ...data } : snippet
      ));
      
      toast({
        title: "Success",
        description: "Snippet updated successfully",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update snippet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
      toast({
        title: "Success",
        description: "Snippet deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete snippet",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  return {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    refetch: fetchSnippets,
  };
};