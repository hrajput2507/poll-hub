import { Metadata } from "next";
import PollResultsPageClient from "./PollResultsPageClient";

// Enable dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Poll Results - PollHub",
  description: "View real-time poll results and statistics",
};

export default function PollResultsPage() {
  return <PollResultsPageClient />;
}
