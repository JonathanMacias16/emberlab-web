export default function SocialIcon({ icon }: { icon: "fb" | "ig" | "in" }) {
  const paths: Record<string, React.ReactNode> = {
    fb: (
      <path
        d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        fill="currentColor"
      />
    ),
    ig: (
      <>
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </>
    ),
    in: (
      <>
        <path
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"
          fill="currentColor"
        />
        <rect x="2" y="9" width="4" height="12" fill="currentColor" />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
      </>
    ),
  };
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--white)]">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[var(--purple)]"
        fill="none"
      >
        {paths[icon]}
      </svg>
    </div>
  );
}
