import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { ArrowRight, BarChart3, CheckCircle2, Layers3, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/40 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white">
      {/* Marketing Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <Layers3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold tracking-tight text-base">PollGrid</span>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                  Go to Workspace
                </Button>
              </Link>
              <UserButton />
            </Show>
            <Show when="signed-out">
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            </Show>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Subtle Background Glow Decorative Accents */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 text-center space-y-6 sm:px-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider animate-fade-in">
              <Zap className="w-3 h-3 fill-current" /> Instant Engagement Architecture
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-slate-50 leading-[1.15]">
              Capture realtime feedback with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                zero friction.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Build stunning custom public sentiment pipelines or restricted verified-community polls. Distributed instantly via highly micro-optimized share wrappers.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-50 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 px-8 font-medium shadow-md gap-2">
                    Open Admin Control <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Show>

              <Show when="signed-out">
                <>
                  <SignInButton mode="modal">
                    <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-medium shadow-md gap-2">
                      Deploy Your First Poll <ArrowRight className="w-4 h-4" />
                    </Button>
                  </SignInButton>
                  <a href="#features" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-200 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 px-8 font-medium">
                      Explore Framework
                    </Button>
                  </a>
                </>
              </Show>

            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-slate-50">
                Engineered for High Performance Contexts
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                A streamlined core structure allows for instantaneous delivery without heavy payload initialization barriers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Anti-Fraud Cryptography',
                  desc: 'Multi-layer system checks mapping hardware footprints to safely guard metrics from data manipulation cycles.',
                  icon: CheckCircle2,
                },
                {
                  title: 'Private Auth Walls',
                  desc: 'Gate responses to verified accounts via automated community credentials checks with native glassmorphic locks.',
                  icon: Lock,
                },
                {
                  title: 'Live Analytical Waves',
                  desc: 'Instant streaming result transformations handled smoothly client side using animated state modifiers.',
                  icon: BarChart3,
                },
              ].map((feature, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card p-6 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 tracking-tight text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-6 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} PollGrid. All operations system authenticated.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">API Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}