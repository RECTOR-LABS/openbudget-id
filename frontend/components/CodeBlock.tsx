interface CodeBlockProps {
  code: string;
  language?: 'bash' | 'typescript' | 'javascript' | 'json';
}

export default function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const getLanguageLabel = () => {
    switch (language) {
      case 'bash':
        return 'Shell';
      case 'typescript':
        return 'TypeScript';
      case 'javascript':
        return 'JavaScript';
      case 'json':
        return 'JSON';
      default:
        return 'Code';
    }
  };

  const getGradientColors = () => {
    switch (language) {
      case 'bash':
        return 'from-slate-900 via-slate-800 to-gray-900';
      case 'typescript':
      case 'javascript':
        return 'from-blue-950 via-indigo-950 to-violet-950';
      case 'json':
        return 'from-emerald-950 via-teal-950 to-cyan-950';
      default:
        return 'from-gray-900 via-gray-800 to-gray-900';
    }
  };

  const getBorderColor = () => {
    switch (language) {
      case 'bash':
        return 'border-slate-600';
      case 'typescript':
      case 'javascript':
        return 'border-blue-700';
      case 'json':
        return 'border-emerald-700';
      default:
        return 'border-gray-700';
    }
  };

  const getHeaderGradient = () => {
    switch (language) {
      case 'bash':
        return 'bg-gradient-to-r from-slate-800 to-gray-800';
      case 'typescript':
      case 'javascript':
        return 'bg-gradient-to-r from-blue-900 to-indigo-900';
      case 'json':
        return 'bg-gradient-to-r from-emerald-900 to-teal-900';
      default:
        return 'bg-gray-800';
    }
  };

  const highlightSyntax = (code: string, lang: string) => {
    if (lang === 'json') {
      // JSON syntax highlighting
      return code
        .replace(/"([^"]+)":/g, '<span class="text-cyan-400">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>')
        .replace(/: (true|false|null)/g, ': <span class="text-purple-400">$1</span>');
    } else if (lang === 'bash') {
      // Bash syntax highlighting - use markers to prevent regex interference
      let highlighted = code;

      // Step 1: Replace keywords
      highlighted = highlighted.replace(/(curl|GET|POST|PUT|DELETE|PATCH)/gi, '{{KEYWORD::$1}}');
      highlighted = highlighted.replace(/(https?):\/\//gi, '{{PROTOCOL::$1}}://');

      // Step 2: Replace flags
      highlighted = highlighted.replace(/(-X|-H|-d|--data-raw|--data)/g, '{{FLAG::$1}}');

      // Step 3: Replace quoted strings (but not URLs)
      highlighted = highlighted.replace(/"([^"]*?)"/g, (match, content) => {
        if (content.includes('://') || content.includes('/api/')) {
          return `{{STRING::${content}}}`;
        }
        return `{{STRING::${content}}}`;
      });

      // Step 4: Replace standalone numbers (not in URLs or paths)
      highlighted = highlighted.replace(/(?<![:/\w-])(\d+)(?![:/\w-])/g, '{{NUMBER::$1}}');

      // Step 5: Convert markers to actual HTML spans
      highlighted = highlighted
        .replace(/\{\{KEYWORD::([^}]+)\}\}/g, '<span class="text-yellow-400">$1</span>')
        .replace(/\{\{PROTOCOL::([^}]+)\}\}/g, '<span class="text-cyan-400">$1</span>')
        .replace(/\{\{FLAG::([^}]+)\}\}/g, '<span class="text-cyan-400">$1</span>')
        .replace(/\{\{STRING::([^}]*?)\}\}/g, '<span class="text-green-400">"$1"</span>')
        .replace(/\{\{NUMBER::([^}]+)\}\}/g, '<span class="text-orange-400">$1</span>');

      return highlighted;
    } else if (lang === 'typescript' || lang === 'javascript') {
      // TypeScript/JavaScript syntax highlighting - use markers to prevent regex interference
      let highlighted = code;

      // Step 1: Protect strings and comments first
      highlighted = highlighted.replace(/\/\/(.+)$/gm, '{{COMMENT::$1}}');
      highlighted = highlighted.replace(/'([^']+)'/g, '{{SSTRING::$1}}');
      highlighted = highlighted.replace(/"([^"]+)"/g, '{{DSTRING::$1}}');
      highlighted = highlighted.replace(/`([^`]+)`/g, '{{TSTRING::$1}}');

      // Step 2: Replace keywords
      highlighted = highlighted.replace(/\b(const|let|var|function|async|await|return|if|else|for|while|import|export|interface|type|class)\b/g, '{{KEYWORD::$1}}');

      // Step 3: Replace built-in objects
      highlighted = highlighted.replace(/\b(fetch|console|JSON|Promise|Array|Object)\b/g, '{{BUILTIN::$1}}');

      // Step 4: Replace method calls
      highlighted = highlighted.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '.{{METHOD::$1}}(');

      // Step 5: Replace numbers (only standalone, not in markers)
      highlighted = highlighted.replace(/(?<!::)\b(\d+)\b(?!::)/g, '{{NUMBER::$1}}');

      // Step 6: Convert markers to HTML spans
      highlighted = highlighted
        .replace(/\{\{COMMENT::([^}]+)\}\}/g, '<span class="text-gray-500">//$1</span>')
        .replace(/\{\{SSTRING::([^}]+)\}\}/g, '<span class="text-green-400">\'$1\'</span>')
        .replace(/\{\{DSTRING::([^}]+)\}\}/g, '<span class="text-green-400">"$1"</span>')
        .replace(/\{\{TSTRING::([^}]+)\}\}/g, '<span class="text-green-400">`$1`</span>')
        .replace(/\{\{KEYWORD::([^}]+)\}\}/g, '<span class="text-blue-400">$1</span>')
        .replace(/\{\{BUILTIN::([^}]+)\}\}/g, '<span class="text-yellow-400">$1</span>')
        .replace(/\{\{METHOD::([^}]+)\}\}/g, '<span class="text-purple-400">$1</span>')
        .replace(/\{\{NUMBER::([^}]+)\}\}/g, '<span class="text-orange-400">$1</span>');

      return highlighted;
    }
    return code;
  };

  return (
    <div className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${getGradientColors()} border ${getBorderColor()} shadow-lg`}>
      <div className={`flex items-center justify-between px-4 py-2 ${getHeaderGradient()} border-b ${getBorderColor()}`}>
        <span className="text-xs font-semibold text-white">{getLanguageLabel()}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
        >
          📋 Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code
          className="font-mono whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightSyntax(code, language) }}
        />
      </pre>
    </div>
  );
}
