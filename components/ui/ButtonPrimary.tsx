export default function ButtonPrimary({
  children,
  variant = "purple",
  href,
}: {
  children: React.ReactNode;
  variant?: "purple" | "red";
  href?: string;
}) {
  const bg =
    variant === "purple"
      ? "bg-[var(--purple)] hover:bg-[var(--purple-soft)]"
      : "bg-[var(--red)] hover:brightness-110";
  const classes = `${bg} text-[var(--white)] rounded-[20px] px-10 py-4 text-lg font-medium tracking-[-0.05em] transition-all cursor-pointer inline-block text-center`;

  if (href) {
    return (
      <a href={href} className={classes}>
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
