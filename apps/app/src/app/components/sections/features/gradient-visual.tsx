interface GlowConfig {
  blur: string;
  color: string;
  position: string;
  size: string;
}

interface GradientVisualProps {
  className?: string;
  darkGlows?: GlowConfig[];
  darkGradient?: string;
  glows: GlowConfig[];
  gradient: string;
}

function GradientLayer({
  className,
  glows,
  gradient,
}: {
  className: string;
  glows: GlowConfig[];
  gradient: string;
}) {
  return (
    <div className={className} style={{ background: gradient }}>
      {glows.map((glow, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${glow.position} ${glow.size} ${glow.blur}`}
          style={{ background: glow.color }}
        />
      ))}
    </div>
  );
}

export function GradientVisual({
  className,
  darkGlows,
  darkGradient,
  glows,
  gradient,
}: GradientVisualProps) {
  const base = className ?? "relative h-64 sm:h-96 rounded-xl overflow-hidden";
  const hasDark = darkGradient && darkGlows;

  if (!hasDark) {
    return <GradientLayer className={base} glows={glows} gradient={gradient} />;
  }

  return (
    <>
      <GradientLayer className={`${base} dark:hidden`} glows={glows} gradient={gradient} />
      <GradientLayer className={`${base} hidden dark:block`} glows={darkGlows} gradient={darkGradient} />
    </>
  );
}
