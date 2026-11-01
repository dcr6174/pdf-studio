import Link from "@/components/browser-link";
import { Compass, Image as ImageIcon, Palette, Gamepad2 } from "lucide-react";
import { studioLinks, type StudioId } from "@/lib/lab-studios";
import "./studio-navigation.css";
const icons = {
  lab: Compass,
  images: ImageIcon,
  creative: Palette,
  arcade: Gamepad2,
};
/** The same destinations and names on each catalogue, with ordinary native links. */
export function StudioNavigation({ active }: { active: StudioId }) {
  return (
    <nav className="studio-switcher" aria-label="Studios">
      {studioLinks.map((s) => {
        const Icon = icons[s.id];
        return (
          <Link
            key={s.id}
            href={s.href}
            aria-current={s.id === active ? "page" : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{s.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
