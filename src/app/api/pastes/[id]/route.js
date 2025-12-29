import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Paste from "@/models/Paste";

function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return new Date(Number(testNow));
  }
  return new Date();
}

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const paste = await Paste.findById(id);

    if (!paste) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = getNow(req);

    // TTL check
    if (paste.expires_at && now > paste.expires_at) {
      return NextResponse.json({ error: "Expired" }, { status: 404 });
    }

    // View limit check
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
    }

    paste.view_count += 1;
    await paste.save();

    const remainingViews =
      paste.max_views === null
        ? null
        : paste.max_views - paste.view_count;

    return NextResponse.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
