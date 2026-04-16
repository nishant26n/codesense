import { useAuth } from '../context/AuthContext';

export default function UsageBadge() {
  const { user } = useAuth();

  if (!user || user.tier !== 'pro') return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
      <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      </svg>
      <span className="text-xs font-semibold text-brand-400">Pro — Unlimited</span>
    </div>
  );
}
