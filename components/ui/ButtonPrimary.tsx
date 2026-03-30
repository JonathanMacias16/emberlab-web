export default function ButtonPrimary({
  children,
  variant = "purple",
  href,
  target,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "purple" | "red";
  href?: string;
  target?: string;
  className?: string;
}) {
  const bg =
    variant === "purple"
      ? "bg-[var(--purple)] hover:bg-[var(--purple-soft)]"
      : "bg-[var(--red)] hover:brightness-110";
  const classes = `${bg} text-[var(--white)] rounded-[20px] px-[1.96rem] py-[1.4rem] text-[1.36rem] font-bold tracking-[-0.05em] transition-all cursor-pointer inline-block text-center ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
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
