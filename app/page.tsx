import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import ProblemaIntro from "@/components/sections/ProblemaIntro";
import ProblemaDark from "@/components/sections/ProblemaDark";
import Pilares from "@/components/sections/Pilares";
import ParaTi from "@/components/sections/ParaTi";
import Proceso from "@/components/sections/Proceso";
import PlataformasMarquee from "@/components/sections/PlataformasMarquee";
import Resultados from "@/components/sections/Resultados";
import Portfolio from "@/components/sections/Portfolio";
import CTAFinal from "@/components/sections/CTAFinal";
import Footer from "@/components/sections/Footer";
import { client } from "@/sanity/lib/client";
import { LANDING_PAGE_QUERY } from "@/sanity/lib/queries";
import { defaultLandingPageData } from "@/sanity/lib/defaults";
import type { LandingPageData } from "@/types/sanity";
export const revalidate = 60; // Actualiza la página cada 60 segundos automáticamente en Vercel

export default async function Home() {
  let data: LandingPageData | null = null;
  try {
    data = await client.fetch<LandingPageData | null>(
      LANDING_PAGE_QUERY,
      {},
      {
        next: { revalidate: 60 },
      }
    );
  } catch {
    // Sanity not configured yet — use defaults
  }
  const page = data ?? defaultLandingPageData;

  return (
    <div className="min-h-screen w-full bg-[var(--white)] overflow-x-hidden">
      <Nav
        links={page.navLinks}
        socialLinks={page.navSocialLinks}
        cta={page.navCta}
      />
      <Hero
        headline1={page.heroHeadline1}
        headline2={page.heroHeadline2}
        subtitle={page.heroSubtitle}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
      />
      <ProblemaIntro
        title={page.problemaIntroTitle}
        cta={page.problemaIntroCta}
      />
      <ProblemaDark
        title={page.problemaDarkTitle}
        subtitle2={page.problemaDarkSubtitle2}
        subtitle={page.problemaDarkSubtitle}
        cta={page.problemaDarkCta}
        cards={page.problemCards}
      />
      <Pilares
        subtitle={page.pilaresSubtitle}
        title={page.pilaresTitle}
        pilares={page.pilares}
      />
      <ParaTi
        paraTiTitle={page.paraTiTitle}
        paraTiItems={page.paraTiItems}
        noParaTiTitle={page.noParaTiTitle}
        noParaTiItems={page.noParaTiItems}
        cta={page.paraTiCta}
      />
      <Proceso
        title={page.procesoTitle}
        subtitle={page.procesoSubtitle}
        steps={page.procesoSteps}
      />
      <PlataformasMarquee />
      <Resultados
        title={page.resultadosTitle}
        subtitle={page.resultadosSubtitle}
      />
      <Portfolio projects={page.portfolioProjects} />
      <CTAFinal
        title={page.ctaFinalTitle}
        description={page.ctaFinalDescription}
        cta={page.ctaFinalButton}
      />
      <Footer
        tagline={page.footerTagline}
        brandLine1={page.footerBrandLine1}
        brandLine2={page.footerBrandLine2}
        copyright={page.footerCopyright}
      />
    </div>
  );
}
