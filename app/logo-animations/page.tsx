"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// SVG paths extracted from logo.svg
const SPARKLE_1 =
  "M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z";
const SPARKLE_2 =
  "M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z";
const BAR_H =
  "M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z";
const BAR_V =
  "M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z";
const BAR_DIAG_1 =
  "M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z";
const BAR_DIAG_2 =
  "M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z";

const ALL_BARS = [BAR_H, BAR_V, BAR_DIAG_1, BAR_DIAG_2];
const ALL_SPARKLES = [SPARKLE_1, SPARKLE_2];

interface AnimationCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onReplay: () => void;
}

function AnimationCard({ title, description, children, onReplay }: AnimationCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--purple-soft)]/20 bg-[var(--purple)]/50 p-8 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-[var(--white)]">{title}</h2>
      <p className="text-sm text-[var(--purple-light)] text-center">{description}</p>
      <div className="flex h-48 w-48 items-center justify-center">{children}</div>
      <button
        onClick={onReplay}
        className="rounded-lg bg-[var(--red)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
      >
        Replay
      </button>
    </div>
  );
}

// 1. Spark Ignite — bars grow from center, sparkles pop in
function SparkIgnite({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#E83F40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.12, ease: "backOut" }}
          style={{ transformOrigin: "59px 59px" }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.15, ease: "easeOut" }}
          style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
        />
      ))}
    </svg>
  );
}

// 2. Ember Pulse — continuous pulsing glow
function EmberPulse({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none" overflow="visible">
      <motion.g
        animate={{
          filter: [
            "drop-shadow(0 0 2px #E83F40)",
            "drop-shadow(0 0 16px #E83F40)",
            "drop-shadow(0 0 2px #E83F40)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {ALL_BARS.map((d, i) => (
          <path key={i} d={d} fill="#E83F40" />
        ))}
      </motion.g>
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
        />
      ))}
    </svg>
  );
}

// 3. Staggered Spin — each bar rotates in from different angle
function StaggeredSpin({ playKey }: { playKey: number }) {
  const rotations = [0, 90, 45, -45];
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#E83F40"
          initial={{ rotate: rotations[i] + 180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
          style={{ transformOrigin: "59px 59px" }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
          style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
        />
      ))}
    </svg>
  );
}

// 4. Draw On — stroke drawing effect
function DrawOn({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#E83F40"
          strokeWidth={1}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, fill: "#E83F40" }}
          transition={{
            pathLength: { duration: 0.8, delay: i * 0.2, ease: "easeInOut" },
            fill: { duration: 0.3, delay: i * 0.2 + 0.6 },
          }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          stroke="#E83F40"
          strokeWidth={0.5}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, fill: "#E83F40" }}
          transition={{
            pathLength: { duration: 0.5, delay: 1 + i * 0.15 },
            fill: { duration: 0.2, delay: 1.3 + i * 0.15 },
          }}
        />
      ))}
    </svg>
  );
}

// 5. Flame Flicker — organic random movement like a real flame
function FlameFlicker({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#E83F40"
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * 1.5, 0, (i % 2 === 0 ? -1 : 1) * 1, 0],
            y: [0, -1.5, 0.5, -1, 0],
          }}
          transition={{
            duration: 0.8 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          animate={{
            opacity: [1, 0.4, 1, 0.6, 1],
            scale: [1, 1.2, 0.9, 1.1, 1],
            y: [0, -2, 1, -1.5, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
        />
      ))}
    </svg>
  );
}

// 6. Scatter & Assemble — pieces fly in from random positions
function ScatterAssemble({ playKey }: { playKey: number }) {
  const offsets = [
    { x: -80, y: 0 },
    { x: 0, y: -80 },
    { x: 60, y: -60 },
    { x: -60, y: 60 },
  ];
  const sparkleOffsets = [
    { x: 50, y: -50 },
    { x: -50, y: -40 },
  ];

  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#E83F40"
          initial={{
            x: offsets[i].x,
            y: offsets[i].y,
            opacity: 0,
            rotate: (i + 1) * 90,
          }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: i * 0.08, type: "spring", damping: 12 }}
          style={{ transformOrigin: "59px 59px" }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          initial={{
            x: sparkleOffsets[i].x,
            y: sparkleOffsets[i].y,
            opacity: 0,
            scale: 0,
          }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring", damping: 10 }}
          style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
        />
      ))}
    </svg>
  );
}

// 7. Breathing Fire — scale oscillation with color temperature shift
function BreathingFire({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "59px 59px" }}
      >
        {ALL_BARS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="#E83F40"
            animate={{
              fill: ["#E83F40", "#FF6B35", "#E83F40"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
        {ALL_SPARKLES.map((d, i) => (
          <motion.path
            key={`s-${i}`}
            d={d}
            fill="#E83F40"
            animate={{
              fill: ["#E83F40", "#FFD700", "#E83F40"],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: i === 0 ? "88px 28px" : "20px 22px" }}
          />
        ))}
      </motion.g>
    </svg>
  );
}

// 8. Rotate Reveal — full logo rotates in with scale
function RotateReveal({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      <motion.g
        initial={{ rotate: -270, scale: 0, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, type: "spring", damping: 10, stiffness: 60 }}
        style={{ transformOrigin: "59px 59px" }}
      >
        {ALL_BARS.map((d, i) => (
          <path key={i} d={d} fill="#E83F40" />
        ))}
        {ALL_SPARKLES.map((d, i) => (
          <path key={`s-${i}`} d={d} fill="#E83F40" />
        ))}
      </motion.g>
    </svg>
  );
}

// 9. Sparkle Orbit — sparkles orbit around the static logo
function SparkleOrbit({ playKey }: { playKey: number }) {
  return (
    <svg key={playKey} width="120" height="120" viewBox="0 0 118 118" fill="none">
      {ALL_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#E83F40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
      ))}
      {ALL_SPARKLES.map((d, i) => (
        <motion.path
          key={`s-${i}`}
          d={d}
          fill="#E83F40"
          animate={{ rotate: i === 0 ? 360 : -360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "59px 59px" }}
        />
      ))}
    </svg>
  );
}

const ANIMATIONS = [
  {
    id: "spark-ignite",
    title: "Spark Ignite",
    description: "Las barras crecen desde el centro y las chispas aparecen con un pop — la chispa que enciende.",
    Component: SparkIgnite,
  },
  {
    id: "ember-pulse",
    title: "Ember Pulse",
    description: "Brillo pulsante continuo como una brasa viva, las chispas parpadean.",
    Component: EmberPulse,
  },
  {
    id: "staggered-spin",
    title: "Staggered Spin",
    description: "Cada barra rota desde un ángulo distinto hasta formar el logo.",
    Component: StaggeredSpin,
  },
  {
    id: "draw-on",
    title: "Draw On",
    description: "El logo se dibuja trazo por trazo como si una mano lo creara en vivo.",
    Component: DrawOn,
  },
  {
    id: "flame-flicker",
    title: "Flame Flicker",
    description: "Movimiento orgánico que simula el parpadeo de una llama real.",
    Component: FlameFlicker,
  },
  {
    id: "scatter-assemble",
    title: "Scatter & Assemble",
    description: "Las piezas vuelan desde distintas direcciones y se ensamblan como chispas que convergen.",
    Component: ScatterAssemble,
  },
  {
    id: "breathing-fire",
    title: "Breathing Fire",
    description: "El logo respira con cambios de escala y temperatura de color — de rojo a naranja a dorado.",
    Component: BreathingFire,
  },
  {
    id: "rotate-reveal",
    title: "Rotate Reveal",
    description: "El logo completo gira y crece con un efecto de spring elástico.",
    Component: RotateReveal,
  },
  {
    id: "sparkle-orbit",
    title: "Sparkle Orbit",
    description: "Las chispas orbitan alrededor del logo estático como partículas de fuego.",
    Component: SparkleOrbit,
  },
];

export default function LogoAnimationsPage() {
  const [replayKeys, setReplayKeys] = useState<Record<string, number>>(() =>
    Object.fromEntries(ANIMATIONS.map((a) => [a.id, 0]))
  );

  function replay(id: string) {
    setReplayKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  }

  function replayAll() {
    setReplayKeys((prev) =>
      Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v + 1]))
    );
  }

  return (
    <main className="min-h-screen bg-[var(--purple)] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-[var(--purple-light)] transition-colors hover:text-[var(--white)]"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-[var(--white)] md:text-5xl">
            Animaciones del Logo
          </h1>
          <p className="mt-4 text-lg text-[var(--purple-light)]">
            La chispa que suelta la brasa — explorar distintas formas de darle vida.
          </p>
          <button
            onClick={replayAll}
            className="mt-6 rounded-xl bg-[var(--red)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-80"
          >
            Replay todas
          </button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ANIMATIONS.map(({ id, title, description, Component }) => (
            <AnimationCard
              key={id}
              title={title}
              description={description}
              onReplay={() => replay(id)}
            >
              <Component playKey={replayKeys[id]} />
            </AnimationCard>
          ))}
        </div>
      </div>
    </main>
  );
}
