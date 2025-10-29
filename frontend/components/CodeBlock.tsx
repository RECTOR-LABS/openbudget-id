interface CodeBlockProps {
  code: string;
  language?: 'bash' | 'typescript' | 'json';
}

export default function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const getLanguageLabel = () => {
    switch (language) {
      case 'bash':
        return 'Shell';
      case 'typescript':
        return 'TypeScript';
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
      // Bash syntax highlighting
      return code
        .replace(/(curl|GET|POST|PUT|DELETE|http|https)/g, '<span class="text-yellow-400">$1</span>')
        .replace(/(-X|-H|--data)/g, '<span class="text-cyan-400">$1</span>')
        .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>');
    } else if (lang === 'typescript') {
      // TypeScript syntax highlighting
      return code
        .replace(/\b(const|let|var|function|async|await|return|if|else|for|while|import|export|interface|type|class)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/'([^']+)'/g, '<span class="text-green-400">\'$1\'</span>')
        .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/`([^`]+)`/g, '<span class="text-green-400">`$1`</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
        .replace(/\b(fetch|console|JSON|Promise|Array|Object)\b/g, '<span class="text-yellow-400">$1</span>')
        .replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '.<span class="text-purple-400">$1</span>(')
        .replace(/\/\/(.+)$/gm, '<span class="text-gray-500">//$1</span>');
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
