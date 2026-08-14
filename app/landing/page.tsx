import type { Metadata } from "next";
import LandingNav from "@/components/sections/landing/LandingNav";
import LandingHero from "@/components/sections/landing/LandingHero";
import LandingIntro from "@/components/sections/landing/LandingIntro";
import ProjectTypes from "@/components/sections/landing/ProjectTypes";
import WhyUs from "@/components/sections/landing/WhyUs";
import HowItWorks from "@/components/sections/landing/HowItWorks";
import Faq from "@/components/sections/landing/Faq";
import ServiceIncludes from "@/components/sections/landing/ServiceIncludes";
import CaseStudies from "@/components/sections/landing/CaseStudies";
import CtaBand from "@/components/sections/landing/CtaBand";
import Analyzer from "@/components/sections/landing/Analyzer";
import TalkToUs from "@/components/sections/landing/TalkToUs";
import LandingFooter from "@/components/sections/landing/LandingFooter";
import { client } from "@/sanity/lib/client";
import { LANDING_WEB_QUERY } from "@/sanity/lib/queries";
import { defaultLandingWebData } from "@/sanity/lib/landing-web-defaults";
import type { LandingWebData } from "@/types/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cuéntanos qué necesita tu sitio web | EmberLab",
  description:
    "Responde unas preguntas y te ayudamos a identificar exactamente qué tipo de proyecto web te conviene — sin compromiso.",
};

export default async function LandingWebPage() {
  let data: LandingWebData | null = null;
  try {
    data = await client.fetch<LandingWebData | null>(
      LANDING_WEB_QUERY,
      {},
      {
        next: { revalidate: 60 },
      }
    );
  } catch {
    // Sanity not configured yet — use defaults
  }
  const page = data ?? defaultLandingWebData;

  return (
    <div id="top" className="min-h-screen w-full bg-(--white)">
      <LandingNav links={page.navLinks} socialLinks={page.navSocialLinks} />
      <LandingHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle}
        cta={page.heroCta}
        note={page.heroNote}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
      />
      <LandingIntro text={page.introText} cta={page.introCta} />
      <ProjectTypes
        title={page.projectTypesTitle}
        types={page.projectTypes}
        note={page.projectTypesNote}
        cta={page.projectTypesCta}
      />
      <WhyUs title={page.whyTitle} reasons={page.whyReasons} />
      <HowItWorks title={page.stepsTitle} steps={page.steps} cta={page.stepsCta} />
      <Faq title={page.faqTitle} items={page.faqItems} />
      <ServiceIncludes title={page.includesTitle} items={page.includesItems} />
      <CaseStudies title={page.casesTitle} cases={page.cases} />
      <CtaBand text={page.ctaBandText} cta={page.ctaBandButton} />
      <Analyzer
        title={page.analyzerTitle}
        description={page.analyzerDescription}
        cta={page.analyzerCta}
        note={page.analyzerNote}
      />
      <TalkToUs
        title={page.contactTitle}
        description={page.contactDescription}
        cta={page.contactCta}
      />
      <LandingFooter
        tagline={page.footerTagline}
        brandLine1={page.footerBrandLine1}
        brandLine2={page.footerBrandLine2}
        copyright={page.footerCopyright}
      />
    </div>
  );
}
