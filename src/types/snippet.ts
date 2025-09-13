export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateSnippetData extends Omit<Snippet, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface UpdateSnippetData extends Partial<CreateSnippetData> {}