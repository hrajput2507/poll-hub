'use client';

import { Poll } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Clock, User, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PollCardProps {
  poll: Poll;
  showVoteButton?: boolean;
}

export function PollCard({ poll, showVoteButton = true }: PollCardProps) {
  const createdAt = new Date(poll.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{poll.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {poll.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-1 h-4 w-4" />
            <span>Anonymous</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {poll.options?.length || 0} options • {poll.votes_count || 0} votes
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-3 flex-wrap">
        {showVoteButton && (
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/polls/${poll.id}`} className="flex items-center">
              <ExternalLink className="mr-1 h-4 w-4" />
              <span>Vote</span>
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/polls/${poll.id}/results`} className="flex items-center">
            <BarChart3 className="mr-1 h-4 w-4" />
            <span>Results</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}