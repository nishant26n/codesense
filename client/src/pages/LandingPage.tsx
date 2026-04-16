import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
    title: "Bug Detection",
    desc: "Identify logic errors, null pointer exceptions, off-by-one errors, and runtime issues before they hit production.",
    color: "from-red-500/20 to-red-600/5 border-red-500/15 text-red-400",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Performance Analysis",
    desc: "Spot N+1 queries, inefficient loops, memory leaks, and algorithmic complexity issues with actionable fixes.",
    color:
      "from-amber-500/20 to-amber-600/5 border-amber-500/15 text-amber-400",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    title: "Security Scanning",
    desc: "Detect SQL injection, XSS, CSRF vulnerabilities, hardcoded secrets, and OWASP Top 10 issues.",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/15 text-blue-400",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
    title: "Quality Score",
    desc: "Get a 0-100 quality score with detailed breakdown across all categories, tracked over time.",
    color:
      "from-brand-500/20 to-brand-600/5 border-brand-500/15 text-brand-400",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Review History",
    desc: "Every review is saved. Track your code quality improvements over time with a full history dashboard.",
    color:
      "from-green-500/20 to-green-600/5 border-green-500/15 text-green-400",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
        />
      </svg>
    ),
    title: "12+ Languages",
    desc: "Full support for JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, PHP, Ruby, SQL, and more.",
    color:
      "from-purple-500/20 to-purple-600/5 border-purple-500/15 text-purple-400",
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
            AI-Powered Code Review
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Ship{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">
              Better Code
            </span>
            <br />
            Faster Than Ever
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            CodeSense analyzes your code for bugs, performance issues, and
            security vulnerabilities in seconds
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-brand-900/50"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-brand-900/50"
                >
                  Start Free — 5 reviews/day
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-base px-6 py-3.5"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <p className="text-sm text-gray-600 mt-6">
            No credit card required · Free forever plan available
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything you need to write better code
          </h2>
          <p className="text-gray-500">
            Comprehensive AI analysis in one place
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card p-6 bg-gradient-to-br ${f.color} hover:border-opacity-30 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <div className="glass-card p-12 bg-gradient-to-br from-brand-900/30 to-surface-800/30 border-brand-500/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to write better code?
          </h2>
          <p className="text-gray-400 mb-8">
            Join developers who ship with confidence.
          </p>
          {!user && (
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Get started for free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
