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

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400">{getLanguageLabel()}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700 cursor-pointer"
        >
          📋 Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-100 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
