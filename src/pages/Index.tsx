import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SnippetGrid } from "@/components/SnippetGrid";
import { SnippetEditor } from "@/components/SnippetEditor";
import { SearchBar } from "@/components/SearchBar";
import { Snippet, CreateSnippetData } from "@/types/snippet";
import { useAuth } from "@/hooks/useAuth";
import { useSnippets } from "@/hooks/useSnippets";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { snippets, loading: snippetsLoading, createSnippet, updateSnippet, deleteSnippet } = useSnippets();
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => snippet.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleCreateSnippet = () => {
    setSelectedSnippet(null);
    setIsEditorOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsEditorOpen(true);
  };

  const handleSaveSnippet = async (snippetData: CreateSnippetData) => {
    try {
      if (selectedSnippet) {
        // Update existing snippet
        await updateSnippet(selectedSnippet.id, snippetData);
      } else {
        // Create new snippet
        await createSnippet(snippetData);
      }
      setIsEditorOpen(false);
      setSelectedSnippet(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    await deleteSnippet(id);
  };

  const allTags = Array.from(new Set(snippets.flatMap(s => s.tags)));

  if (authLoading || (user && snippetsLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCreateSnippet={handleCreateSnippet}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          tags={allTags}
          selectedTags={selectedTags}
          onTagSelect={setSelectedTags}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <div className="p-6 space-y-6">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              snippetCount={filteredSnippets.length}
            />
            
            <SnippetGrid 
              snippets={filteredSnippets}
              onEditSnippet={handleEditSnippet}
              onDeleteSnippet={handleDeleteSnippet}
            />
          </div>
        </main>
      </div>

      {isEditorOpen && (
        <SnippetEditor
          snippet={selectedSnippet}
          onSave={handleSaveSnippet}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedSnippet(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;