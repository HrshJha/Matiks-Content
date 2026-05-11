// GET /api/channels — list channels for the authenticated owner
// POST /api/channels — create a new channel row in the DB
import { NextRequest, NextResponse } from "next/server";
import { getChannelsByOwner, createChannel } from "@backend/queries/channels";
import { requireUserId } from "@backend/auth/session";
import { createChannelSchema } from "@backend/schemas/channel";
import { ZodError } from "zod";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Internal error";
}

export async function GET(_req: NextRequest) {
  try {
    const ownerId = await requireUserId();
    const channels = await getChannelsByOwner(ownerId);
    return NextResponse.json({ data: channels });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ownerId = await requireUserId();

    const body = await req.json();

    // Validate and attach the ownerId so the schema is satisfied
    const validated = createChannelSchema.parse({ ...body, ownerId });

    const channel = await createChannel(validated);
    return NextResponse.json({ data: channel }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
