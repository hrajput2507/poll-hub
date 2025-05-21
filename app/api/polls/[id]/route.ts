import { NextRequest, NextResponse } from 'next/server';
import { getPollById, deletePoll } from '@/lib/polls';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const poll = await getPollById(pollId);
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(poll);
  } catch (error: any) {
    console.error('Error getting poll:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get poll' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    // Check if poll exists and belongs to the user
    const poll = await getPollById(pollId);
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    if (poll.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this poll' },
        { status: 403 }
      );
    }
    
    await deletePoll(pollId);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting poll:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete poll' },
      { status: 500 }
    );
  }
}