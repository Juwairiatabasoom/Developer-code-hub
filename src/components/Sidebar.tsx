import { X, Tag, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
}

export const Sidebar = ({ isOpen, onClose, tags, selectedTags, onTagSelect }: SidebarProps) => {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagSelect([]);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 
        transform border-r bg-card transition-transform duration-300 ease-smooth
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Filter by Tags</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedTags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Active Filters ({selectedTags.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllTags}
                      className="h-auto p-1 text-xs text-destructive hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer bg-primary hover:bg-primary/80"
                        onClick={() => handleTagClick(tag)}
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Available Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags
                    .filter(tag => !selectedTags.includes(tag))
                    .sort()
                    .map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleTagClick(tag)}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};