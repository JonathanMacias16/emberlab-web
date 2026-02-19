export default function ButtonPrimary({
  children,
  variant = "purple",
}: {
  children: React.ReactNode;
  variant?: "purple" | "red";
}) {
  const bg =
    variant === "purple"
      ? "bg-[var(--purple)] hover:bg-[var(--purple-soft)]"
      : "bg-[var(--red)] hover:brightness-110";
  return (
    <button
      className={`${bg} text-[var(--white)] rounded-[20px] px-10 py-4 text-lg font-medium tracking-[-0.05em] transition-all cursor-pointer`}
    >
      {children}
    </button>
  );
}
