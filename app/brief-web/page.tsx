import type { Metadata } from "next";
import BriefForm from "@/components/sections/BriefForm";

export const metadata: Metadata = {
  title: "Cuéntanos sobre tu proyecto — EmberLab",
  description: "Responde unas preguntas rápidas para ayudarnos a entender tu negocio y tu proyecto web.",
};

export default function BriefPage() {
  return <BriefForm />;
}
