import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AuthControls() {
  return (
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
        <div className="flex items-center gap-2">
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
        </div>
      </Show>
    </div>
  );
}