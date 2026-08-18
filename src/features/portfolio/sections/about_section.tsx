import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Reveal } from "@/shared/ui/reveal";

interface AboutSectionProps {
  profile: DeveloperProfile;
}

/** Sobre mí: eyebrow + párrafo grande directo, sin tarjeta (fiel al mockup). */
export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section aria-labelledby="sobre-mi-title" className="px-6 py-16 md:py-20">
      <div className="mx-auto flex max-w-[820px] flex-col gap-6">
        {/*
          Era la única sección sin encabezado: el "Sobre mí" visible es un <span>
          decorativo, así que ni el esquema del documento ni el lector de pantalla
          la veían. El h2 va en sr-only para no alterar el diseño, y el eyebrow
          queda aria-hidden para no anunciarlo dos veces.
        */}
        <h2 id="sobre-mi-title" className="sr-only">
          Sobre mí
        </h2>
        <Reveal>
          <span aria-hidden>
            <Eyebrow>Sobre mí</Eyebrow>
          </span>
        </Reveal>
        <Reveal delay={80}>
          <p className="text-lg font-medium leading-relaxed text-text-primary md:text-xl">
            {profile.about}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
