"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, PenLine, Shield, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Notes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="btn-ghost">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-foreground leading-tight">
            Capture your thoughts,{" "}
            <span className="text-primary">beautifully</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A simple, elegant note-taking app to organize your ideas. No
            clutter, no complexity—just you and your notes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Start for free
            </Link>
            <Link href="/signin" className="btn-secondary text-lg px-8 py-4">
              Sign in
            </Link>
          </div>
        </div>

        {/* Features */}
        <div
          className="mt-24 max-w-4xl mx-auto w-full animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <PenLine className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Simple & Clean
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Focus on what matters. No unnecessary features or distractions.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Private by Design
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your notes stay on your device. We respect your privacy.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No loading. No waiting. Your notes are always instantly
                available.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          Built with care. Your notes, your way.
        </p>
      </footer>
    </div>
  );
}
