import { createFileRoute } from "@tanstack/react-router";

import {
  type FC,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const Route = createFileRoute("/career")({
  component: RouteComponent,
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  avatar: string;
  name: string;
  quote: string;
  role: string;
  years: string;
}

interface CompanyValue {
  description: string;
  icon: string;
  title: string;
}

interface Perk {
  icon: string;
  label: string;
}

interface Stat {
  label: string;
  number: string;
}

interface HiringStep {
  desc: string;
  icon: string;
  step: string;
  title: string;
}

interface SelectOption {
  l: string;
  v: string;
}

type FormFields =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "qualification"
  | "experience"
  | "role"
  | "linkedin"
  | "message";

interface FormState {
  email: string;
  experience: string;
  file: File | null;
  firstName: string;
  lastName: string;
  linkedin: string;
  message: string;
  phone: string;
  qualification: string;
  role: string;
}

type FormErrors = Partial<Record<FormFields, string>>;

// ─── Data ────────────────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
    name: "Arjun Sharma",
    role: "Senior Engineer",
    avatar: "AS",
    quote:
      "Working here changed how I think about scale. We ship real products that touch millions of users — and the team is genuinely world-class.",
    years: "3 years",
  },
  {
    name: "Meera Patel",
    role: "Product Designer",
    avatar: "MP",
    quote:
      "The design culture here is unmatched. I have full ownership of my work, access to great tools, and a team that cares deeply about craft.",
    years: "2 years",
  },
  {
    name: "Ravi Kumar",
    role: "Engineering Manager",
    avatar: "RK",
    quote:
      "I've grown more here in 18 months than in my previous 4 years combined. The learning budget is real and leadership genuinely invests in you.",
    years: "1.5 years",
  },
  {
    name: "Sana Mirza",
    role: "Data Scientist",
    avatar: "SM",
    quote:
      "Remote-first culture done right. Async by default, trust-driven, and no micromanagement. I feel empowered every single day.",
    years: "2.5 years",
  },
];

const companyValues: CompanyValue[] = [
  {
    icon: "🚀",
    title: "Move Fast",
    description:
      "We ship quickly, iterate constantly, and embrace change as a competitive advantage.",
  },
  {
    icon: "🤝",
    title: "Collaborate Deep",
    description:
      "Cross-functional teams, open communication, and a culture where every voice shapes the product.",
  },
  {
    icon: "🧠",
    title: "Stay Curious",
    description:
      "Learning never stops. We invest in your growth with dedicated time for exploration.",
  },
  {
    icon: "🌍",
    title: "Build for Impact",
    description:
      "Every line of code, every design decision — made with purpose for real-world outcomes.",
  },
];

const perks: Perk[] = [
  { icon: "💰", label: "Competitive Salary" },
  { icon: "🏠", label: "Remote Friendly" },
  { icon: "📚", label: "Learning Budget" },
  { icon: "🏥", label: "Health Insurance" },
  { icon: "⏰", label: "Flexible Hours" },
  { icon: "🎯", label: "Stock Options" },
  { icon: "✈️", label: "Team Retreats" },
  { icon: "🍕", label: "Free Lunch" },
];

const stats: Stat[] = [
  { number: "35+", label: "Team Members" },
  { number: "100+", label: "Projects Delivered" },
  { number: "20+", label: "Years of Excellence" },
  { number: "15+", label: "Countries Served" },
];

const hiringSteps: HiringStep[] = [
  {
    step: "01",
    title: "Send Resume",
    desc: "Drop your resume and a short note about yourself. No cover letter walls of text required.",
    icon: "📄",
  },
  {
    step: "02",
    title: "Intro Call",
    desc: "A 30-min casual conversation. We want to understand your story, not grill you on algorithms.",
    icon: "📞",
  },
  {
    step: "03",
    title: "Skills Round",
    desc: "A focused take-home or live task — relevant, respectful of your time, and actually interesting.",
    icon: "💡",
  },
  {
    step: "04",
    title: "Offer & Onboard",
    desc: "Swift decisions, competitive package, and a warm welcome from day one.",
    icon: "🎉",
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrollReveal(): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
}

const RevealSection: FC<RevealSectionProps> = ({ children, delay = 0 }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(48px)",
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Testimonial Carousel ─────────────────────────────────────────────────────

const TestimonialCarousel: FC = () => {
  const [active, setActive] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  const go = useCallback(
    (dir: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(
          (prev) => (prev + dir + testimonials.length) % testimonials.length
        );
        setAnimating(false);
      }, 280);
    },
    [animating]
  );

  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [go]);

  const t = testimonials[active];

  const dotClick = (i: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(i);
      setAnimating(false);
    }, 280);
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        className="relative min-h-[220px] overflow-hidden rounded-3xl border border-purple-700/20 p-8 sm:p-12"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(59,130,246,0.06) 100%)",
          opacity: animating ? 0 : 1,
          transform: animating ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        <div className="absolute top-6 left-12 select-none font-serif text-7xl text-purple-400/15 leading-none">
          &ldquo;
        </div>
        <p className="relative z-10 mb-8 text-base text-slate-300 italic leading-relaxed sm:text-lg">
          {t.quote}
        </p>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 font-bold text-white text-xs">
            {t.avatar}
          </div>
          <div>
            <div className="font-bold text-sm text-white">{t.name}</div>
            <div className="text-slate-500 text-xs">
              {t.role} · {t.years}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-purple-600/30 bg-purple-700/12 text-lg text-purple-400 transition-all hover:bg-purple-700/20"
          onClick={() => go(-1)}
        >
          ‹
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              className="h-2 cursor-pointer rounded-full border-none p-0 transition-all duration-300"
              key={i}
              onClick={() => dotClick(i)}
              style={{
                width: i === active ? "24px" : "8px",
                background: i === active ? "#a855f7" : "rgba(168,85,247,0.25)",
              }}
            />
          ))}
        </div>

        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-purple-600/30 bg-purple-700/12 text-lg text-purple-400 transition-all hover:bg-purple-700/20"
          onClick={() => go(1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

// ─── Form Field Helpers ───────────────────────────────────────────────────────

interface InputFieldProps {
  errors: FormErrors;
  field: FormFields;
  form: FormState;
  half?: boolean;
  onChange: (field: FormFields, value: string) => void;
  placeholder: string;
}

const InputField: FC<InputFieldProps> = ({
  field,
  placeholder,
  half = false,
  form,
  errors,
  onChange,
}) => (
  <div
    className={`flex flex-col gap-1.5 ${half ? "min-w-[calc(50%-8px)] flex-1" : "w-full"}`}
  >
    <input
      className={`w-full rounded-xl bg-white/[0.04] px-4 py-3.5 font-[inherit] text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-purple-600 ${
        errors[field] ? "border border-red-500" : "border border-white/10"
      }`}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      value={form[field] as string}
    />
    {errors[field] && (
      <span className="text-red-500 text-xs">{errors[field]}</span>
    )}
  </div>
);

interface SelectFieldProps {
  errors: FormErrors;
  field: FormFields;
  form: FormState;
  onChange: (field: FormFields, value: string) => void;
  options: SelectOption[];
  placeholder: string;
}

const SelectField: FC<SelectFieldProps> = ({
  field,
  options,
  placeholder,
  form,
  errors,
  onChange,
}) => (
  <div className="flex min-w-[calc(50%-8px)] flex-1 flex-col gap-1.5">
    <select
      className={`w-full cursor-pointer appearance-none rounded-xl bg-[#1a1a2e] px-4 py-3.5 font-[inherit] text-sm outline-none transition-colors ${
        form[field] ? "text-white" : "text-slate-500"
      } ${errors[field] ? "border border-red-500" : "border border-white/10"}`}
      onChange={(e) => onChange(field, e.target.value)}
      value={form[field] as string}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options.map((o) => (
        <option className="bg-[#1a1a2e] text-white" key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
    {errors[field] && (
      <span className="text-red-500 text-xs">{errors[field]}</span>
    )}
  </div>
);

// ─── Resume Modal ─────────────────────────────────────────────────────────────

interface ModalProps {
  onClose: () => void;
}

const ResumeModal: FC<ModalProps> = ({ onClose }) => {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    role: "",
    linkedin: "",
    message: "",
    file: null,
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [dragOver, setDragOver] = useState<boolean>(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!(form.email.trim() && /\S+@\S+\.\S+/.test(form.email)))
      e.email = "Valid email required";
    if (!form.qualification) e.qualification = "Required";
    if (!form.experience) e.experience = "Required";
    return e;
  };

  const handleFieldChange = (field: FormFields, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (
      file.type === "application/pdf" ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx")
    ) {
      setForm((f) => ({ ...f, file }));
    }
  };

  const qualificationOptions: SelectOption[] = [
    { v: "high_school", l: "High School" },
    { v: "diploma", l: "Diploma" },
    { v: "bachelors", l: "Bachelor's Degree" },
    { v: "masters", l: "Master's Degree" },
    { v: "phd", l: "PhD" },
    { v: "other", l: "Other" },
  ];

  const experienceOptions: SelectOption[] = [
    { v: "0-1", l: "0–1 years (Fresher)" },
    { v: "1-3", l: "1–3 years" },
    { v: "3-5", l: "3–5 years" },
    { v: "5-8", l: "5–8 years" },
    { v: "8+", l: "8+ years" },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-5 backdrop-blur-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-inner { animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1); }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>
      <div className="modal-inner relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-purple-700/30 bg-[#0d0d1a]">
        {submitted ? (
          <div className="p-16 text-center">
            <div className="mb-6 text-6xl">✅</div>
            <h3 className="mb-3 bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text font-extrabold text-2xl text-transparent">
              Application Sent!
            </h3>
            <p className="mb-8 text-slate-500 leading-relaxed">
              Thank you for reaching out. We've received your application and
              will review it carefully. We'll be in touch if there's a great
              fit.
            </p>
            <button
              className="cursor-pointer rounded-full border-none bg-purple-700 px-8 py-3.5 font-semibold text-sm text-white transition-colors hover:bg-purple-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-8 sm:p-11">
            <button
              className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-white/[0.06] text-lg text-slate-400 transition-colors hover:bg-white/10"
              onClick={onClose}
            >
              ×
            </button>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-3.5 py-1 text-[11px] text-purple-400 tracking-widest">
                [ APPLY NOW ]
              </div>
              <h2 className="mb-1.5 font-extrabold text-2xl tracking-tight">
                Send Your Application
              </h2>
              <p className="text-slate-500 text-sm">
                We'll reach out when the right opportunity comes up.
              </p>
            </div>

            {/* Name row */}
            <div className="mb-3.5 flex flex-wrap gap-3.5">
              <InputField
                errors={errors}
                field="firstName"
                form={form}
                half
                onChange={handleFieldChange}
                placeholder="First Name *"
              />
              <InputField
                errors={errors}
                field="lastName"
                form={form}
                half
                onChange={handleFieldChange}
                placeholder="Last Name *"
              />
            </div>

            {/* Email / Phone */}
            <div className="mb-3.5 flex flex-wrap gap-3.5">
              <InputField
                errors={errors}
                field="email"
                form={form}
                half
                onChange={handleFieldChange}
                placeholder="Email Address *"
              />
              <InputField
                errors={errors}
                field="phone"
                form={form}
                half
                onChange={handleFieldChange}
                placeholder="Phone Number"
              />
            </div>

            {/* Qualification / Experience */}
            <div className="mb-3.5 flex flex-wrap gap-3.5">
              <SelectField
                errors={errors}
                field="qualification"
                form={form}
                onChange={handleFieldChange}
                options={qualificationOptions}
                placeholder="Highest Qualification *"
              />
              <SelectField
                errors={errors}
                field="experience"
                form={form}
                onChange={handleFieldChange}
                options={experienceOptions}
                placeholder="Years of Experience *"
              />
            </div>

            {/* Role */}
            <div className="mb-3.5">
              <InputField
                errors={errors}
                field="role"
                form={form}
                onChange={handleFieldChange}
                placeholder="Role you're interested in (e.g. Frontend Engineer)"
              />
            </div>

            {/* LinkedIn */}
            <div className="mb-3.5">
              <InputField
                errors={errors}
                field="linkedin"
                form={form}
                onChange={handleFieldChange}
                placeholder="LinkedIn / Portfolio URL"
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <textarea
                className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 font-[inherit] text-sm text-white leading-relaxed outline-none transition-colors placeholder:text-slate-500 focus:border-purple-600"
                onChange={(e) => handleFieldChange("message", e.target.value)}
                placeholder="Tell us a bit about yourself and why you'd be a great fit..."
                rows={4}
                value={form.message}
              />
            </div>

            {/* File upload */}
            <div
              className={`mb-7 cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition-all ${
                dragOver
                  ? "border-purple-400 bg-purple-700/8"
                  : form.file
                    ? "border-purple-500/60 bg-purple-700/5"
                    : "border-white/12 bg-transparent"
              }`}
              onClick={() => document.getElementById("resume-upload")?.click()}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
                onChange={(e) => handleFile(e.target.files?.[0])}
                type="file"
              />
              {form.file ? (
                <div>
                  <div className="mb-2 text-3xl">📎</div>
                  <div className="font-semibold text-purple-400 text-sm">
                    {form.file.name}
                  </div>
                  <div className="mt-1 text-slate-500 text-xs">
                    {(form.file.size / 1024).toFixed(0)} KB · Click to change
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-2.5 text-3xl">📄</div>
                  <div className="mb-1 font-semibold text-slate-400 text-sm">
                    Upload Your Resume
                  </div>
                  <div className="text-slate-600 text-xs">
                    PDF, DOC, or DOCX · Drag &amp; drop or click to browse
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              className={`flex w-full items-center justify-center gap-2.5 rounded-full border-none py-4 font-bold text-sm text-white tracking-wide transition-all ${
                loading
                  ? "cursor-not-allowed bg-purple-700/50"
                  : "cursor-pointer bg-gradient-to-br from-purple-700 to-indigo-600 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(124,58,237,0.4)]"
              }`}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </>
              ) : (
                "Submit Application ↗"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Notify Modal ─────────────────────────────────────────────────────────────

const NotifyModal: FC<ModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  const submit = () => {
    if (email.includes("@")) setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-5 backdrop-blur-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .modal-inner { animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
      <div className="modal-inner relative w-full max-w-md rounded-3xl border border-purple-700/30 bg-[#0d0d1a] p-11">
        <button
          className="absolute top-4.5 right-4.5 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full border-none bg-white/[0.06] text-base text-slate-400 transition-colors hover:bg-white/10"
          onClick={onClose}
        >
          ×
        </button>

        {done ? (
          <div className="text-center">
            <div className="mb-4 text-5xl">🔔</div>
            <h3 className="mb-2.5 font-extrabold text-xl">
              You&apos;re on the list!
            </h3>
            <p className="mb-6 text-slate-500 text-sm leading-relaxed">
              We'll notify you at{" "}
              <strong className="text-purple-400">{email}</strong> the moment a
              new role opens up.
            </p>
            <button
              className="cursor-pointer rounded-full border-none bg-purple-700 px-7 py-3 font-semibold text-sm text-white transition-colors hover:bg-purple-600"
              onClick={onClose}
            >
              Got it!
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-4xl">🔔</div>
            <h3 className="mb-2 font-extrabold text-xl">Get Notified</h3>
            <p className="mb-7 text-slate-500 text-sm leading-relaxed">
              Drop your email and we'll ping you the moment a new role opens at
              WorkHolo.
            </p>
            <input
              className="mb-3.5 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5 font-[inherit] text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-purple-600"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="your@email.com"
              value={email}
            />
            <button
              className="w-full cursor-pointer rounded-full border-none bg-gradient-to-br from-purple-700 to-indigo-600 py-3.5 font-semibold text-sm text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(124,58,237,0.4)]"
              onClick={submit}
            >
              Notify Me ↗
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

function RouteComponent() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [showResume, setShowResume] = useState<boolean>(false);
  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [heroVisible, setHeroVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#07070f] font-sans text-white">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes drift { 0% { transform: translate(0,0) rotate(0deg); } 33% { transform: translate(30px,-20px) rotate(120deg); } 66% { transform: translate(-20px,30px) rotate(240deg); } 100% { transform: translate(0,0) rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .float-anim-2 { animation: float 5s ease-in-out 1s infinite; }
        .float-anim-3 { animation: float 6s ease-in-out 2s infinite; }
        .pulse-dot { animation: pulse-ring 1.5s ease-out infinite; }
        .drift-1 { animation: drift 18s ease-in-out infinite; }
        .drift-2 { animation: drift 22s ease-in-out infinite reverse; }
        .drift-3 { animation: drift 26s ease-in-out infinite; }
        .float-icon { animation: float 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease infinite;
        }
        .stat-number {
          background: linear-gradient(135deg, #a855f7, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background orbs */}
      <div
        className="drift-1 pointer-events-none absolute top-[5%] left-[10%] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="drift-2 pointer-events-none absolute top-[30%] right-[5%] h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="drift-3 pointer-events-none absolute bottom-[10%] left-[20%] h-[350px] w-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── Hero ──
          pt-28 md:pt-36 gives room below a typical fixed header (~64px tall).
          Adjust pt values to match your actual header height. */}
      <section
        className="relative px-5 pt-44 pb-16 text-center sm:px-10 sm:pb-20 md:pt-52 lg:px-16"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 65%)",
        }}
      >
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-600/40 bg-purple-700/15 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-purple-400" />
            CAREERS AT WORKHOLO
          </div>

          <h1 className="mb-7 font-black text-5xl leading-[1.03] tracking-[-3px] sm:text-7xl lg:text-9xl">
            Build the <span className="shimmer-text">Future.</span>
            <br />
            With Us.
          </h1>

          <p className="mx-auto mb-11 max-w-xl text-lg text-slate-400 leading-relaxed sm:text-xl">
            We're on a mission to transform how businesses operate with
            technology. Come shape the future alongside some of the sharpest
            minds in tech.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-purple-700 px-8 py-4 font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] sm:px-10 sm:text-base"
              onClick={() => setShowResume(true)}
            >
              Send Your Resume ↗
            </button>
            <button className="cursor-pointer rounded-full border border-white/15 bg-transparent px-8 py-4 font-semibold text-sm text-white transition-all hover:bg-purple-400/8 sm:px-10 sm:text-base">
              Our Culture
            </button>
          </div>
        </div>

        {/* Floating emoji decorations */}
      </section>

      {/* ── Stats ── */}
      <RevealSection>
        <section className="flex flex-wrap justify-center px-5 pb-20 sm:px-10 lg:px-16">
          {stats.map((stat, i) => (
            <div
              className="flex-1 basis-36 px-6 py-7 text-center transition-transform hover:-translate-y-1 sm:px-8"
              key={stat.label}
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
              }}
            >
              <div className="stat-number font-black text-4xl leading-none sm:text-5xl">
                {stat.number}
              </div>
              <div className="mt-2 text-slate-600 text-xs uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      </RevealSection>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-purple-700/30 to-transparent sm:mx-10 lg:mx-16" />

      {/* ── Open Positions ── */}
      <RevealSection>
        <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div
            className="relative overflow-hidden rounded-3xl border border-purple-700/20 p-10 text-center sm:p-16 lg:p-20"
            style={{
              background: "linear-gradient(135deg, #120820 0%, #0a1628 100%)",
            }}
          >
            {/* Inner orbs */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
              }}
            />

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
              [ OPEN POSITIONS ]
            </div>

            <h2 className="mb-4 font-black text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              No Open Roles Right Now
            </h2>
            <p className="mx-auto mb-12 max-w-md text-base text-slate-600 leading-relaxed sm:text-lg">
              We don't have any active positions at the moment, but we're always
              growing. Drop us your resume and we'll reach out when something
              perfect comes up.
            </p>

            <div className="mb-12 flex justify-center">
              <div className="float-icon flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-purple-700/25 border-dashed bg-purple-700/8 text-5xl">
                📋
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3.5">
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-purple-700 px-8 py-4 font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] sm:px-10 sm:text-base"
                onClick={() => setShowResume(true)}
              >
                Send Your Resume ↗
              </button>
              <button
                className="cursor-pointer rounded-full border border-purple-400/40 bg-transparent px-8 py-4 font-semibold text-purple-400 text-sm transition-all hover:bg-purple-400/8 sm:px-10 sm:text-base"
                onClick={() => setShowNotify(true)}
              >
                Notify Me of Openings 🔔
              </button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── Testimonials ── */}
      <RevealSection>
        <section className="px-5 pb-20 sm:px-10 lg:px-16">
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
              [ TEAM STORIES ]
            </div>
            <h2 className="font-black text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Hear From Our Team.
            </h2>
          </div>
          <TestimonialCarousel />
        </section>
      </RevealSection>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-purple-700/30 to-transparent sm:mx-10 lg:mx-16" />

      {/* ── Company Values ── */}
      <RevealSection>
        <section className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
              [ OUR VALUES ]
            </div>
            <h2 className="max-w-xs font-black text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              What Drives Us Every Day.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {companyValues.map((value, i) => (
              <RevealSection delay={i * 80} key={i}>
                <div
                  className="h-full cursor-default rounded-2xl border p-8 transition-all duration-300 sm:p-9"
                  onMouseEnter={() => setHoveredValue(i)}
                  onMouseLeave={() => setHoveredValue(null)}
                  style={{
                    backgroundColor:
                      hoveredValue === i ? "rgba(124,58,237,0.1)" : "#0d0d1a",
                    borderColor:
                      hoveredValue === i
                        ? "rgba(124,58,237,0.45)"
                        : "rgba(255,255,255,0.06)",
                    transform:
                      hoveredValue === i ? "translateY(-6px)" : "translateY(0)",
                  }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-700/15 text-2xl transition-transform duration-300"
                    style={{
                      transform: hoveredValue === i ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="mb-3 font-extrabold text-base tracking-tight sm:text-lg">
                    {value.title}
                  </h3>
                  <p className="m-0 text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── Perks ── */}
      <RevealSection>
        <section className="px-5 pb-20 sm:px-10 lg:px-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
            [ PERKS &amp; BENEFITS ]
          </div>
          <h2 className="mb-12 font-black text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Why You&apos;ll Love Working Here.
          </h2>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk, i) => (
              <RevealSection delay={i * 60} key={i}>
                <div className="flex cursor-default items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-[#0d0d1a] px-5 py-6 transition-all hover:border-purple-700/35 hover:bg-purple-700/10 sm:px-6">
                  <span className="text-2xl">{perk.icon}</span>
                  <span className="font-semibold text-slate-200 text-sm">
                    {perk.label}
                  </span>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── Hiring Process ── */}
      <RevealSection>
        <section className="px-5 pb-20 sm:px-10 lg:px-16">
          <div className="mb-14 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-700/12 px-4 py-1.5 text-[11px] text-purple-400 tracking-[2.5px]">
              [ HIRING PROCESS ]
            </div>
            <h2 className="font-black text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Simple, Transparent Hiring.
            </h2>
          </div>

          {/* Desktop: horizontal flow */}
          <div className="relative mx-auto hidden max-w-4xl items-start md:flex">
            {hiringSteps.map((s, i) => (
              <div className="relative flex-1 px-3 text-center" key={s.step}>
                <div
                  className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-purple-600/40 text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))",
                  }}
                >
                  {s.icon}
                </div>
                {i < hiringSteps.length - 1 && (
                  <div className="absolute top-8 right-[calc(-50%+32px)] left-[calc(50%+32px)] h-px border-purple-700/35 border-t border-dashed" />
                )}
                <div className="mb-2 text-[11px] text-purple-400 tracking-[2px]">
                  {s.step}
                </div>
                <div className="mb-2.5 font-bold text-sm">{s.title}</div>
                <p className="text-slate-600 text-xs leading-relaxed sm:text-sm">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="mx-auto flex max-w-sm flex-col gap-6 md:hidden">
            {hiringSteps.map((s) => (
              <div className="flex items-start gap-4" key={s.step}>
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-600/40 text-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))",
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="mb-1 text-[10px] text-purple-400 tracking-[2px]">
                    {s.step}
                  </div>
                  <div className="mb-1 font-bold text-sm">{s.title}</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── CTA Banner ── */}
      <RevealSection>
        <section className="px-5 pb-24 sm:px-10 lg:px-16">
          <div
            className="relative flex flex-col items-center justify-between gap-9 overflow-hidden rounded-3xl px-8 py-14 sm:flex-row sm:px-14 sm:py-16"
            style={{
              background:
                "linear-gradient(135deg, #5b21b6 0%, #4338ca 50%, #1d4ed8 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
              }}
            />
            <div className="text-center sm:text-left">
              <h2 className="mb-3 font-black text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Don&apos;t See Your Role?
                <br />
                Reach Out Anyway.
              </h2>
              <p className="text-base text-white/70">
                We build teams around exceptional people, not just open
                headcount.
              </p>
            </div>
            <button
              className="shrink-0 cursor-pointer rounded-full border-none bg-white px-9 py-4 font-extrabold text-purple-800 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] sm:text-base"
              onClick={() => setShowResume(true)}
            >
              hr@workholo.com ↗
            </button>
          </div>
        </section>
      </RevealSection>

      {/* ── Modals ── */}
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      {showNotify && <NotifyModal onClose={() => setShowNotify(false)} />}
    </div>
  );
}
