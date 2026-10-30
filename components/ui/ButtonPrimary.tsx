import { linkTarget } from "@/lib/contact";

const VARIANT_COLORS = {
  purple: "bg-[var(--purple)] text-[var(--white)] hover:bg-[var(--purple-soft)]",
  red: "bg-[var(--red)] text-[var(--white)] hover:brightness-110",
  // Texto morado: el blanco sobre naranja casi no se lee (contraste 2.4:1).
  orange: "bg-[var(--orange)] text-[var(--purple)] hover:brightness-110",
  // Verde de marca: también con texto morado, el blanco no se lee.
  green: "bg-[var(--green-light)] text-[var(--purple)] hover:brightness-110",
};

export default function ButtonPrimary({
  children,
  variant = "purple",
  href,
  target,
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANT_COLORS;
  href?: string;
  target?: string;
  className?: string;
}) {
  const colors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.purple;
  const classes = `${colors} rounded-[20px] px-[1.96rem] py-[1.4rem] text-[1.36rem] font-bold tracking-[-0.05em] transition-all cursor-pointer inline-block whitespace-nowrap text-center ${className}`;

  if (href) {
    const finalTarget = linkTarget(href, target);
    return (
      <a
        href={href}
        target={finalTarget}
        rel={finalTarget === "_blank" ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes}>
      {children}
    </button>
  );
}
