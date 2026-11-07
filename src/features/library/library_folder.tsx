"use client";

import { useEffect, useState } from "react";
import GlassFolder, { type FolderFile } from "@/shared/ui/glass_folder";

interface LibraryFolderProps {
  label: string;
  meta: string;
  image: string;
  files: FolderFile[];
}

/** La carpeta de vidrio de una sección, a la medida de la pantalla. */
export function LibraryFolder({ label, meta, image, files }: LibraryFolderProps) {
  const [width, set_width] = useState(340);

  useEffect(() => {
    const fit = () => set_width(Math.round(Math.min(440, Math.max(280, window.innerWidth - 56))));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <GlassFolder
      label={label}
      meta={meta}
      tone="dark"
      image={image}
      files={files}
      action="none"
      labelPlacement="bottom-left"
      width={width}
      appearDelay={120}
    />
  );
}
