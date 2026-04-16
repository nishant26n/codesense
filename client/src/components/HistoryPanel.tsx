import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import type { ReviewRecord } from "../types";

function LanguageDot({ language }: { language: string }) {
  const colors: Record<string, string> = {
    javascript: "bg-yellow-400",
    typescript: "bg-blue-400",
    python: "bg-green-400",
    java: "bg-orange-400",
    cpp: "bg-blue-500",
    csharp: "bg-purple-400",
    go: "bg-cyan-400",
    rust: "bg-orange-500",
    php: "bg-indigo-400",
    ruby: "bg-red-400",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[language?.toLowerCase()] ?? "bg-gray-500"} shrink-0`}
    />
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-green-400"
      : score >= 70
        ? "text-brand-400"
        : score >= 50
          ? "text-amber-400"
          : "text-red-400";
  return (
    <span className={`text-sm font-bold font-mono ${color}`}>{score}</span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface HistoryPanelProps {
  onSelectReview: (review: ReviewRecord) => void;
  selectedId: number | null;
}

export default function HistoryPanel({ onSelectReview, selectedId }: HistoryPanelProps) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{ reviews: ReviewRecord[] }>("/api/review/history?limit=30");
      setReviews(data.reviews ?? []);
      setError("");
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-gray-300">Review History</h3>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-surface-700"
          title="Refresh"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && reviews.length === 0 ? (
          <div className="flex flex-col gap-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-surface-700/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchHistory}
              className="text-xs text-brand-400 mt-2 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-surface-700 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No reviews yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Submit your first code review above
            </p>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {reviews.map((review) => {
              const feedback = review.ai_feedback ?? {};
              const issueCount =
                (feedback.bugs?.length ?? 0) +
                (feedback.performance?.length ?? 0) +
                (feedback.security?.length ?? 0);

              return (
                <button
                  key={review.id}
                  onClick={() => onSelectReview(review)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 ${
                    selectedId === review.id
                      ? "bg-brand-500/15 border border-brand-500/25"
                      : "hover:bg-surface-700/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <LanguageDot language={review.language} />
                      <span className="text-xs font-mono text-gray-300 capitalize">
                        {review.language}
                      </span>
                    </div>
                    {review.score != null && (
                      <ScoreBadge score={review.score} />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono truncate leading-relaxed">
                    {review.code_snippet?.slice(0, 60)}...
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-600">
                      {timeAgo(review.created_at)}
                    </span>
                    {issueCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {issueCount} issue{issueCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
