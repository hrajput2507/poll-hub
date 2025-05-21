import { supabase } from "./supabase";
import { Poll, Option, Vote, PollResult } from "@/types";

export async function createPoll(
  title: string,
  description: string | null,
  options: string[],
  userId: string
): Promise<Poll> {
  try {
    // Start a single transaction for both poll and options
    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .insert({
        title,
        description,
        user_id: userId,
      })
      .select()
      .single();

    if (pollError) {
      console.error("Poll creation error:", pollError);
      throw new Error(pollError.message);
    }

    if (!pollData) {
      throw new Error("Failed to create poll");
    }

    // Insert options
    const optionsToInsert = options.map((text) => ({
      text,
      poll_id: pollData.id,
    }));

    const { data: optionsData, error: optionsError } = await supabase
      .from("options")
      .insert(optionsToInsert)
      .select();

    if (optionsError) {
      console.error("Options creation error:", optionsError);
      throw new Error(optionsError.message);
    }

    if (!optionsData) {
      throw new Error("Failed to create poll options");
    }

    return {
      ...pollData,
      options: optionsData,
      votes_count: 0,
    };
  } catch (error) {
    console.error("Error in createPoll:", error);
    throw error;
  }
}

export async function getPolls(): Promise<Poll[]> {
  try {
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select(
        `
        *,
        options (*),
        votes:votes(count)
      `
      )
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Database error:", pollsError);
      throw new Error("Failed to fetch polls. Please try again.");
    }

    if (!polls) {
      return [];
    }

    return polls.map((poll) => ({
      ...poll,
      votes_count: poll.votes?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching polls:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch polls: ${error.message}`);
    }
    throw new Error("Failed to fetch polls. Please try again.");
  }
}

export async function getPollById(id: string): Promise<Poll | null> {
  try {
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select(
        `
        *,
        options (*),
        votes:votes(count)
      `
      )
      .eq("id", id)
      .single();

    if (pollError) {
      if (pollError.code === "PGRST116") return null;
      console.error("Database error:", pollError);
      throw new Error("Failed to fetch poll. Please try again.");
    }

    if (!poll) return null;

    return {
      ...poll,
      votes_count: poll.votes?.[0]?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching poll:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch poll: ${error.message}`);
    }
    throw new Error("Failed to fetch poll. Please try again.");
  }
}

export async function getUserPolls(userId: string): Promise<Poll[]> {
  try {
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select(
        `
        *,
        options (*),
        votes:votes(count)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Database error:", pollsError);
      throw new Error("Failed to fetch your polls. Please try again.");
    }

    if (!polls) {
      return [];
    }

    return polls.map((poll) => ({
      ...poll,
      votes_count: poll.votes?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching user polls:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch your polls: ${error.message}`);
    }
    throw new Error("Failed to fetch your polls. Please try again.");
  }
}

export async function deletePoll(id: string) {
  try {
    const { error } = await supabase.from("polls").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to delete poll. Please try again.");
    }
  } catch (error) {
    console.error("Error deleting poll:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete poll: ${error.message}`);
    }
    throw new Error("Failed to delete poll. Please try again.");
  }
}

export async function submitVote(
  pollId: string,
  optionId: string,
  userId: string
) {
  try {
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", pollId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Database error:", checkError);
      throw new Error("Failed to check existing vote. Please try again.");
    }

    if (existingVote) {
      const { error: updateError } = await supabase
        .from("votes")
        .update({ option_id: optionId })
        .eq("id", existingVote.id);

      if (updateError) {
        console.error("Database error:", updateError);
        throw new Error("Failed to update vote. Please try again.");
      }
    } else {
      const { error: insertError } = await supabase.from("votes").insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
      });

      if (insertError) {
        console.error("Database error:", insertError);
        throw new Error("Failed to submit vote. Please try again.");
      }
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit vote: ${error.message}`);
    }
    throw new Error("Failed to submit vote. Please try again.");
  }
}

export async function getPollResults(pollId: string): Promise<PollResult> {
  try {
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select(
        `
        id,
        title,
        options (
          id,
          text,
          votes:votes(count)
        )
      `
      )
      .eq("id", pollId)
      .single();

    if (pollError) {
      console.error("Database error:", pollError);
      throw new Error("Failed to get poll results. Please try again.");
    }

    if (!poll) {
      throw new Error("Poll not found");
    }

    const totalVotes = poll.options.reduce(
      (sum, option) => sum + (option.votes?.[0]?.count || 0),
      0
    );

    return {
      pollId: poll.id,
      title: poll.title,
      options: poll.options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes?.[0]?.count || 0,
        percentage:
          totalVotes > 0
            ? Math.round(((option.votes?.[0]?.count || 0) / totalVotes) * 100)
            : 0,
      })),
      totalVotes,
    };
  } catch (error) {
    console.error("Error getting poll results:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get poll results: ${error.message}`);
    }
    throw new Error("Failed to get poll results. Please try again.");
  }
}

export async function getUserVote(
  pollId: string,
  userId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", pollId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to get user vote. Please try again.");
    }

    return data?.option_id || null;
  } catch (error) {
    console.error("Error getting user vote:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get user vote: ${error.message}`);
    }
    throw new Error("Failed to get user vote. Please try again.");
  }
}

export function subscribeToPollResults(pollId: string, callback: () => void) {
  return supabase
    .channel(`poll-${pollId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "votes",
        filter: `poll_id=eq.${pollId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Retrieves all poll IDs for static generation
 * @returns Array of poll IDs
 */
export async function getAllPollIds(): Promise<string[]> {
  try {
    // Replace this with your actual data fetching logic
    // This could be a database query, API call, or file read

    // For Supabase (if that's what you're using based on your code):
    const { data, error } = await supabase.from("polls").select("id");

    if (error) {
      console.error("Error fetching poll IDs:", error);
      return [];
    }

    return data.map((poll) => poll.id);

    // If you're using another data source, implement accordingly
  } catch (error) {
    console.error("Failed to fetch poll IDs:", error);
    return [];
  }
}
