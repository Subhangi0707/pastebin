import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Paste from "@/models/Paste";
import { nanoid } from "nanoid";

export async function POST(req) {
  console.log("➡️ POST /api/pastes called");

  try {
    const body = await req.json();
    console.log("📦 Request body:", body);

    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
    }

    console.log("🔌 Connecting to DB...");
    await connectDB();
    console.log("✅ DB connected");

    const expiresAt =
      ttl_seconds !== undefined
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    console.log("📝 Creating paste...");
    const paste = await Paste.create({
      _id: nanoid(10),            // ✅ REQUIRED by schema
      content,
      expires_at: expiresAt,
      max_views: max_views ?? null,
    });

    console.log("✅ Paste created:", paste._id);

    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

    return NextResponse.json(
      {
        id: paste._id,
        url: `${baseUrl}/p/${paste._id}`,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("🔥 POST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// ===============================
// GET /api/pastes
// ===============================
export async function GET() {
  console.log("➡️ GET /api/pastes called");

  try {
    await connectDB();

    const pastes = await Paste.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select("_id createdAt expires_at max_views view_count");

    return NextResponse.json(
      {
        count: pastes.length,
        pastes: pastes.map((p) => ({
          id: p._id,
          created_at: p.createdAt,
          expires_at: p.expires_at,
          max_views: p.max_views,
          view_count: p.view_count,
        })),
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("🔥 GET ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
