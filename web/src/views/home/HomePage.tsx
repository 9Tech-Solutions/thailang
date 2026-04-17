import { CodeShowcase } from "@/widgets/code-showcase/CodeShowcase";
import { FeatureStrip } from "@/widgets/feature-strip/FeatureStrip";
import { Hero } from "@/widgets/hero/Hero";
import { SiteFooter } from "@/widgets/site-footer/SiteFooter";

export function HomePage() {
  return (
    <main>
      <Hero />
      <CodeShowcase />
      <FeatureStrip />
      <SiteFooter />
    </main>
  );
}
