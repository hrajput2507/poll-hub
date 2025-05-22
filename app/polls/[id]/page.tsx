import { Metadata } from "next";
import PollPageClient from "./PollPageClient";

// Enable dynamic rendering and disable static generation
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Vote on Poll - PollHub",
  description: "Cast your vote and make your voice heard",
};

export default function PollPage() {
  return <PollPageClient />;
}
