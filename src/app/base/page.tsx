import { BaseNav } from "@/components/base/BaseNav";
import { BaseHero } from "@/components/base/BaseHero";
import { BaseCatalog } from "@/components/base/BaseCatalog";
import { BaseStory } from "@/components/base/BaseStory";
import { BaseFooter } from "@/components/base/BaseFooter";

export default function BasePage() {
  return (
    <main className="base-page">
      <BaseNav />
      <BaseHero />
      <BaseCatalog />
      <BaseStory />
      <BaseFooter />
    </main>
  );
}
