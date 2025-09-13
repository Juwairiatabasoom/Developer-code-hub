import { useState } from "react";
import { Edit, Trash2, Copy, Calendar, Hash, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Snippet } from "@/types/snippet";
import { formatDistanceToNow } from "date-fns";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: () => void;
  onDelete: () => void;
}

export const SnippetCard = ({ snippet, onEdit, onDelete }: SnippetCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast({
        title: "Copied to clipboard",
        description: "Code snippet has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the snippet to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: "🟨",
      typescript: "🔷",
      python: "🐍",
      css: "🎨",
      html: "🌐",
      bash: "💻",
      json: "📄",
      sql: "🗄️",
    };
    return icons[language.toLowerCase()] || "📝";
  };

  const truncatedCode = snippet.code.length > 200 
    ? snippet.code.substring(0, 200) + "..."
    : snippet.code;

  return (
    <Card className="group h-fit transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-muted hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {snippet.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {snippet.description}
            </p>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            {getLanguageIcon(snippet.language)} {snippet.language}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="code-block rounded-md p-3 mb-4">
          <SyntaxHighlighter
            code={isExpanded ? snippet.code : truncatedCode}
            language={snippet.language}
          />
        </div>

        {snippet.code.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center text-xs mb-3"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}

        <div className="flex flex-wrap gap-1">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Hash className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};