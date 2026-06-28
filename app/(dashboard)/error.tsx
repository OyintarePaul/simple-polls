"use client";
import { useEffect } from "react";
import Link from "next/link"
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    useEffect(() => {
        // Log telemetry profile securely via your query pipeline frameworks
        console.error("Dashboard Global Exception Catch:", error);
    }, [error]);

    return (
        <main className="min-h-[75vh] w-full flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Visual Anchor Container */}
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full transition-all duration-500 group-hover:bg-destructive/15" />

                {/* Flat native primitive shell matching system card borders */}
                <div className="relative w-20 h-20 bg-card border border-border/80 rounded-2xl flex items-center justify-center shadow-xl">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
            </div>

            {/* Content Section */}
            <div className="text-center space-y-4 max-w-md z-10">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                    Workspace Error
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    An unexpected error has occured.
                </p>

                {error.digest && (
                    <Badge
                        variant="secondary"
                        className="rounded-md px-2.5 py-1 font-mono text-[11px] font-normal text-muted-foreground border border-border/40 bg-muted"
                    >
                        ID Reference: {error.digest}
                    </Badge>
                )}
            </div>

            {/* Action Workspace Options */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 z-10">
                <Button
                    onClick={() => reset()}
                    className="px-5 w-full sm:w-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="px-5 w-full sm:w-auto"
                >
                    <Link href="/">
                        <Home className="w-4 h-4" />
                        Exit to Home
                    </Link>
                </Button>
            </div>
        </main>
    );
}