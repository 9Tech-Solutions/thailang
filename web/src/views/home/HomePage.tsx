import { Closer } from "@/widgets/closer/Closer";
import { FeaturesSection } from "@/widgets/features-section/FeaturesSection";
import { Hero } from "@/widgets/hero/Hero";
import { KeywordIndex } from "@/widgets/keyword-index/KeywordIndex";
import { PlaygroundSection } from "@/widgets/playground-section/PlaygroundSection";
import { SiteFooter } from "@/widgets/site-footer/SiteFooter";
import { Topbar } from "@/widgets/topbar/Topbar";

export function HomePage() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <PlaygroundSection />
        <FeaturesSection />
        <KeywordIndex />
        <Closer />
      </main>
      <SiteFooter />
    </>
  );
}
