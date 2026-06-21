import { Show, SignInButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function HeroActions() {
  return (
    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
      <Show when="signed-in">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-medium shadow-md gap-2">
            Open Admin Control <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </Link>
      </Show>

      <Show when="signed-out">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <SignInButton mode="modal">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-medium shadow-md gap-2">
              Deploy Your First Poll <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
          </SignInButton>
          
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-input bg-background hover:bg-muted text-foreground px-8 font-medium">
              Explore Framework
            </Button>
          </a>
        </div>
      </Show>
    </div>
  );
}