import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";
import { WHY_KODECOL_CONTENT } from "./content";

/**
 * Por qué Kodecol (#nosotros): encabezado centrado con luz focal + 4 tarjetas glass
 * de diferenciadores con ícono en caja menta (fiel al mockup).
 */
export function WhyKodecolSection() {
  const content = WHY_KODECOL_CONTENT;

  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-title"
      className="relative bg-bg px-6 py-24 md:py-[110px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-full -translate-x-1/2 blur-lg"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(0,115,92,.30), transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="nosotros-title"
            eyebrow={content.eyebrow}
            title={
              <>
                {content.title_line_1}
                <br />
                {content.title_line_2}
              </>
            }
            subtitle={content.subtitle}
            title_class_name="md:text-[40px] md:leading-[1.12]"
          />
        </Reveal>

        <div className="mt-14 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {content.differentiators.map((item, index) => (
            <Reveal key={item.title} delay={80 + index * 60}>
              <GlassCard
                as="article"
                interactive
                className="flex h-full flex-col gap-4 rounded-xl p-6"
              >
                <span className="grid size-12 place-items-center rounded-lg border border-border-accent bg-surface-inset/60 text-mint-500">
                  <LineIcon name={item.icon} size={24} />
                </span>
                <h3 className="font-sora text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
