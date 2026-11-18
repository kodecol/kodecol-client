import { StaticPicture } from "@/shared/ui/static_picture";

interface RetroMonitorProps {
  video: string;
  poster: string;
}

/**
 * El computador retro beige de los videos, recortado, con un reel encendido en
 * su pantalla. La pantalla va POR ENCIMA del cuerpo: en el PNG es negra y opaca.
 * Rectángulo de la pantalla: kodecol-video/01-conocimiento/biblioteca/medios-interfaz/crt-frontal.json.
 */
export function RetroMonitor({ video, poster }: RetroMonitorProps) {
  return (
    <div className="lib-monitor">
      <StaticPicture
        src_base="/images/scenes/crt_frontal"
        alt=""
        width={560}
        height={426}
        priority
        className="lib-monitor-body"
      />
      <div className="lib-monitor-screen">
        <video src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
    </div>
  );
}
