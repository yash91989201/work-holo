import { EducationHero, EducationFeatures, EducationCTA } from "../../components/public/products/education";

export default function ELearningApp() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      <main>
        <EducationHero />
        <EducationFeatures />
        <EducationCTA />
      </main>
    </div>
  );
}
