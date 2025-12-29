import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Paste from "@/models/Paste";

export default async function PastePage({ params }) {
  const resolvedParams = await params;
  await connectDB();
  const paste = await Paste.findById(resolvedParams.id);

  if (!paste) notFound();

  const now = new Date();

  if (paste.expires_at && now > paste.expires_at) notFound();
  if (paste.max_views !== null && paste.view_count >= paste.max_views) notFound();

  return (
    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {paste.content}
    </pre>
  );
}
