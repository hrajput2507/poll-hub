import { NextRequest, NextResponse } from 'next/server';
import { createPoll, getPolls } from '@/lib/polls';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const polls = await getPolls();
    return NextResponse.json(polls);
  } catch (error: any) {
    console.error('Error getting polls:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get polls' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { title, description, options } = await request.json();
    
    // Validate request body
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'Title and at least 2 options are required'
        },
        { status: 400 }
      );
    }
    
    const poll = await createPoll(
      title,
      description || null,
      options,
      session.user.id
    );
    
    return NextResponse.json(poll, { status: 201 });
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create poll' },
      { status: 500 }
    );
  }
}