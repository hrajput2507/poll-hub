export interface User {
  id: string;
  email: string;
}

export interface Poll {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  user_id: string;
  options: Option[];
  votes_count?: number;
}

export interface Option {
  id: string;
  created_at: string;
  text: string;
  poll_id: string;
  votes_count?: number;
}

export interface Vote {
  id: string;
  created_at: string;
  user_id: string;
  option_id: string;
  poll_id: string;
}

export interface PollResult {
  pollId: string;
  title: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
}