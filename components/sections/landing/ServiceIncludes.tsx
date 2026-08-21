import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/animations";
import { SECTION_Y, TEXT_BODY } from "./styles";

interface ServiceIncludesProps {
  title?: string;
  items?: string[];
}

export default function ServiceIncludes({ title, items }: ServiceIncludesProps) {
  return (
    <section className="bg-(--purple-soft)">
      <div className={`mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-2 ${SECTION_Y}`}>
        <div className="px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[28rem]">{title}</SectionTitle>
          </FadeIn>
        </div>

        <div className="px-7 sm:px-8 md:px-12 lg:pl-8 lg:pr-20 xl:pl-16 xl:pr-28 mt-10 lg:mt-0">
          <FadeIn direction="up">
            <ul
              className={`max-w-[24rem] flex flex-col gap-2 sm:gap-2.5 text-(--white) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              {items?.map((item, i) => (
                <li key={i} className="flex gap-3 sm:gap-4">
                  <span className="font-bold text-(--green-light) shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
