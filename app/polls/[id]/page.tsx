import { Metadata } from "next";
import PollPageClient from "./PollPageClient";
import { getAllPollIds } from "@/lib/polls";

// Force dynamic rendering for all poll pages
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const pollIds = await getAllPollIds();
  return pollIds.map((id) => ({
    id,
  }));
}

export const metadata: Metadata = {
  title: "Vote on Poll - PollHub",
  description: "Cast your vote and make your voice heard",
};

export default function PollPage() {
  return <PollPageClient />;
}
