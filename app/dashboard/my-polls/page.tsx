"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPolls, deletePoll } from "@/lib/polls";
import { Poll } from "@/types";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/PollCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PlusCircle, Loader2, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MyPollsPage() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPollDeleting, setIsPollDeleting] = useState<string | null>(null);
  const [pollToDelete, setPollToDelete] = useState<Poll | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPolls() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userPolls = await getUserPolls(user.id);
        setPolls(userPolls);
      } catch (error) {
        console.error("Error fetching user polls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, [user, authLoading]);

  const handleDeleteClick = (poll: Poll) => {
    setPollToDelete(poll);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pollToDelete) return;

    setIsPollDeleting(pollToDelete.id);
    try {
      await deletePoll(pollToDelete.id);

      // Update polls list
      setPolls(polls.filter((p) => p.id !== pollToDelete.id));

      toast({
        title: "Poll deleted",
        description: "Your poll has been successfully deleted",
      });
    } catch (error: any) {
      console.error("Error deleting poll:", error);
      toast({
        title: "Error deleting poll",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPollDeleting(null);
      setShowDeleteDialog(false);
      setPollToDelete(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading your polls...</p>
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
            <h1 className="text-2xl font-bold">Sign in to view your polls</h1>
            <p className="text-muted-foreground max-w-md">
              You need to be signed in to view your polls.
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
            <h1 className="text-3xl font-bold tracking-tight">My Polls</h1>
            <p className="text-muted-foreground mt-1">
              Manage the polls you&apos;ve created
            </p>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href="/polls/create" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Poll
            </Link>
          </Button>
        </div>

        {polls.length === 0 ? (
          <div className="border rounded-lg p-8 text-center bg-muted/30">
            <h3 className="text-lg font-medium mb-2">
              You haven&apos;t created any polls yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first poll to start collecting votes!
            </p>
            <Button asChild>
              <Link href="/polls/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a Poll
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="flex flex-col md:flex-row gap-4 bg-card border rounded-lg overflow-hidden"
              >
                <div className="flex-grow">
                  <PollCard poll={poll} showVoteButton={false} />
                </div>
                <div className="flex flex-row md:flex-col justify-end p-4 md:border-l border-border">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(poll)}
                    disabled={isPollDeleting === poll.id}
                    className="w-full"
                  >
                    {isPollDeleting === poll.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                poll &quot;{pollToDelete?.title}&quot; and all associated votes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPollDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
