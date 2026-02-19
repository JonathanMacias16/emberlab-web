import type { SchemaTypeDefinition } from "sanity";
import { landingPage } from "./landing-page";
import { navLink } from "./objects/nav-link";
import { socialLink } from "./objects/social-link";
import { ctaButton } from "./objects/cta-button";
import { problemCard } from "./objects/problem-card";
import { pilarCard } from "./objects/pilar-card";
import { listItem } from "./objects/list-item";
import { processStep } from "./objects/process-step";
import { portfolioProject } from "./objects/portfolio-project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    landingPage,
    navLink,
    socialLink,
    ctaButton,
    problemCard,
    pilarCard,
    listItem,
    processStep,
    portfolioProject,
  ],
};
