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
      // Send initial heartbeat
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", channels: 12 })}\n\n`
        )
      );

      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

      if (!isSupabaseConfigured) {
        // Fallback: Send mocked ticker events
        const events = [...TICKER];
        let index = 0;
        intervalId = setInterval(() => {
          const event = events[index % events.length];
          const data = JSON.stringify({
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: event,
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          index++;
        }, 8000);
        return;
      }

      // Supabase is configured: subscribe to real Postgres changes
      // We must import dynamically to avoid edge runtime issues with some node modules if any
      import("@backend/supabase/service").then(({ createServiceSupabaseClient }) => {
        const supabase = createServiceSupabaseClient();
        
        const channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'reels',
            },
            (payload) => {
              const newStage = payload.new.stage;
              const oldStage = payload.old.stage;
              
              if (newStage !== oldStage) {
                const message = `Reel ${payload.new.id.split('-')[0]} advanced to ${newStage} stage.`;
                const data = JSON.stringify({
                  id: `evt_${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  message,
                  raw: payload
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
          )
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'reels' },
            (payload) => {
              const data = JSON.stringify({
                id: `evt_${Date.now()}`,
                timestamp: new Date().toISOString(),
                message: `New reel created in ${payload.new.stage} queue.`,
                raw: payload
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          )
          .subscribe();

        // Save channel to intervalId to unsubscribe later
        intervalId = channel as any;
      });
    },
    cancel() {
      if (typeof intervalId === 'object' && intervalId !== null && 'unsubscribe' in intervalId) {
        (intervalId as any).unsubscribe();
      } else if (intervalId) {
        clearInterval(intervalId as any);
      }
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
