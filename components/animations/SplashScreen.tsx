"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BARS = [
  {
    d: "M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z",
    rot: 180,
  },
  {
    d: "M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z",
    rot: 270,
  },
  {
    d: "M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z",
    rot: 225,
  },
  {
    d: "M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z",
    rot: 135,
  },
];
const SPARKLES = [
  {
    d: "M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z",
    origin: "88px 28px",
  },
  {
    d: "M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z",
    origin: "20px 22px",
  },
];

function StaggeredSpinLoop() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setKey((k) => k + 1), 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44">
      <svg
        key={key}
        width="100%"
        height="100%"
        viewBox="0 0 118 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {BARS.map((bar, i) => (
          <motion.path
            key={i}
            d={bar.d}
            fill="#E83F40"
            initial={{ rotate: bar.rot, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
            style={{ transformOrigin: "59px 59px" }}
          />
        ))}
        {SPARKLES.map((s, i) => (
          <motion.path
            key={`s-${i}`}
            d={s.d}
            fill="#E83F40"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
            style={{ transformOrigin: s.origin }}
          />
        ))}
      </svg>
    </div>
  );
}

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setShow(false), 500);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "";
    }
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--white)]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <StaggeredSpinLoop />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
