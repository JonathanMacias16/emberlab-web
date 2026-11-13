import LandingIntro from "./LandingIntro";
import ProjectTypes from "./ProjectTypes";
import WhyUs from "./WhyUs";
import HowItWorks from "./HowItWorks";
import Faq from "./Faq";
import ServiceIncludes from "./ServiceIncludes";
import CaseStudies from "./CaseStudies";
import CtaBand from "./CtaBand";
import Analyzer from "./Analyzer";
import TalkToUs from "./TalkToUs";
import LandingFooter from "./LandingFooter";
import BackToTop from "@/components/ui/BackToTop";
import ChatBubble from "@/components/chat/ChatBubble";
import WhatsAppBubble from "@/components/ui/WhatsAppBubble";
import type { LandingVariant } from "./variants";
import type { LandingWebData } from "@/types/sanity";

/**
 * Todo lo que va debajo del banner, compartido por las tres landings. Recibe
 * los datos ya pasados por `applyVariant`. En `agenda` y `formulario` se
 * quitan el analizador y "¿Prefieres hablar directo?": la página tiene una
 * sola acción, la del banner. Sin analizador tampoco hace falta el chat.
 */
export default function LandingBody({ page, variant }: { page: LandingWebData; variant: LandingVariant }) {
  const full = variant === "boton";

  return (
    <>
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
      {full && (
        <>
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
        </>
      )}
      <LandingFooter
        tagline={page.footerTagline}
        brandLine1={page.footerBrandLine1}
        brandLine2={page.footerBrandLine2}
        copyright={page.footerCopyright}
      />
      <WhatsAppBubble />
      {full && <ChatBubble variant="modal" />}
      <BackToTop />
    </>
  );
}
