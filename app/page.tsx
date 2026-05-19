import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Architecture } from "@/components/architecture";
import { Principles } from "@/components/principles";
import { TechStack } from "@/components/tech-stack";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getPortfolioContent } from "@/src/content/portfolio-store";

export default async function Home() {
  const c = await getPortfolioContent();
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Nav content={c.nav} />
      <Hero content={c.hero} />
      <About content={c.about} />
      <Experience content={c.experience} />
      <Projects content={c.projects} />
      <Architecture content={c.architecture} />
      <Principles content={c.principles} />
      <TechStack content={c.techStack} />
      <Contact content={c.contact} />
      <Footer content={c.footer} personal={c.personal} />
    </main>
  );
}
