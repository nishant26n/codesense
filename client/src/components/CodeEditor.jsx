import { useState } from 'react';

const LANGUAGES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
];

export default function CodeEditor({ onSubmit, isLoading }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() && !isLoading) onSubmit(code, language);
  };

  const charCount = code.length;
  const charLimit = 10000;

  return (
    <div className="glass-card p-5 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Code Review</h2>
          <p className="text-xs text-gray-500 mt-0.5">Paste your code below for AI-powered analysis</p>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-surface-700 border border-white/[0.08] text-gray-300 text-sm rounded-lg px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your code here...\nfunction example() {\n  // AI will analyze bugs, performance & security\n}`}
          rows={16}
          maxLength={charLimit}
          className="w-full bg-surface-900 border border-white/[0.06] rounded-xl px-4 py-4
                     font-mono text-sm text-gray-200 placeholder-gray-600 resize-y
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     transition-all duration-200 leading-relaxed"
        />
        {/* Character counter */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs ${charCount > charLimit * 0.9 ? 'text-amber-400' : 'text-gray-600'}`}>
            {charCount.toLocaleString()} / {charLimit.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {code && (
            <button
              type="button"
              onClick={() => setCode('')}
              className="btn-ghost text-sm text-gray-500"
            >
              Clear
            </button>
          )}
        </div>

        <button
          id="analyze-btn"
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span>Analyze Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
