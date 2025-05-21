import { NextRequest, NextResponse } from 'next/server';
import { submitVote, getPollById } from '@/lib/polls';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const pollId = params.id;
    const { optionId } = await request.json();
    
    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }
    
    // Check if poll exists
    const poll = await getPollById(pollId);
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    // Check if option belongs to poll
    const optionBelongsToPoll = poll.options.some(
      (option) => option.id === optionId
    );
    
    if (!optionBelongsToPoll) {
      return NextResponse.json(
        { error: 'Option does not belong to this poll' },
        { status: 400 }
      );
    }
    
    await submitVote(pollId, optionId, session.user.id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit vote' },
      { status: 500 }
    );
  }
}