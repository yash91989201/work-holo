import AiCta from "@/components/public/services/ai-data/ai-cta";
import AiFeatures from "@/components/public/services/ai-data/ai-features";
import AiHero from "@/components/public/services/ai-data/ai-hero";

const FEATURES = [
  {
    id: "01",
    title: "DevSecOps & Secure Development",
    description:
      "Secure coding practices, code vulnerability analysis, dependency checks, API security, and continuous security integration.",
  },
  {
    id: "02",
    title: "Cloud Security Solutions",
    description:
      "AWS, Azure & GCP security configuration, identity & access management, encryption strategies, and compliance audits.",
  },
  {
    id: "03",
    title: "Penetration Testing",
    description:
      "Web & mobile app penetration testing, network vulnerability scanning, risk assessment, and remediation guidance.",
  },
  {
    id: "04",
    title: "Network & Infrastructure Security",
    description:
      "Firewall configuration, endpoint protection, intrusion detection systems (IDS/IPS), and secure VPN setup.",
  },
  {
    id: "05",
    title: "Data Protection & Compliance",
    description:
      "GDPR-aligned data handling, role-based access control, encryption at rest & in transit, and backup & disaster recovery planning.",
  },
];

export default function CyberSecurityServices() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] selection:bg-primary/30">
      <AiHero
        breadcrumbs={["Home", "Services", "Cyber Security"]}
        ctaHref="/contact"
        ctaText="Get a Free Security Assessment"
        description="Secure Application Development & Infrastructure Protection. WorkHolo Labs delivers advanced Cyber Security Services designed to protect digital assets, secure enterprise infrastructure, and ensure compliance in today's evolving threat landscape."
        title="Enterprise Cyber Security Services"
      />
      <AiFeatures
        features={FEATURES}
        subtitle="End-to-end security solutions from code to cloud"
        title="Our Cyber Security Services"
      />
      <AiCta
        ctaHref="/contact"
        ctaText="Get a Free Security Assessment"
        description="Let's discuss how our cyber security services can protect your business from threats and ensure compliance."
        title="Secure Your Digital Assets Today"
      />
    </div>
  );
}
