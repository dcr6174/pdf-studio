import "@/components/arcade-garden.css";
import { SiteHeader } from "@/components/site-header";
import { StudioNavigation } from "@/components/studio-navigation";
import { ArcadeDirectory } from "@/components/arcade-directory";
import { ArcadeHub } from "@/components/arcade-hub";
import { pageMeta } from "@/lib/page-meta";
import { PublicDirectory } from "@/components/public-directory";
import { activeArcadeGames } from "@/lib/arcade-active";
import "./arcade.css";
import "./club.css";
import "./fresh.css";
import "./expansion.css";
import "./quality.css";
import "./play-home.css";
import "./navigation.css";
export const metadata = pageMeta(
  "/lab/arcade",
  "Arcade — 100 free browser games",
  "100 free original touch-friendly mini games: cricket, volleyball, 8-ball pool, racing, endless runners, satisfying puzzles, chess and more. Free touch and keyboard games. No login.",
);
export default function Arcade() {
  return (
    <div className="arcade-shell">
      <SiteHeader />
      <StudioNavigation active="arcade" />
      <main className="arcade-main">
        <ArcadeDirectory />
        <details className="arcade-player-lounge">
          <summary>Your progress &amp; daily challenge</summary>
          <ArcadeHub />
        </details>
        <PublicDirectory
          title="Browse all Arcade games"
          entries={activeArcadeGames.map((game) => ({
            path: "/lab/arcade/" + game.slug,
            title: game.name,
          }))}
        />
      </main>
    </div>
  );
}
