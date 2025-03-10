import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex justify-between items-center py-6">
            <div className="font-bold">SIMPLE POLLS</div>
            <div>
                <SignedOut><Button asChild> <Link href="/dashboard">Sign in</Link></Button></SignedOut>
                <SignedIn><UserButton /></SignedIn>
            </div>
        </nav>
    )
}