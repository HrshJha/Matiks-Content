// Reel CRUD + stage transitions
// GET /api/reels?channelId=X — list reels for a channel
// POST /api/reels — create a new reel
// PATCH /api/reels — advance a reel's stage
import { NextRequest, NextResponse } from "next/server";
import { getReelsByChannel, getReelById, createReel, updateReelStage } from "@backend/queries/reels";
import { requireUserId } from "@backend/auth/session";

export async function GET(req: NextRequest) {
  try {
    await requireUserId();

    const channelId = req.nextUrl.searchParams.get("channelId");
    if (!channelId) {
      return NextResponse.json(
        { error: "channelId is required" },
        { status: 400 }
      );
    }

    const reels = await getReelsByChannel(channelId);
    return NextResponse.json({ data: reels });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUserId();

    const body = await req.json();
    const reel = await createReel(body);
    return NextResponse.json({ data: reel }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireUserId();

    const body = await req.json();
    const { reelId, stage } = body;

    if (!reelId || !stage) {
      return NextResponse.json(
        { error: "reelId and stage are required" },
        { status: 400 }
      );
    }

    const reel = await updateReelStage(reelId, { stage });
    return NextResponse.json({ data: reel });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith("INVALID_STAGE")) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
