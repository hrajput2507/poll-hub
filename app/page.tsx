import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { BarChart3, Vote, LineChart, CheckSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Create Polls, Gather Insights
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  PollHub makes it easy to create polls, collect votes in real-time, and visualize results with beautiful charts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8">
                  <Link href="/polls">View Polls</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Vote className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Create Custom Polls</h3>
                  <p className="text-muted-foreground">
                    Easily create customized polls with multiple options and track responses in real-time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Real-Time Voting</h3>
                  <p className="text-muted-foreground">
                    Watch as votes come in live with real-time updates and notifications.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Visualize Results</h3>
                  <p className="text-muted-foreground">
                    Analyze poll results with beautiful charts and detailed breakdowns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Polling?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Join thousands of users creating polls and gathering insights with PollHub.
                </p>
              </div>
              <Button asChild size="lg" className="h-12 px-8 mt-6">
                <Link href="/auth/signup">Create Your First Poll</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PollHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}