import { AppShell } from "@/components/app-shell";
import { getChannel, REELS } from "@backend/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, TrendingUp, Save, Share2 } from "lucide-react";

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params;
  const channel = getChannel(id);

  if (!channel) {
    notFound();
  }

  const channelReels = REELS.filter((r) => r.channelId === id).slice(0, 30);
  const postedReels = channelReels.filter(r => r.views);
  const avgSave = postedReels.length > 0 
    ? (postedReels.reduce((s, r) => s + (r.saveRate || 0), 0) / postedReels.length).toFixed(1)
    : "—";

  return (
    <AppShell active="/channels">
      <section className="px-6 sm:px-10 py-8 border-b border-border">
        <Link
          href="/channels"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="size-4" />
          All channels
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs">@{channel.handle}</p>
            <h1 className="mt-1 font-serif text-3xl">{channel.niche}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span
                className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                  channel.status === "live"
                    ? "bg-foreground text-background"
                    : channel.status === "ramping"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {channel.status}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {channel.language} · {channel.voice}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4">
          <Stat
            label="Followers"
            value={channel.followers.toLocaleString()}
            icon={Users}
          />
          <Stat
            label="7d Reach"
            value={channel.d7Reach.toLocaleString()}
            icon={TrendingUp}
          />
          <Stat
            label="Hook Rate"
            value={`${channel.hookRate}%`}
            icon={ArrowLeft}
          />
          <Stat
            label="Save Rate"
            value={`${channel.saveRate}%`}
            icon={Save}
          />
        </div>
      </section>

      <section className="p-6 sm:p-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Recent Reels
            </p>
            <h2 className="mt-1 font-serif text-xl">Last 30</h2>
          </div>
        </div>

        <div className="rounded-md border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Hook
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Stage
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {channelReels.map((reel) => (
                <tr key={reel.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="text-sm line-clamp-1 max-w-md">{reel.hook}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-muted">
                      {reel.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {reel.scoreInbound ? (
                      <span className="font-mono text-sm">{reel.scoreInbound}</span>
                    ) : reel.views ? (
                      <span className="font-mono text-sm text-muted-foreground">
                        {reel.views.toLocaleString()} views
                      </span>
                    ) : (
                      <span className="font-mono text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="px-5 py-4 border-r border-border last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl leading-none">{value}</p>
    </div>
  );
}