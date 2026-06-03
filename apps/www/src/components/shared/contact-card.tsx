import { CTAButton } from "@work-holo/ui/components/cta-button";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { Spinner } from "@work-holo/ui/components/spinner";
import { motion } from "motion/react";
import type { ContactFormType } from "@/lib/schemas/contact";
import { ContactFormSchema } from "@/lib/schemas/contact";

const serviceItems = [
  { value: "agentic-ai", label: "Agentic AI" },
  { value: "ai-agents", label: "AI Agents" },
  { value: "mvp", label: "MVP" },
  { value: "web-app-development", label: "Web App Development" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "qa-test-automation", label: "QA & Test Automation" },
  { value: "ux-ui-design", label: "UX/UI Design" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "aws", label: "AWS" },
  { value: "cloud-engineering-devops", label: "Cloud Engineering & DevOps" },
];

export function ContactCard() {
  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    } satisfies ContactFormType as ContactFormType,
    validators: {
      onSubmit: ContactFormSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] p-6 sm:rounded-3xl sm:p-12 lg:p-16">
        {/* Background SVG pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <motion.div
              className="flex flex-col gap-8 lg:justify-between lg:gap-0"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div>
                <p className="mb-4 font-medium text-primary text-xs uppercase tracking-[0.2em] sm:mb-5 sm:text-sm">
                  [ GET IN TOUCH ]
                </p>
                <h2 className="mb-6 font-bold text-2xl text-foreground leading-[1.15] tracking-tight sm:mb-8 sm:text-4xl sm:leading-[1.1] lg:text-[2.75rem]">
                  Have any Questions on Mind?{" "}
                  <span className="block">Get in Touch for</span>
                  <span className="block">Market Experts.</span>
                </h2>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8 min-[480px]:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-semibold text-foreground text-sm sm:mb-3">
                    Contact Info:
                  </h4>
                  <p className="mb-1 text-muted-foreground text-sm">
                    +91-9780970564
                  </p>
                  <p className="break-all text-muted-foreground text-sm">
                    hr@workholo.com
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-foreground text-sm sm:mb-3">
                    Find Us:
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Raj Nagar, Dwarka,
                    <br />
                    New Delhi- 1100XX, Delhi, India
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-foreground text-sm sm:mb-3">
                    Working Hours:
                  </h4>
                  <p className="mb-1 text-muted-foreground text-sm">
                    Mon - Fri <span className="text-primary">(Open)</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    09:00am - 06:00pm
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="rounded-xl border border-border/10 bg-[#111111]/80 p-5 backdrop-blur-sm sm:rounded-2xl sm:p-8 lg:p-10">
                <h3 className="mb-6 font-bold text-foreground text-xl sm:mb-8 sm:text-2xl">
                  Drop Us a <span className="text-primary">Line.</span>
                </h3>

                <form.AppForm>
                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <form.AppField name="fullName">
                        {(field) => (
                          <field.Input
                            label="Full Name *"
                            placeholder="Jane Doe"
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="email">
                        {(field) => (
                          <field.Input
                            label="Email Address *"
                            placeholder="example@gmail.com"
                            type="email"
                          />
                        )}
                      </form.AppField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <form.AppField name="phone">
                        {(field) => (
                          <field.Input
                            label="Phone Number *"
                            placeholder="+91 7989695939"
                            type="tel"
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="service">
                        {(field) => (
                          <field.Select
                            items={serviceItems}
                            label="Select Service *"
                            placeholder="Choose a service"
                          >
                            {serviceItems.map((item) => (
                              <SelectItem
                                key={item.value ?? "placeholder"}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </field.Select>
                        )}
                      </form.AppField>
                    </div>

                    <form.AppField name="message">
                      {(field) => (
                        <field.Textarea
                          label="Type Message"
                          placeholder=""
                          rows={4}
                        />
                      )}
                    </form.AppField>

                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isValidating,
                        state.isSubmitting,
                      ]}
                    >
                      {([canSubmit, isValidating, isSubmitting]) => (
                        <CTAButton
                          className="w-full justify-center"
                          disabled={!canSubmit || isValidating || isSubmitting}
                          type="submit"
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner />
                              Sending...
                            </>
                          ) : (
                            <>Send Message</>
                          )}
                        </CTAButton>
                      )}
                    </form.Subscribe>
                  </form>
                </form.AppForm>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
