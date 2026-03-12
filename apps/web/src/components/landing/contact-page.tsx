import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactReasons = [
  { value: "bpo-service", label: "BPO Service" },
  { value: "demo", label: "Demo" },
  { value: "pricing", label: "Pricing" },
  { value: "custom-development", label: "Custom Development" },
  { value: "general-inquiry", label: "General Inquiry" },
];

const emailAddresses = [
  { label: "General", value: "Contact@workholo.com" },
  { label: "HR", value: "Hr@workholo.com" },
  { label: "Sales", value: "Sales@workholo.com" },
];

const emailIcon = (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const phoneIcon = (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const officeIcon = (
  <svg
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export function ContactPage() {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#7C5CFF]/10">
            <svg
              fill="none"
              height="28"
              stroke="#7C5CFF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="28"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>
          <h2 className="font-bold text-2xl text-foreground sm:text-3xl">
            Message sent!
          </h2>
          <p className="mt-3 text-muted-foreground">
            Thanks for reaching out. Our team will get back to you within 24
            hours.
          </p>
          <Button
            className="mt-8 bg-[#7C5CFF] font-semibold uppercase tracking-wide hover:bg-[#6a4de6]"
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f5f3ff] via-background to-background px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-3.5 py-1 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="mt-5 font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
            Get in touch with <span className="text-[#7C5CFF]">our team.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Whether you need a demo, want to discuss BPO services, or have a
            question about pricing — we are here to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr]">
          {/* Left — contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-bold text-2xl text-foreground">
                Contact Information
              </h2>
              <p className="mt-2 text-muted-foreground">
                Reach us directly or fill in the form and we will respond
                promptly.
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFF]/10 text-[#7C5CFF]">
                  {emailIcon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <div className="mt-0.5 space-y-0.5">
                    {emailAddresses.map((e) => (
                      <p
                        className="text-muted-foreground text-sm"
                        key={e.label}
                      >
                        <span className="text-foreground/50 text-xs">
                          {e.label}:{" "}
                        </span>
                        <a
                          className="hover:text-[#7C5CFF]"
                          href={`mailto:${e.value}`}
                        >
                          {e.value}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFF]/10 text-[#7C5CFF]">
                  {phoneIcon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Phone</p>
                  <p className="mt-0.5 text-muted-foreground text-sm">
                    +91-8009xxxxxx
                  </p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFF]/10 text-[#7C5CFF]">
                  {officeIcon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Registered Office
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-sm leading-relaxed">
                    WORK HOLO (OPC) PRIVATE LIMITED
                    <br />
                    Raj Nagar, Dwarka,
                    <br />
                    New Delhi – 110078, Delhi, India
                  </p>
                  <p className="mt-1 text-muted-foreground/70 text-xs">
                    CIN: U63119UT2026OPC020570
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right — form */}
          <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm dark:bg-card">
            {/* Purple accent bar */}
            <div className="-mx-8 -mt-8 mb-8 h-1.5 rounded-t-2xl bg-[#7C5CFF]" />

            <h2 className="font-bold text-foreground text-xl">
              Send us a message
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Fill in your details below and we will get back to you within 24
              hours.
            </p>

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    className="font-medium text-foreground text-sm"
                    htmlFor="firstName"
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="focus-visible:ring-[#7C5CFF]"
                    id="firstName"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    className="font-medium text-foreground text-sm"
                    htmlFor="lastName"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="focus-visible:ring-[#7C5CFF]"
                    id="lastName"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    className="font-medium text-foreground text-sm"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="focus-visible:ring-[#7C5CFF]"
                    id="email"
                    placeholder="john@company.com"
                    required
                    type="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    className="font-medium text-foreground text-sm"
                    htmlFor="phone"
                  >
                    Phone
                  </Label>
                  <Input
                    className="focus-visible:ring-[#7C5CFF]"
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label
                  className="font-medium text-foreground text-sm"
                  htmlFor="address"
                >
                  Address
                </Label>
                <Input
                  className="focus-visible:ring-[#7C5CFF]"
                  id="address"
                  placeholder="123 Main St, City, State"
                />
              </div>

              {/* Reason for Contact */}
              <div className="space-y-1.5">
                <Label className="font-medium text-foreground text-sm">
                  Reason for Contact <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={setReason} required value={reason}>
                  <SelectTrigger className="w-full focus:ring-[#7C5CFF]">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contactReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  className="w-full bg-[#7C5CFF] font-semibold uppercase tracking-wide hover:bg-[#6a4de6]"
                  size="lg"
                  type="submit"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
