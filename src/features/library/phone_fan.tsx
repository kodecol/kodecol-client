interface PhoneFanItem {
  poster: string;
  video: string;
  label: string;
}

/**
 * Tres celulares en abanico con los reels de las guías: el del centro, al
 * frente y reproduciendo; los de los lados, inclinados y quietos.
 */
export function PhoneFan({ items }: { items: readonly PhoneFanItem[] }) {
  const [left, center, right] = [items[1], items[0], items[2]];
  return (
    <div className="lib-fan" aria-hidden="true">
      {left ? (
        <div className="lib-fan-phone lib-fan-phone--left" style={{ backgroundImage: `url(${left.poster})` }} />
      ) : null}
      {right ? (
        <div className="lib-fan-phone lib-fan-phone--right" style={{ backgroundImage: `url(${right.poster})` }} />
      ) : null}
      {center ? (
        <div className="lib-fan-phone lib-fan-phone--center">
          <video src={center.video} poster={center.poster} autoPlay muted loop playsInline preload="metadata" />
        </div>
      ) : null}
    </div>
  );
}
