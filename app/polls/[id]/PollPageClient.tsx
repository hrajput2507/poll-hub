"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getPollById,
  submitVote,
  getUserVote,
  subscribeToPollResults,
} from "@/lib/polls";
import { Poll, Option } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  AlertCircle,
  Clock,
  User,
  BarChart3,
  ChevronLeft,
  Loader2,
  Check,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PollPageClient() {
  const params = useParams();
  const pollId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let subscription: RealtimeChannel | null = null;

    const fetchPoll = async () => {
      try {
        const pollData = await getPollById(pollId);

        if (!pollData) {
          setError("Poll not found");
          setLoading(false);
          return;
        }

        setPoll(pollData);

        subscription = subscribeToPollResults(pollId, () => {
          getPollById(pollId).then((updatedPoll) => {
            if (updatedPoll) {
              setPoll(updatedPoll);
            }
          });
        });

        if (user) {
          const existingVote = await getUserVote(pollId, user.id);
          setUserVote(existingVote);
          setSelectedOption(existingVote);
        }
      } catch (error) {
        console.error("Error fetching poll:", error);
        setError("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [pollId, user]);

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to vote",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Selection required",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitVote(pollId, selectedOption, user.id);
      setUserVote(selectedOption);

      toast({
        title: "Vote submitted successfully",
        description: "Your vote has been recorded",
      });
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error submitting vote",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4"
            {...fadeIn}
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading poll...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  if (error || !poll) {
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

          <motion.div
            className="max-w-3xl mx-auto text-center py-12"
            {...fadeIn}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || "Poll not found"}</AlertDescription>
            </Alert>

            <Button asChild>
              <Link href="/polls">View All Polls</Link>
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const createdAt = new Date(poll.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

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

        <motion.div
          className="max-w-3xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.div className="mb-8" variants={fadeIn}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {poll.title}
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
          </motion.div>

          <motion.div
            className="bg-card border rounded-lg p-6 mb-6 shadow-lg backdrop-blur-sm"
            variants={fadeIn}
          >
            <h2 className="text-xl font-semibold mb-4">
              {userVote ? "Your Vote" : "Cast Your Vote"}
            </h2>

            <form className="space-y-4">
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={setSelectedOption}
                className="space-y-3"
                disabled={submitting}
              >
                <AnimatePresence>
                  {poll.options.map((option: Option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-2 border rounded-md p-4 transition-all duration-200 ${
                        selectedOption === option.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "hover:bg-muted/50 hover:scale-[1.01]"
                      } ${
                        userVote === option.id
                          ? "border-primary ring-1 ring-primary/20"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="text-primary"
                      />
                      <label
                        htmlFor={option.id}
                        className="flex-grow text-base font-medium cursor-pointer"
                      >
                        {option.text}
                      </label>
                      {userVote === option.id && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary flex items-center text-sm font-medium"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Your vote
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </RadioGroup>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                variants={fadeIn}
              >
                <Button
                  type="button"
                  onClick={handleVote}
                  disabled={
                    submitting || !selectedOption || userVote === selectedOption
                  }
                  className="flex-1 sm:flex-none sm:w-40 relative overflow-hidden"
                >
                  <motion.div
                    initial={false}
                    animate={submitting ? { x: "100%" } : { x: "0%" }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  />
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : userVote ? (
                    "Update Vote"
                  ) : (
                    "Submit Vote"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1 sm:flex-none sm:w-40 hover:scale-105 transition-transform"
                >
                  <Link
                    href={`/polls/${pollId}/results`}
                    className="flex items-center justify-center"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Results
                  </Link>
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {!user && (
            <motion.div variants={fadeIn}>
              <Alert className="mb-6 bg-card/50 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication required</AlertTitle>
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span>You need to be signed in to vote in this poll.</span>
                  <div className="flex gap-2">
                    <Button size="sm" asChild variant="outline">
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/signup">Sign up</Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
