// SSE: Live ops ticker events
// GET /api/events — Server-Sent Events stream for the ops feed
import { NextRequest } from "next/server";
import { TICKER } from "@backend/data";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial batch of events
      const events = [...TICKER];
      let index = 0;

      // Send an event every 8 seconds (simulating live ops feed)
      intervalId = setInterval(() => {
        const event = events[index % events.length];
        const data = JSON.stringify({
          id: `evt_${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: event,
        });

        controller.enqueue(
          encoder.encode(`data: ${data}\n\n`)
        );

        index++;
      }, 8000);

      // Send initial heartbeat
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", channels: 12 })}\n\n`
        )
      );
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
