"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPollById,
  getPollResults,
  subscribeToPollResults,
} from "@/lib/polls";
import { Poll, PollResult } from "@/types";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronLeft,
  Loader2,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function PollResultsPageClient() {
  const params = useParams();
  const pollId = params.id as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    let subscription: RealtimeChannel | null = null;

    const fetchData = async () => {
      try {
        const pollData = await getPollById(pollId);

        if (!pollData) {
          setError("Poll not found");
          setLoading(false);
          return;
        }

        setPoll(pollData);

        const resultsData = await getPollResults(pollId);
        setResults(resultsData);

        // Set up real-time subscription
        subscription = subscribeToPollResults(pollId, async () => {
          // Refresh results when votes change
          const updatedResults = await getPollResults(pollId);
          setResults(updatedResults);
        });
      } catch (error) {
        console.error("Error fetching poll:", error);
        setError("Failed to load poll results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Clean up subscription
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [pollId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const resultsData = await getPollResults(pollId);
      setResults(resultsData);
    } catch (error) {
      console.error("Error refreshing results:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading poll results...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !poll || !results) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-6 md:px-8 lg:px-5 py-6 md:py-10">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/polls" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Polls
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto text-center py-12">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Poll results not found"}
              </AlertDescription>
            </Alert>

            <Button asChild>
              <Link href="/polls">View All Polls</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const createdAt = new Date(poll.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  // Prepare chart colors
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    // Add more colors if needed
  ];

  // Format data for chart
  const chartData = results.options.map((option, index) => ({
    name: option.text,
    value: option.votes,
    percentage: option.percentage,
    fill: chartColors[index % chartColors.length],
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-6 md:px-8 lg:px-5 py-6 md:py-10">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/polls/${pollId}`} className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Poll
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Results: {poll.title}
            </h1>

            {poll.description && (
              <p className="text-muted-foreground mb-4">{poll.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>Anonymous</span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Poll Results</CardTitle>
                  <CardDescription>
                    Total votes: {results.totalVotes}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-1 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                  <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                    <Button
                      variant={chartType === "bar" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                      className="h-8 w-8 p-0"
                      title="Bar Chart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <rect x="2" y="3" width="3" height="9" />
                        <rect x="6" y="5" width="3" height="7" />
                        <rect x="10" y="7" width="3" height="5" />
                      </svg>
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                      className="h-8 w-8 p-0"
                      title="Pie Chart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <circle cx="7.5" cy="7.5" r="6.5" />
                        <path d="M7.5 1v6.5h6.5" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {results.totalVotes === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">No votes have been cast yet.</p>
                  <p>Be the first to vote!</p>
                </div>
              ) : chartType === "bar" ? (
                <div className="w-full h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, "dataMax"]} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} votes (${props.payload.percentage}%)`,
                          "Votes",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} votes (${props.payload.percentage}%)`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detailed Results</h2>

            <div className="space-y-3">
              {results.options.map((option, index) => (
                <div key={option.id} className="bg-card border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{option.text}</div>
                    <div className="text-sm font-semibold">
                      {option.votes} {option.votes === 1 ? "vote" : "votes"} (
                      {option.percentage}%)
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 dark:bg-muted overflow-hidden">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${option.percentage}%`,
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href={`/polls/${pollId}`}>Vote in this Poll</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/polls">View All Polls</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
