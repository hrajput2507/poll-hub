# Social Polling App

A full-featured application that allows users to create polls, vote, and view real-time results in an interactive dashboard.

## Features

- **User Authentication**: Sign up and log in with email and password via Supabase Auth
- **Poll Creation**: Create polls with multiple options
- **Real-time Voting**: Cast votes and see results update in real-time
- **Results Dashboard**: View poll results with interactive charts (bar or pie)
- **RESTful API**: Well-designed API endpoints for all operations
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes (Node.js/TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time Updates**: Supabase Realtime
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Setup

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migration in `/supabase/migrations/create_schema.sql` in the Supabase SQL editor
3. Enable email auth in Authentication settings

### Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

## Architecture Decisions and Trade-offs

### Frontend Architecture

- **Next.js with App Router**: Leverages the latest Next.js features for improved performance and developer experience
- **Component Structure**: Organized into reusable UI components
- **State Management**: Combination of React Context for global state and React Hooks for local state
- **TypeScript**: Strong typing throughout for improved developer experience and code quality

### Database Schema

- **Polls Table**: Stores poll information (title, description, user_id)
- **Options Table**: Stores options for each poll (text, poll_id)
- **Votes Table**: Tracks user votes (user_id, option_id, poll_id)
- **Row Level Security (RLS)**: Ensures users can only manage their own polls

### Real-time Functionality

- **Supabase Realtime**: Used to subscribe to vote changes for live updates
- **Optimistic UI Updates**: Immediate feedback for user actions with server confirmation

### API Design

- **RESTful Principles**: Clean API design following REST conventions
- **Error Handling**: Comprehensive error states with appropriate HTTP status codes
- **Input Validation**: Server-side validation for all API inputs

### Security Considerations

- **Authentication**: Secure authentication flow with JWT tokens
- **Row Level Security**: Database-level permissions to prevent unauthorized access
- **Input Sanitization**: Prevents SQL injection and XSS attacks

### Performance Optimization

- **Efficient Queries**: Optimized database queries
- **Lazy Loading**: Components and routes load only when needed
- **Caching**: Strategic caching for frequently accessed data

### Development Decisions

- **Modular Code**: Separated concerns for maintainability
- **Consistent Styling**: Tailwind utility classes for consistent design
- **Code Reusability**: Abstracted common functionality into hooks and utility functions

## Deployment

The application is deployed on Vercel and can be accessed at [your-deployment-url].

## Future Improvements

- Add social sharing for polls
- Implement more chart types for result visualization
- Add poll expiration functionality
- Enhance analytics for poll creators
- Support for image options in polls