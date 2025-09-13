import { useState, useEffect } from "react";
import { X, Save, Code2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Snippet } from "@/types/snippet";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface SnippetEditorProps {
  snippet: Snippet | null;
  onSave: (snippetData: Omit<Snippet, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  onClose: () => void;
}

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'css', 'html', 'bash', 'json', 'sql', 'java', 'csharp', 'php', 'ruby', 'go', 'rust'
];

export const SnippetEditor = ({ snippet, onSave, onClose }: SnippetEditorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description || "");
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags);
    }
  }, [snippet]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      tags
    });
  };

  const isValid = title.trim() && code.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Editor Panel */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {snippet ? "Edit Snippet" : "Create New Snippet"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!showPreview ? (
                  <>
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter snippet title..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language *</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of what this snippet does..."
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag} size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Code Editor */}
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="code">Code *</Label>
                      <Textarea
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your code here..."
                        className="font-mono text-sm min-h-[300px] resize-none"
                        required
                      />
                    </div>
                  </>
                ) : (
                  /* Preview Panel */
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{title || "Untitled Snippet"}</CardTitle>
                        {description && (
                          <p className="text-muted-foreground">{description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {language.charAt(0).toUpperCase() + language.slice(1)}
                          </Badge>
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="code-block rounded-md p-4">
                          <SyntaxHighlighter code={code} language={language} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t p-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid}>
                  <Save className="h-4 w-4 mr-2" />
                  {snippet ? "Update" : "Create"} Snippet
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};