import React from "react";

export const metadata = {
  title: "EmberLab Studio",
  description: "Sanity Studio para EmberLab",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ margin: 0 }}>{children}</div>
  );
}
