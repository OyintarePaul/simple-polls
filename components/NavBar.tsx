import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <div className="font-bold">
        <Link href="/">SIMPLE POLLS</Link>
      </div>
      <div>
        <SignedOut>
          <Link href="/dashboard" className={cn(buttonVariants())}>
            Get Started
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
