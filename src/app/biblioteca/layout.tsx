import { IBM_Plex_Mono } from "next/font/google";
import "@/features/library/library.css";

/*
  Segmento de la Biblioteca. La monoespaciada (el fósforo del CRT) solo se
  carga aquí, así el resto del sitio no la descarga.
*/
const plex_mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <div className={plex_mono.variable}>{children}</div>;
}
