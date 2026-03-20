"use client";

import { useState, type ReactNode } from "react";
import SplashScreen from "./SplashScreen";

export default function SplashGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setReady(true)} />
      <div style={{ visibility: ready ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
