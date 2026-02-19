import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import ProblemaIntro from "@/components/sections/ProblemaIntro";
import ProblemaDark from "@/components/sections/ProblemaDark";
import Pilares from "@/components/sections/Pilares";
import ParaTi from "@/components/sections/ParaTi";
import Proceso from "@/components/sections/Proceso";
import Resultados from "@/components/sections/Resultados";
import Portfolio from "@/components/sections/Portfolio";
import CTAFinal from "@/components/sections/CTAFinal";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--white)] overflow-x-hidden">
      <Nav />
      <Hero />
      <ProblemaIntro />
      <ProblemaDark />
      <Pilares />
      <ParaTi />
      <Proceso />
      <Resultados />
      <Portfolio />
      <CTAFinal />
      <Footer />
    </div>
  );
}
