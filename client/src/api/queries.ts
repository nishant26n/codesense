import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type { ReviewFeedback, ReviewRecord } from '../types';

export const QUERY_KEYS = {
  currentUser: ['currentUser'] as const,
  reviewHistory: ['reviewHistory'] as const,
};

// ── Types ──────────────────────────────────────────────────────────────────

export type MeResponse = {
  id: number;
  name: string;
  email: string;
  tier: 'free' | 'pro';
};

type SubmitPayload = { code: string; language: string };

export type SubmitResponse = {
  reviewId: number;
  feedback: ReviewFeedback;
};

// ── Queries ────────────────────────────────────────────────────────────────

export const useMe = (enabled = true) =>
  useQuery<MeResponse>({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: () => api.get<MeResponse>('/api/auth/me').then((r) => r.data),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const useReviewHistory = () =>
  useQuery<ReviewRecord[]>({
    queryKey: QUERY_KEYS.reviewHistory,
    queryFn: () =>
      api
        .get<{ reviews: ReviewRecord[] }>('/api/review/history?limit=30')
        .then((r) => r.data.reviews),
    staleTime: 0,
  });

// ── Mutations ──────────────────────────────────────────────────────────────

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation<SubmitResponse, Error, SubmitPayload>({
    mutationFn: (payload) =>
      api.post<SubmitResponse>('/api/review', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewHistory });
    },
  });
};
