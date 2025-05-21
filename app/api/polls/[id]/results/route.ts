import { NextRequest, NextResponse } from 'next/server';
import { getPollResults } from '@/lib/polls';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const results = await getPollResults(pollId);
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error getting poll results:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get poll results' },
      { status: 500 }
    );
  }
}