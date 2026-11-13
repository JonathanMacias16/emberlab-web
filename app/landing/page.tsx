import type { Metadata } from "next";
import LandingNav from "@/components/sections/landing/LandingNav";
import LandingHero from "@/components/sections/landing/LandingHero";
import LandingBody from "@/components/sections/landing/LandingBody";
import { getLandingData } from "@/components/sections/landing/getLandingData";

export const metadata: Metadata = {
  title: "Cuéntanos qué necesita tu sitio web | EmberLab",
  description:
    "Responde unas preguntas y te ayudamos a identificar exactamente qué tipo de proyecto web te conviene — sin compromiso.",
  alternates: { canonical: "https://tuweb.emberlab.mx/" },
};

export default async function LandingWebPage() {
  const page = await getLandingData();

  return (
    <div id="top" className="min-h-screen w-full bg-(--white)">
      <LandingNav links={page.navLinks} socialLinks={page.navSocialLinks} />
      <LandingHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle}
        cta={page.heroCta}
        secondaryCta={page.heroSecondaryCta}
        note={page.heroNote}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
      />
      <LandingBody page={page} variant="boton" />
    </div>
  );
}
