import { Search, FileCode } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  snippetCount: number;
}

export const SearchBar = ({ searchQuery, onSearchChange, snippetCount }: SearchBarProps) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search snippets by title, description, or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-muted/50 border-muted focus:bg-background transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileCode className="h-4 w-4" />
        <span>
          {snippetCount} snippet{snippetCount !== 1 ? 's' : ''} found
        </span>
        {searchQuery && (
          <span className="text-primary">
            for "{searchQuery}"
          </span>
        )}
      </div>
    </div>
  );
};