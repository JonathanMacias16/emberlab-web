import type { SchemaTypeDefinition } from "sanity";
import { landingPage } from "./landing-page";
import { landingWeb } from "./landing-web";
import { navLink } from "./objects/nav-link";
import { socialLink } from "./objects/social-link";
import { ctaButton } from "./objects/cta-button";
import { problemCard } from "./objects/problem-card";
import { pilarCard } from "./objects/pilar-card";
import { listItem } from "./objects/list-item";
import { processStep } from "./objects/process-step";
import { portfolioProject } from "./objects/portfolio-project";
import { projectTypeCard } from "./objects/project-type-card";
import { reasonItem } from "./objects/reason-item";
import { faqItem } from "./objects/faq-item";
import { simpleStep } from "./objects/simple-step";
import { caseStudy } from "./objects/case-study";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    landingPage,
    landingWeb,
    navLink,
    socialLink,
    ctaButton,
    problemCard,
    pilarCard,
    listItem,
    processStep,
    portfolioProject,
    projectTypeCard,
    reasonItem,
    faqItem,
    simpleStep,
    caseStudy,
  ],
};
