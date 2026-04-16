import { useState } from 'react';
import type { ReviewFeedback, ReviewFinding } from '../types';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-600 hover:bg-surface-500 text-gray-300 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 90 ? '#22c55e' :
    score >= 70 ? '#6e56f5' :
    score >= 50 ? '#f59e0b' : '#ef4444';

  const label =
    score >= 90 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Fair' : 'Poor';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="6" className="stroke-surface-600" />
        <circle
          cx="44" cy="44" r={radius} fill="none" strokeWidth="6"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <text x="44" y="42" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Inter">{score}</text>
        <text x="44" y="57" textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="Inter">{label}</text>
      </svg>
    </div>
  );
}

type FindingType = 'bugs' | 'performance' | 'security';

function FindingCard({ item, type }: { item: ReviewFinding; type: FindingType }) {
  const severityClass: Record<string, string> = {
    high: 'severity-high',
    medium: 'severity-medium',
    low: 'severity-low',
  };
  const appliedSeverityClass = severityClass[item.severity?.toLowerCase()] ?? 'severity-low';

  const iconColorClass =
    type === 'bugs' ? 'bg-red-500/10 text-red-400' :
    type === 'performance' ? 'bg-amber-500/10 text-amber-400' :
    'bg-blue-500/10 text-blue-400';

  const icons: Record<FindingType, React.ReactNode> = {
    bugs: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    performance: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    security: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  };

  return (
    <div className="p-4 rounded-xl bg-surface-700/50 border border-white/[0.05] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1.5 rounded-lg ${iconColorClass}`}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="font-semibold text-sm text-white">{item.title}</h4>
            <span className={appliedSeverityClass}>{item.severity}</span>
            {item.line && (
              <span className="text-xs text-gray-500 font-mono">Line {item.line}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
          {(item.fix || item.suggestion) && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-surface-900/60 border border-white/[0.04]">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {item.fix ? '💡 Fix' : '⚡ Suggestion'}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{item.fix ?? item.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, type }: { title: string; items: ReviewFinding[] | undefined; type: FindingType }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
        <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-green-400 font-medium">No {title.toLowerCase()} found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <FindingCard key={i} item={item} type={type} />
      ))}
    </div>
  );
}

export default function ReviewResult({ feedback }: { feedback: ReviewFeedback | null }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!feedback) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bugs', label: `Bugs (${feedback.bugs?.length ?? 0})` },
    { id: 'performance', label: `Performance (${feedback.performance?.length ?? 0})` },
    { id: 'security', label: `Security (${feedback.security?.length ?? 0})` },
    { id: 'fixed', label: 'Fixed Code' },
  ];

  const totalIssues = (feedback.bugs?.length ?? 0) + (feedback.performance?.length ?? 0) + (feedback.security?.length ?? 0);
  const highCount = [
    ...(feedback.bugs ?? []),
    ...(feedback.performance ?? []),
    ...(feedback.security ?? []),
  ].filter(i => i.severity?.toLowerCase() === 'high').length;

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-brand-900/40 to-surface-800/40 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <ScoreRing score={feedback.score ?? 0} />
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Analysis Complete</h3>
              <p className="text-sm text-gray-400 max-w-md leading-relaxed">{feedback.summary}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {feedback.language && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-600 text-gray-400 font-mono">
                    {feedback.language}
                  </span>
                )}
                <span className="text-xs text-gray-500">{totalIssues} issue{totalIssues !== 1 ? 's' : ''} found</span>
                {highCount > 0 && (
                  <span className="text-xs text-red-400 font-medium">{highCount} high severity</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] px-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-brand-400 border-brand-500'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                <div className="text-2xl font-bold text-red-400">{feedback.bugs?.length ?? 0}</div>
                <div className="text-xs text-gray-500 mt-0.5">Bugs</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                <div className="text-2xl font-bold text-amber-400">{feedback.performance?.length ?? 0}</div>
                <div className="text-xs text-gray-500 mt-0.5">Performance</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <div className="text-2xl font-bold text-blue-400">{feedback.security?.length ?? 0}</div>
                <div className="text-xs text-gray-500 mt-0.5">Security</div>
              </div>
            </div>

            {/* Improvements */}
            {feedback.improvements && feedback.improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2.5">💡 General Improvements</h4>
                <ul className="flex flex-col gap-2">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-brand-500 mt-0.5 shrink-0">›</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className="animate-fade-in">
            <Section title="Bugs" items={feedback.bugs} type="bugs" />
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="animate-fade-in">
            <Section title="Performance Issues" items={feedback.performance} type="performance" />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="animate-fade-in">
            <Section title="Security Issues" items={feedback.security} type="security" />
          </div>
        )}

        {activeTab === 'fixed' && (
          <div className="animate-fade-in">
            {feedback.correctedCode ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">All issues fixed · ready to use</p>
                  <CopyButton text={feedback.correctedCode} />
                </div>
                <pre className="bg-surface-900 border border-white/[0.06] rounded-xl p-4 overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                  {feedback.correctedCode}
                </pre>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-green-400 font-medium">No corrections needed — code looks good</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
