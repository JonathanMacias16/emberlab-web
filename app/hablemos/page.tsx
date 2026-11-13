import type { Metadata } from "next";
import LandingNav from "@/components/sections/landing/LandingNav";
import FormHero from "@/components/sections/landing/heroes/FormHero";
import LandingBody from "@/components/sections/landing/LandingBody";
import { getLandingData } from "@/components/sections/landing/getLandingData";
import { applyVariant } from "@/components/sections/landing/variants";

export const metadata: Metadata = {
  title: "Hablemos de tu proyecto web | EmberLab",
  description:
    "Déjanos 5 datos y te escribimos por WhatsApp para entender tu proyecto. Te decimos qué tipo de sitio te conviene, sin compromiso.",
  alternates: { canonical: "https://tuweb.emberlab.mx/hablemos" },
};

/** Landing de formulario: mismo cuerpo que `/landing`, con el formulario en el banner. */
export default async function HablemosPage() {
  const page = applyVariant(await getLandingData(), "formulario");

  return (
    <div id="top" className="min-h-screen w-full bg-(--white)">
      <LandingNav links={page.navLinks} socialLinks={page.navSocialLinks} />
      <FormHero />
      <LandingBody page={page} variant="formulario" />
    </div>
  );
}
