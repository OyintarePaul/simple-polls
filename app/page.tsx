import { Suspense } from 'react';
import { BarChart3, CheckCircle2, Layers3, Lock, Zap } from 'lucide-react';

import { AuthControls } from '@/components/auth-controls';
import { HeroActions } from '@/components/hero-actions';
import { FooterYear } from '@/components/footer-year';
import { Skeleton } from '@/components/ui/skeleton';

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 selection:bg-primary selection:text-primary-foreground">
      {/* Marketing Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <Layers3 className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight text-base">SimplePolls</span>
          </div>

          <Suspense fallback={
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          }
          >
            <AuthControls />
          </Suspense>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Subtle Background Glow Decorative Accents */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-100 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-primary/10 to-purple-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 text-center space-y-6 sm:px-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" /> Instant Engagement Architecture
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground  leading-[1.15]">
              Capture realtime feedback with{' '}
              <span className="bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                zero friction.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Build stunning custom public sentiment pipelines or restricted verified-community polls. Distributed instantly via highly micro-optimized share wrappers.
            </p>
            <Suspense fallback={
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Skeleton className="h-11 w-full sm:w-48 rounded-md" />
                <Skeleton className="h-11 w-full sm:w-40 rounded-md" />
              </div>
            }>
              <HeroActions />
            </Suspense>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-16 bg-background dark:bg-card/40 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Engineered for High Performance Contexts
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
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
                <div key={idx} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary dark:text-indigo-400 flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-foreground  tracking-tight text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
      <footer className="border-t border-border/60 py-6 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground font-mono">
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-muted animate-pulse" />}>
            <FooterYear />
          </Suspense>
        </div>
      </footer>
    </div>
  );
}