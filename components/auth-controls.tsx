import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AuthControls() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-in">
        <Link href="/dashboard">
          <Button size="sm">
            Go to Workspace
          </Button>
        </Link>
        <UserButton />
      </Show>

      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="font-medium">
            Log In
          </Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button size="sm">
            Create Account
          </Button>
        </SignUpButton>
      </Show>
    </div>
  );
}