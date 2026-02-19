"use client";

import React from "react";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemas/index";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Landing Page")
              .id("landingPage")
              .child(
                S.document()
                  .schemaType("landingPage")
                  .documentId("landingPage")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
