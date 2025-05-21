"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPolls } from "@/lib/polls";
import { Poll } from "@/types";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/PollCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PlusCircle, ArrowRight, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const pollsData = await getPolls();
        setPolls(pollsData);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
            <h1 className="text-2xl font-bold">
              Sign in to access your dashboard
            </h1>
            <p className="text-muted-foreground max-w-md">
              You need to be signed in to view your dashboard and create polls.
            </p>
            <div className="flex gap-4 mt-2">
              <Button asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/signup">Create an account</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-6 md:px-8 lg:px-5 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! View recent polls or create your own.
            </p>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href="/polls/create" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Poll
            </Link>
          </Button>
        </div>

        {/* Recent Polls */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Polls</h2>
            <Button variant="link" asChild className="font-medium">
              <Link href="/polls" className="flex items-center">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {polls.length === 0 ? (
            <div className="border rounded-lg p-8 text-center bg-muted/30">
              <h3 className="text-lg font-medium mb-2">
                No polls available yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a poll!
              </p>
              <Button asChild>
                <Link href="/polls/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a Poll
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.slice(0, 6).map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </section>

        {/* Your Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Activity</h2>
            <Button variant="link" asChild className="font-medium">
              <Link href="/dashboard/my-polls" className="flex items-center">
                My polls
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-muted/30 border rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium mb-2">View your polls</h3>
              <p className="text-muted-foreground mb-4">
                Check results and manage the polls you've created.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/my-polls">My Polls</Link>
              </Button>
            </div>

            <div className="bg-muted/30 border rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium mb-2">Create a new poll</h3>
              <p className="text-muted-foreground mb-4">
                Start collecting votes with your custom poll.
              </p>
              <Button asChild>
                <Link href="/polls/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Poll
                </Link>
              </Button>
            </div>

            <div className="bg-muted/30 border rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium mb-2">Browse all polls</h3>
              <p className="text-muted-foreground mb-4">
                Discover polls created by the community.
              </p>
              <Button variant="outline" asChild>
                <Link href="/polls">Browse Polls</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
