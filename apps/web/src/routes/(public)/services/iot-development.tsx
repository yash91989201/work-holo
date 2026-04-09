import {
  IconBuildingFactory,
  IconChartBar,
  IconCloud,
  IconDeviceMobile,
  IconWifi,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  CloudCta,
  CloudFeatures,
  CloudHero,
} from "@/components/public/services/cloud-devops";

const features = [
  {
    title: "Custom IoT Applications",
    description:
      "Smart device control systems, industrial IoT platforms, asset tracking solutions, predictive maintenance systems, and remote monitoring applications.",
    icon: IconDeviceMobile,
  },
  {
    title: "Device Integration & Connectivity",
    description:
      "Secure communication between sensors, embedded systems, gateways, mobile apps, and cloud platforms ensuring seamless device-to-cloud interaction.",
    icon: IconWifi,
  },
  {
    title: "IoT Cloud Integration",
    description:
      "Integration with AWS IoT, Azure IoT Hub, and custom cloud infrastructure providing secure, scalable data processing and storage.",
    icon: IconCloud,
  },
  {
    title: "Analytics & Dashboards",
    description:
      "Intelligent dashboards with real-time monitoring, data visualization, alert systems, performance analytics, and predictive insights.",
    icon: IconChartBar,
  },
  {
    title: "Industrial IoT (IIoT) Solutions",
    description:
      "Smart factory automation, equipment performance tracking, supply chain visibility systems, and energy management solutions for manufacturing and enterprise sectors.",
    icon: IconBuildingFactory,
  },
];

export const Route = createFileRoute("/(public)/services/iot-development")({
  component: IotDevelopment,
});

function IotDevelopment() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Secure, Scalable & Intelligent IoT Solutions"
        eyebrow="Home / Services / IoT Development"
        title="Best IoT Development Company in India"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Start Your IoT Project"
        description="Let's discuss how IoT can transform your operations with intelligent, connected solutions."
        title="Build Your IoT Ecosystem Today"
      />
    </div>
  );
}
