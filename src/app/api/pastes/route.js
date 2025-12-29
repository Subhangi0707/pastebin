import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Paste from "@/models/Paste";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: "Invalid max_views" },
        { status: 400 }
      );
    }

    await connectDB();

    let expiresAt = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    const paste = await Paste.create({
      _id: nanoid(10),
      content,
      expires_at: expiresAt,
      max_views: max_views ?? null,
    });

    return NextResponse.json({
      id: paste._id,
      url: `${process.env.BASE_URL}/p/${paste._id}`,
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// GET /api/pastes
export async function GET() {
  try {
    await connectDB();

    const pastes = await Paste.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select("_id createdAt expires_at max_views view_count");

    return NextResponse.json(
      {
        count: pastes.length,
        pastes: pastes.map(p => ({
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
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
