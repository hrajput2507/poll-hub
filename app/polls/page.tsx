"use client";

import { useEffect, useState } from "react";
import { getPolls } from "@/lib/polls";
import { Poll } from "@/types";
import { PollCard } from "@/components/PollCard";
import Navbar from "@/components/Navbar";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPolls() {
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
  }, []);

  const filteredPolls = polls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poll.description &&
        poll.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-6 md:px-8 lg:px-5 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Polls</h1>
            <p className="text-muted-foreground mt-1">
              Browse and vote on community polls
            </p>
          </div>
          <Button asChild>
            <Link href="/polls/create">Create New Poll</Link>
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4  text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search polls..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg font-medium">Loading polls...</span>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <h2 className="text-xl font-semibold mb-2">No polls found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No polls match "${searchQuery}"`
                : "There are no polls available yet."}
            </p>
            <Button asChild>
              <Link href="/polls/create">Create the first poll</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
