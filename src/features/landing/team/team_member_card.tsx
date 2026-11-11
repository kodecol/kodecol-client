import Link from "next/link";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { KodecolMark } from "@/shared/ui/kodecol_mark";
import type { TeamMemberCard as TeamMemberCardData } from "./types";
import { StaticPicture } from "@/shared/ui/static_picture";

interface TeamMemberCardProps {
  member: TeamMemberCardData;
}

/**
 * Tarjeta de la crew: cabecera con glow radial y foto fundida con máscara degradada,
 * rol, nombre, bio, chips y link "Ver portafolio →" (fiel al mockup).
 */
export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <GlassCard
      as="article"
      interactive
      className="flex h-full flex-col overflow-hidden rounded-xl p-0"
    >
      <div
        className="relative h-[248px] shrink-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(52,224,161,.18), rgba(0,115,92,.10) 46%, rgba(12,35,31,0) 74%)",
        }}
      >
        {member.photo_src ? (
          <StaticPicture
            src_base={member.photo_src.replace(/\.[a-zA-Z]+$/, "")}
            fallback_extension={member.photo_src.endsWith(".jpg") ? "jpg" : "png"}
            alt={`Foto de ${member.name}`}
            width={460}
            height={690}
            fill
            className="object-contain object-bottom p-2"
            style={{
              maskImage: "linear-gradient(to bottom, #000 64%, transparent 99%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 64%, transparent 99%)",
            }}
          />
        ) : (
          /* Placeholder de marca mientras no hay foto (pendiente de contenido) */
          <div className="grid h-full place-items-center">
            <KodecolMark size={64} className="opacity-70" />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[rgba(12,35,31,.9)]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6 pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-500">
          {member.role}
        </span>
        <h3 className="font-sora text-[21px] font-semibold text-text-primary">
          {member.name}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-text-secondary">
          {member.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {member.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
        {member.slug ? (
          <Link
            href={`/equipo/${member.slug}`}
            className="group mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-mint-500 transition-[gap] duration-fast hover:gap-3"
          >
            Ver portafolio <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </GlassCard>
  );
}
