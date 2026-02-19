"use client";

import dynamic from "next/dynamic";
import React from "react";

const Studio = dynamic(
  async () => {
    const { NextStudio } = await import("next-sanity/studio");
    const config = (await import("@/sanity.config")).default;
    return () => <NextStudio config={config} />;
  },
  { ssr: false }
);

export default function StudioPage() {
  return <Studio />;
}
