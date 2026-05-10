// Brief CRUD
// GET /api/briefs?channelId=X — list briefs for a channel
// POST /api/briefs — save a generated brief
import { NextRequest, NextResponse } from "next/server";
import { getBriefsByChannel, createBrief } from "@backend/queries/briefs";
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

    const limit = Number(req.nextUrl.searchParams.get("limit") || "50");
    const briefs = await getBriefsByChannel(channelId, limit);
    return NextResponse.json({ data: briefs });
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
    const brief = await createBrief(body);
    return NextResponse.json({ data: brief }, { status: 201 });
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
