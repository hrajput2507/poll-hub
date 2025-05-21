import { Metadata } from 'next';
import PollResultsPageClient from './PollResultsPageClient';
import { getAllPollIds } from '@/lib/polls';

// Force dynamic rendering for all poll result pages
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const pollIds = await getAllPollIds();
  return pollIds.map((id) => ({
    id,
  }));
}

export const metadata: Metadata = {
  title: 'Poll Results - PollHub',
  description: 'View real-time poll results and statistics',
};

export default function PollResultsPage() {
  return <PollResultsPageClient />;
}