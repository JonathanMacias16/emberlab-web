import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Se cambió a false para que los cambios en Sanity se vean de inmediato en Vercel
});
