import Logo from "@/components/ui/Logo";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6 md:px-12 lg:px-20 xl:px-28 lg:py-10 max-w-[1728px] mx-auto">
      <Logo className="h-8 w-auto sm:h-10 md:h-12 lg:h-14" />
      <div className="hidden md:flex items-center gap-4 lg:gap-8 text-[var(--purple)] text-sm lg:text-base xl:text-lg font-light tracking-[-0.04em]">
        <a href="#bienvenido" className="hover:opacity-70 transition-opacity">
          Bienvenido
        </a>
        <a href="#problema" className="hover:opacity-70 transition-opacity">
          ¿Qué resolvemos?
        </a>
        <a href="#pilares" className="hover:opacity-70 transition-opacity">
          4 pilares
        </a>
        <a href="#resultados" className="hover:opacity-70 transition-opacity">
          Resultados
        </a>
      </div>
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="hidden lg:flex items-center gap-2">
          <SocialIcon icon="fb" />
          <SocialIcon icon="ig" />
          <SocialIcon icon="in" />
        </div>
        <ButtonPrimary variant="purple">Evaluar mi sitio web</ButtonPrimary>
      </div>
    </nav>
  );
}
