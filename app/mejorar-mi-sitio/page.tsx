import type { Metadata } from "next";
import LandingNav from "@/components/sections/landing/LandingNav";
import AgendaHero from "@/components/sections/landing/heroes/AgendaHero";
import LandingBody from "@/components/sections/landing/LandingBody";
import { getLandingData } from "@/components/sections/landing/getLandingData";
import { applyVariant } from "@/components/sections/landing/variants";

export const metadata: Metadata = {
  title: "¿Ya tienes sitio web y quieres mejorarlo? | EmberLab",
  description:
    "Agenda 20 minutos con un especialista de Ember Lab. Revisamos tu sitio contigo y sales con las 3 mejoras que más impacto tendrían.",
  alternates: { canonical: "https://tuweb.emberlab.mx/mejorar-mi-sitio" },
};

/** Landing de agenda: mismo cuerpo que `/landing`, con el calendario en el banner. */
export default async function MejorarMiSitioPage() {
  const page = applyVariant(await getLandingData(), "agenda");

  return (
    <div id="top" className="min-h-screen w-full bg-(--white)">
      <LandingNav links={page.navLinks} socialLinks={page.navSocialLinks} />
      <AgendaHero />
      <LandingBody page={page} variant="agenda" />
    </div>
  );
}
