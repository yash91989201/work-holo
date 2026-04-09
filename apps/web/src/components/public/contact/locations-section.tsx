import {
  IconArrowRight,
  IconBolt,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { useState } from "react";

const locations = [
  {
    name: "Dover, United States",
    address:
      "1111B South Governors Avenue, Suite 48193, Dover, DE 19904, United States",
    phone: "+1 (551) 222-0070",
    email: "contact@WorkHololabs.com",
    hours: "Mon–Fri, 9:00 AM – 6:00 PM EST",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.882434526671!2d-75.5255474!3d39.1456128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c77b0767073747%3A0x6b77960787073747!2s1111B%20S%20Governors%20Ave%2C%20Dover%2C%20DE%2019904!5e0!3m2!1sen!2sus!4v1712123456789!5m2!1sen!2sus",
  },
  {
    name: "Hyderabad, India",
    address:
      "#514, Manjeera Trinity Corporate, JNTU-Hitech City Road, Kukatpally, Hyderabad, Telangana 500072",
    phone: "+91 9390683154",
    email: "contact@WorkHololabs.com",
    hours: "Mon–Fri, 9:00 AM – 6:00 PM IST",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.263842135017!2d78.3888365!3d17.4950131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918d3637171d%3A0x8670498a44211f90!2sManjeera%20Trinity%20Corporate!5e0!3m2!1sen!2sin!4v1712123456790!5m2!1sen!2sin",
  },
  {
    name: "Bengaluru, India",
    address:
      "101, 4th Main Road, Gayathri Layout, Vijaya Bank Layout, Bilekahalli, Bengaluru, Karnataka 560076",
    phone: "+91 9014793487",
    email: "contact@WorkHololabs.com",
    hours: "Mon–Fri, 9:00 AM – 6:00 PM IST",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.123456789!2d77.6!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1712123456791!5m2!1sen!2sin",
  },
];

export function LocationsSection() {
  const [activeTab, setActiveTab] = useState("Dover, United States");

  const currentLocation =
    locations.find((loc) => loc.name === activeTab) || locations[0];

  return (
    <section className="bg-background py-24 text-foreground">
      <div className="mx-auto mb-16 max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mb-6 font-extrabold text-4xl tracking-tight md:text-5xl">
          Visit Us <span className="text-primary">Worldwide</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          With offices across 3 continents, we're always close to you. Find the
          nearest WorkHolo Labs office below.
        </p>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {locations.map((loc) => (
            <button
              className={`rounded-full px-8 py-3 font-bold transition-all ${
                activeTab === loc.name
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              key={loc.name}
              onClick={() => setActiveTab(loc.name)}
              type="button"
            >
              {loc.name}
            </button>
          ))}
        </div>

        <div className="grid items-center gap-12 rounded-[40px] border border-border bg-card p-8 md:p-12 lg:grid-cols-2">
          <div className="h-[400px] overflow-hidden rounded-3xl border border-border shadow-xl">
            <iframe
              allowFullScreen={true}
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={currentLocation?.mapUrl}
              style={{ border: 0 }}
              title={`Map of ${currentLocation?.name}`}
              width="100%"
            />
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconMapPin size={24} />
              </div>
              <div>
                <h4 className="mb-1 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                  Address
                </h4>
                <p className="font-medium text-lg leading-relaxed">
                  {currentLocation?.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconPhone size={24} />
              </div>
              <div>
                <h4 className="mb-1 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                  Phone
                </h4>
                <p className="font-medium text-lg">{currentLocation?.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconMail size={24} />
              </div>
              <div>
                <h4 className="mb-1 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                  Email
                </h4>
                <p className="font-medium text-lg">{currentLocation?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconBolt size={24} />
              </div>
              <div>
                <h4 className="mb-1 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                  Business Hours
                </h4>
                <p className="font-medium text-lg">{currentLocation?.hours}</p>
              </div>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border py-4 font-bold text-muted-foreground transition-all hover:bg-muted"
              type="button"
            >
              Open in Google Maps <IconArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
