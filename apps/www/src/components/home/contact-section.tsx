import { useState } from "react";
import { motion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { CTAButton } from "@work-holo/ui/components/cta-button";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
              [ GET IN TOUCH ]
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight mb-8">
              Have any Questions on
              <br />
              Mind? Get in Touch for
              <br />
              Market Experts.
            </h2>

            <CTAButton icon={<IconArrowUpRight className="size-4" />} className="mb-16">
              Contact Us Now
            </CTAButton>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Contact Info:
                </h4>
                <p className="text-sm text-muted-foreground mb-1">
                  +1 (009) 544-7818
                </p>
                <p className="text-sm text-muted-foreground">
                  support@tekmino.com
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Find Us:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Renner Burg, West Rond,
                  <br />
                  MT 9421-030, USA.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Contact Info:
                </h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Mon - Fri{" "}
                  <span className="text-primary">(Open)</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  09:00am - 06.00pm
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="bg-card/40 border border-border/30 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-foreground mb-8">
                Drop Us a{" "}
                <span className="text-primary">Line.</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Email Address{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Phone Number{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Select Service{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose an Option
                      </option>
                      <option value="managed-it">Managed IT Services</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="security">Cybersecurity Solutions</option>
                      <option value="consulting">IT Consulting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Type Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder=""
                  />
                </div>

                <CTAButton
                  type="submit"
                  icon={<IconArrowUpRight className="size-4" />}
                >
                  Send Message
                </CTAButton>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
