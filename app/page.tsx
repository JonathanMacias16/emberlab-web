"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

// SVG paths del logo
const BARS = [
  "M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z",
  "M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z",
  "M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z",
  "M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z",
];
const SPARKLES = [
  { d: "M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z", origin: "88px 28px" },
  { d: "M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z", origin: "20px 22px" },
];

// — Animaciones —

function BreathingFire({ k }: { k: number }) {
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none">
      <motion.g animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "59px 59px" }}>
        {BARS.map((d, i) => (
          <motion.path key={i} d={d} fill="#E83F40" animate={{ fill: ["#E83F40", "#FF6B35", "#E83F40"] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
        ))}
        {SPARKLES.map((s, i) => (
          <motion.path key={`s-${i}`} d={s.d} fill="#E83F40" animate={{ fill: ["#E83F40", "#FFD700", "#E83F40"], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }} style={{ transformOrigin: s.origin }} />
        ))}
      </motion.g>
    </svg>
  );
}

function EmberPulse({ k }: { k: number }) {
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none" overflow="visible">
      <motion.g animate={{ filter: ["drop-shadow(0 0 2px #E83F40)", "drop-shadow(0 0 20px #E83F40)", "drop-shadow(0 0 2px #E83F40)"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        {BARS.map((d, i) => <path key={i} d={d} fill="#E83F40" />)}
      </motion.g>
      {SPARKLES.map((s, i) => (
        <motion.path key={`s-${i}`} d={s.d} fill="#E83F40" animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} style={{ transformOrigin: s.origin }} />
      ))}
    </svg>
  );
}

function FlameFlicker({ k }: { k: number }) {
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none">
      {BARS.map((d, i) => (
        <motion.path key={i} d={d} fill="#E83F40" animate={{ x: [0, (i % 2 === 0 ? 1 : -1) * 1.5, 0, (i % 2 === 0 ? -1 : 1) * 1, 0], y: [0, -1.5, 0.5, -1, 0] }} transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {SPARKLES.map((s, i) => (
        <motion.path key={`s-${i}`} d={s.d} fill="#E83F40" animate={{ opacity: [1, 0.4, 1, 0.6, 1], scale: [1, 1.2, 0.9, 1.1, 1], y: [0, -2, 1, -1.5, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }} style={{ transformOrigin: s.origin }} />
      ))}
    </svg>
  );
}

function SparkleOrbit({ k }: { k: number }) {
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none">
      {BARS.map((d, i) => (
        <motion.path key={i} d={d} fill="#E83F40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
      ))}
      {SPARKLES.map((s, i) => (
        <motion.path key={`s-${i}`} d={s.d} fill="#E83F40" animate={{ rotate: i === 0 ? 360 : -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "59px 59px" }} />
      ))}
    </svg>
  );
}

function ScatterAssemble({ k }: { k: number }) {
  const offsets = [{ x: -80, y: 0 }, { x: 0, y: -80 }, { x: 60, y: -60 }, { x: -60, y: 60 }];
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none">
      {BARS.map((d, i) => (
        <motion.path key={i} d={d} fill="#E83F40" initial={{ x: offsets[i].x, y: offsets[i].y, opacity: 0, rotate: (i + 1) * 90 }} animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }} transition={{ duration: 0.8, delay: i * 0.08, type: "spring", damping: 12 }} style={{ transformOrigin: "59px 59px" }} />
      ))}
      {SPARKLES.map((s, i) => (
        <motion.path key={`s-${i}`} d={s.d} fill="#E83F40" initial={{ x: i === 0 ? 50 : -50, y: -50, opacity: 0, scale: 0 }} animate={{ x: 0, y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5, type: "spring", damping: 10 }} style={{ transformOrigin: s.origin }} />
      ))}
    </svg>
  );
}

function DrawOn({ k }: { k: number }) {
  return (
    <svg key={k} width="96" height="96" viewBox="0 0 118 118" fill="none">
      {BARS.map((d, i) => (
        <motion.path key={i} d={d} stroke="#E83F40" strokeWidth={1} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1, fill: "#E83F40" }} transition={{ pathLength: { duration: 0.8, delay: i * 0.2, ease: "easeInOut" }, fill: { duration: 0.3, delay: i * 0.2 + 0.6 } }} />
      ))}
      {SPARKLES.map((s, i) => (
        <motion.path key={`s-${i}`} d={s.d} stroke="#E83F40" strokeWidth={0.5} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1, fill: "#E83F40" }} transition={{ pathLength: { duration: 0.5, delay: 1 + i * 0.15 }, fill: { duration: 0.2, delay: 1.3 + i * 0.15 } }} />
      ))}
    </svg>
  );
}

const LOGOS = [BreathingFire, EmberPulse, FlameFlicker, SparkleOrbit, ScatterAssemble, DrawOn];

// —

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function ComingSoon() {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoKey, setLogoKey] = useState(0);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Logo = LOGOS[logoIndex];

  function handleClick() {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setLogoIndex((i) => (i + 1) % LOGOS.length);
      setLogoKey((k) => k + 1);
    }
  }

  return (
    <main
      className="min-h-screen w-full bg-[var(--purple)] flex flex-col items-center justify-center px-6 select-none"
      onClick={handleClick}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            <motion.div
              key={logoKey}
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.3, rotate: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo k={logoKey} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-[var(--white)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-0.05em] leading-[0.9]"
        >
          Creative people
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-[var(--red)] font-light tracking-[-0.03em] leading-[1.2]"
        >
          need time to sit around and do nothing.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-[var(--purple-light)] text-sm sm:text-base font-light tracking-[0.08em] mt-4"
        >
          coming soon
        </motion.p>
      </motion.div>
    </main>
  );
}
