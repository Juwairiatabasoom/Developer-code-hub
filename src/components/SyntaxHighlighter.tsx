interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export const SyntaxHighlighter = ({ code, language }: SyntaxHighlighterProps) => {
  const getTokens = (code: string, language: string) => {
    // Simple syntax highlighting patterns
    const patterns = {
      javascript: [
        { regex: /\/\/.*$/gm, className: 'syntax-comment' },
        { regex: /\/\*[\s\S]*?\*\//gm, className: 'syntax-comment' },
        { regex: /"[^"]*"/g, className: 'syntax-string' },
        { regex: /'[^']*'/g, className: 'syntax-string' },
        { regex: /`[^`]*`/g, className: 'syntax-string' },
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await)\b/g, className: 'syntax-keyword' },
        { regex: /\b\d+\.?\d*\b/g, className: 'syntax-number' },
        { regex: /\b[A-Z][a-zA-Z0-9]*\(/g, className: 'syntax-function' },
      ],
      typescript: [
        { regex: /\/\/.*$/gm, className: 'syntax-comment' },
        { regex: /\/\*[\s\S]*?\*\//gm, className: 'syntax-comment' },
        { regex: /"[^"]*"/g, className: 'syntax-string' },
        { regex: /'[^']*'/g, className: 'syntax-string' },
        { regex: /`[^`]*`/g, className: 'syntax-string' },
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await|interface|type|enum)\b/g, className: 'syntax-keyword' },
        { regex: /\b\d+\.?\d*\b/g, className: 'syntax-number' },
        { regex: /\b[A-Z][a-zA-Z0-9]*\(/g, className: 'syntax-function' },
      ],
      python: [
        { regex: /#.*$/gm, className: 'syntax-comment' },
        { regex: /"[^"]*"/g, className: 'syntax-string' },
        { regex: /'[^']*'/g, className: 'syntax-string' },
        { regex: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|and|or|not|in|is)\b/g, className: 'syntax-keyword' },
        { regex: /\b\d+\.?\d*\b/g, className: 'syntax-number' },
        { regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g, className: 'syntax-function' },
      ],
      css: [
        { regex: /\/\*[\s\S]*?\*\//gm, className: 'syntax-comment' },
        { regex: /"[^"]*"/g, className: 'syntax-string' },
        { regex: /'[^']*'/g, className: 'syntax-string' },
        { regex: /\b(color|background|margin|padding|border|font|display|position|width|height|top|left|right|bottom)\b/g, className: 'syntax-keyword' },
        { regex: /#[0-9a-fA-F]{3,6}\b/g, className: 'syntax-string' },
        { regex: /\b\d+(?:px|em|rem|%|vh|vw)?\b/g, className: 'syntax-number' },
      ],
      bash: [
        { regex: /#.*$/gm, className: 'syntax-comment' },
        { regex: /"[^"]*"/g, className: 'syntax-string' },
        { regex: /'[^']*'/g, className: 'syntax-string' },
        { regex: /\b(git|npm|cd|ls|mkdir|rm|cp|mv|echo|cat|grep|find|sed|awk)\b/g, className: 'syntax-keyword' },
        { regex: /--?\w+/g, className: 'syntax-variable' },
      ]
    };

    const langPatterns = patterns[language as keyof typeof patterns] || patterns.javascript;
    let highlightedCode = code;

    // Apply highlighting patterns
    langPatterns.forEach(({ regex, className }) => {
      highlightedCode = highlightedCode.replace(regex, (match) => {
        return `<span class="${className}">${match}</span>`;
      });
    });

    return highlightedCode;
  };

  const highlightedCode = getTokens(code, language);

  return (
    <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};