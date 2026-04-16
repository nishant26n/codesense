import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubmitReview } from '../api/queries';
import CodeEditor from '../components/CodeEditor';
import ReviewResult from '../components/ReviewResult';
import HistoryPanel from '../components/HistoryPanel';
import type { ReviewFeedback, ReviewRecord } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { mutateAsync: submitReview, isPending } = useSubmitReview();

  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);
  const [error, setError] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const handleSubmit = async (code: string, language: string) => {
    setError('');
    setFeedback(null);
    setSelectedHistoryId(null);

    try {
      const data = await submitReview({ code, language });
      setFeedback(data.feedback);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
      const msg = axiosErr.response?.data?.error;
      setError(msg ?? 'Analysis failed. Please try again.');
    }
  };

  const handleSelectHistory = (review: ReviewRecord) => {
    setSelectedHistoryId(review.id);
    setFeedback(review.ai_feedback);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-900">
      {/* Dashboard header */}
      <div className="border-b border-white/[0.06] bg-surface-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                Welcome back, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Paste your code below to get an instant AI review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar — History */}
          <aside className="hidden lg:flex lg:flex-col w-72 shrink-0" style={{ height: 'calc(100vh - 10rem)' }}>
            <HistoryPanel
              onSelectReview={handleSelectHistory}
              selectedId={selectedHistoryId}
            />
          </aside>

          {/* Main panel */}
          <main className="flex-1 min-w-0 flex flex-col gap-5">
            <CodeEditor onSubmit={handleSubmit} isLoading={isPending} />

            {/* Error state */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-fade-in">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Loading state */}
            {isPending && (
              <div className="glass-card p-8 text-center animate-fade-in">
                <div className="relative inline-flex mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/30 animate-ping" />
                </div>
                <h3 className="text-white font-semibold mb-2">Analyzing your code...</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  AI is scanning for bugs, performance issues, and security vulnerabilities
                </p>
                <div className="flex justify-center gap-1 mt-5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {!isPending && feedback && (
              <ReviewResult feedback={feedback} />
            )}

            {/* Empty state */}
            {!isPending && !feedback && !error && (
              <div className="glass-card p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-gray-400 font-medium mb-1">Ready to analyze</h3>
                <p className="text-sm text-gray-600">Paste any code and hit "Analyze Code" to get started</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
