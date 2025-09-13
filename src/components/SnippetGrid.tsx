import { SnippetCard } from "./SnippetCard";
import { Snippet } from "@/types/snippet";

interface SnippetGridProps {
  snippets: Snippet[];
  onEditSnippet: (snippet: Snippet) => void;
  onDeleteSnippet: (id: string) => void;
}

export const SnippetGrid = ({ snippets, onEditSnippet, onDeleteSnippet }: SnippetGridProps) => {
  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted/50 p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
        <p className="text-muted-foreground max-w-md">
          Start building your code library by creating your first snippet, or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={() => onEditSnippet(snippet)}
          onDelete={() => onDeleteSnippet(snippet.id)}
        />
      ))}
    </div>
  );
};