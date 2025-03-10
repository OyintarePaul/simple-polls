import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
    return <header className="space-y-8">
        <h1 className="text-6xl font-bold ">Create Polls and <br />Settle Dispute Quick</h1>
        <Button asChild><Link href="/dashboard">Get Started</Link></Button>
    </header>
}