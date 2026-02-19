"use client";

import React from "react";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { HomeIcon } from "@sanity/icons";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemas/index";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  theme: {
    "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  subtitle: "Gestión de Contenidos - EmberLab",
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Panel de Control")
          .items([
            S.listItem()
              .title("Página de Inicio")
              .icon(HomeIcon)
              .child(
                S.document()
                  .title("Editor Visual de Landing Page")
                  .schemaType("landingPage")
                  .documentId("landingPage")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
