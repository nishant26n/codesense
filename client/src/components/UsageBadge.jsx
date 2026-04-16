import { useAuth } from '../context/AuthContext';

export default function UsageBadge() {
  const { usageInfo, user } = useAuth();

  if (!user) return null;

  const { usedToday, dailyLimit } = usageInfo;

  if (user.tier === 'pro') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
        <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
        </svg>
        <span className="text-xs font-semibold text-brand-400">Pro — Unlimited</span>
      </div>
    );
  }

  const remaining = Math.max(0, dailyLimit - usedToday);
  const pct = Math.min(100, (usedToday / dailyLimit) * 100);
  const isLow = remaining <= 1;
  const isExhausted = remaining === 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400 font-medium">Daily Reviews</span>
        <span className={`font-semibold ${isExhausted ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-gray-300'}`}>
          {usedToday} / {dailyLimit}
        </span>
      </div>
      <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden w-32">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isExhausted ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-brand-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isExhausted && (
        <p className="text-xs text-red-400">Limit reached — resets tomorrow</p>
      )}
    </div>
  );
}
