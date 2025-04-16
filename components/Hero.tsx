import React from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <header className="py-32 ">
      <div className="text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">
            Your Questions, Their Voices. Effortlessly Collected.
          </h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            Take control of your decision-making and understanding. SimplePolls
            provides the simple tools to create custom polls, share them widely,
            and analyze the results with ease. Get the clarity you need,
            directly from your audience.
          </p>
        </div>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "default" }), "mt-10")}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
