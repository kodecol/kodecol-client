import {
  GUIDE_LEVEL_LABELS,
  GUIDE_TOPIC_LABELS,
  type LibraryGuide,
} from "@/core/domain/library_guide";
import type { FilterableGuide } from "./guide_filters";
import { build_guide_path, format_guide_date, get_guide_media } from "./library_paths";

/** De la guía del dominio a los datos que pinta una tarjeta. */
export function to_card(guide: LibraryGuide, is_new = false): FilterableGuide {
  const media = get_guide_media(guide.slug);
  return {
    slug: guide.slug,
    href: build_guide_path(guide.slug),
    title: guide.title,
    title_keyword: guide.title_keyword,
    summary: guide.summary,
    tags: [GUIDE_TOPIC_LABELS[guide.topic], `${GUIDE_LEVEL_LABELS[guide.level]} · ${guide.duration}`, guide.made_with[0]],
    date: format_guide_date(guide.published_at),
    cover: media.cover_3x4,
    preview: media.result_preview,
    is_new,
    topic: guide.topic,
    topic_label: GUIDE_TOPIC_LABELS[guide.topic],
    level: guide.level,
    level_label: GUIDE_LEVEL_LABELS[guide.level],
  };
}
