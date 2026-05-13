import { createFileRoute } from "@tanstack/react-router";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  ReactNode,
  RefObject,
} from "react";

export const Route = createFileRoute("/career")({
  component: RouteComponent,
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  years: string;
}

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

interface Perk {
  icon: string;
  label: string;
}

interface Stat {
  number: string;
  label: string;
}

interface HiringStep {
  step: string;
  title: string;
  desc: string;
  icon: string;
}

interface SelectOption {
  v: string;
  l: string;
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  role: string;
  linkedin: string;
  message: string;
  file: File | null;
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
      { threshold: 0.12 },
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
          (prev) => (prev + dir + testimonials.length) % testimonials.length,
        );
        setAnimating(false);
      }, 280);
    },
    [animating],
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
    <div className="relative max-w-2xl mx-auto">
      <div
        className="relative overflow-hidden rounded-3xl border border-purple-700/20 p-8 sm:p-12 min-h-[220px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(59,130,246,0.06) 100%)",
          opacity: animating ? 0 : 1,
          transform: animating ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        <div className="absolute top-6 left-12 text-7xl leading-none text-purple-400/15 font-serif select-none">
          &ldquo;
        </div>
        <p className="relative z-10 text-slate-300 text-base sm:text-lg leading-relaxed mb-8 italic">
          {t.quote}
        </p>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
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

      <div className="flex justify-center items-center gap-4 mt-7">
        <button
          onClick={() => go(-1)}
          className="w-10 h-10 rounded-full bg-purple-700/12 border border-purple-600/30 text-purple-400 cursor-pointer text-lg flex items-center justify-center hover:bg-purple-700/20 transition-all"
        >
          ‹
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => dotClick(i)}
              className="h-2 rounded-full border-none cursor-pointer transition-all duration-300 p-0"
              style={{
                width: i === active ? "24px" : "8px",
                background:
                  i === active ? "#a855f7" : "rgba(168,85,247,0.25)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          className="w-10 h-10 rounded-full bg-purple-700/12 border border-purple-600/30 text-purple-400 cursor-pointer text-lg flex items-center justify-center hover:bg-purple-700/20 transition-all"
        >
          ›
        </button>
      </div>
    </div>
  );
};

// ─── Form Field Helpers ───────────────────────────────────────────────────────

interface InputFieldProps {
  field: FormFields;
  placeholder: string;
  half?: boolean;
  form: FormState;
  errors: FormErrors;
  onChange: (field: FormFields, value: string) => void;
}

const InputField: FC<InputFieldProps> = ({
  field,
  placeholder,
  half = false,
  form,
  errors,
  onChange,
}) => (
  <div className={`flex flex-col gap-1.5 ${half ? "flex-1 min-w-[calc(50%-8px)]" : "w-full"}`}>
    <input
      value={form[field] as string}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white/[0.04] rounded-xl px-4 py-3.5 text-white text-sm outline-none font-[inherit] transition-colors placeholder:text-slate-500 focus:border-purple-600 ${
        errors[field] ? "border border-red-500" : "border border-white/10"
      }`}
    />
    {errors[field] && (
      <span className="text-red-500 text-xs">{errors[field]}</span>
    )}
  </div>
);

interface SelectFieldProps {
  field: FormFields;
  options: SelectOption[];
  placeholder: string;
  form: FormState;
  errors: FormErrors;
  onChange: (field: FormFields, value: string) => void;
}

const SelectField: FC<SelectFieldProps> = ({
  field,
  options,
  placeholder,
  form,
  errors,
  onChange,
}) => (
  <div className="flex-1 min-w-[calc(50%-8px)] flex flex-col gap-1.5">
    <select
      value={form[field] as string}
      onChange={(e) => onChange(field, e.target.value)}
      className={`w-full bg-[#1a1a2e] rounded-xl px-4 py-3.5 text-sm outline-none cursor-pointer font-[inherit] appearance-none transition-colors ${
        form[field] ? "text-white" : "text-slate-500"
      } ${errors[field] ? "border border-red-500" : "border border-white/10"}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.v} value={o.v} className="text-white bg-[#1a1a2e]">
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
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/75 backdrop-blur-lg z-[1000] flex items-center justify-center p-5"
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
      <div className="modal-inner bg-[#0d0d1a] border border-purple-700/30 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        {submitted ? (
          <div className="p-16 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-extrabold mb-3 bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Application Sent!
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              Thank you for reaching out. We've received your application and will review it carefully. We'll be in touch if there's a great fit.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-700 text-white border-none rounded-full px-8 py-3.5 text-sm font-semibold cursor-pointer hover:bg-purple-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-8 sm:p-11">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 bg-white/[0.06] border-none rounded-full w-9 h-9 text-slate-400 cursor-pointer text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              ×
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-3.5 py-1 text-[11px] tracking-widest text-purple-400 mb-4">
                [ APPLY NOW ]
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1.5">Send Your Application</h2>
              <p className="text-slate-500 text-sm">We'll reach out when the right opportunity comes up.</p>
            </div>

            {/* Name row */}
            <div className="flex flex-wrap gap-3.5 mb-3.5">
              <InputField field="firstName" placeholder="First Name *" half form={form} errors={errors} onChange={handleFieldChange} />
              <InputField field="lastName" placeholder="Last Name *" half form={form} errors={errors} onChange={handleFieldChange} />
            </div>

            {/* Email / Phone */}
            <div className="flex flex-wrap gap-3.5 mb-3.5">
              <InputField field="email" placeholder="Email Address *" half form={form} errors={errors} onChange={handleFieldChange} />
              <InputField field="phone" placeholder="Phone Number" half form={form} errors={errors} onChange={handleFieldChange} />
            </div>

            {/* Qualification / Experience */}
            <div className="flex flex-wrap gap-3.5 mb-3.5">
              <SelectField field="qualification" options={qualificationOptions} placeholder="Highest Qualification *" form={form} errors={errors} onChange={handleFieldChange} />
              <SelectField field="experience" options={experienceOptions} placeholder="Years of Experience *" form={form} errors={errors} onChange={handleFieldChange} />
            </div>

            {/* Role */}
            <div className="mb-3.5">
              <InputField field="role" placeholder="Role you're interested in (e.g. Frontend Engineer)" form={form} errors={errors} onChange={handleFieldChange} />
            </div>

            {/* LinkedIn */}
            <div className="mb-3.5">
              <InputField field="linkedin" placeholder="LinkedIn / Portfolio URL" form={form} errors={errors} onChange={handleFieldChange} />
            </div>

            {/* Message */}
            <div className="mb-5">
              <textarea
                value={form.message}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                placeholder="Tell us a bit about yourself and why you'd be a great fit..."
                rows={4}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none resize-y font-[inherit] leading-relaxed placeholder:text-slate-500 focus:border-purple-600 transition-colors"
              />
            </div>

            {/* File upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("resume-upload")?.click()}
              className={`rounded-2xl p-7 text-center cursor-pointer mb-7 transition-all border-2 border-dashed ${
                dragOver
                  ? "border-purple-400 bg-purple-700/8"
                  : form.file
                  ? "border-purple-500/60 bg-purple-700/5"
                  : "border-white/12 bg-transparent"
              }`}
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {form.file ? (
                <div>
                  <div className="text-3xl mb-2">📎</div>
                  <div className="text-purple-400 font-semibold text-sm">{form.file.name}</div>
                  <div className="text-slate-500 text-xs mt-1">{(form.file.size / 1024).toFixed(0)} KB · Click to change</div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2.5">📄</div>
                  <div className="text-slate-400 text-sm font-semibold mb-1">Upload Your Resume</div>
                  <div className="text-slate-600 text-xs">PDF, DOC, or DOCX · Drag &amp; drop or click to browse</div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-white border-none rounded-full py-4 text-sm font-bold flex items-center justify-center gap-2.5 tracking-wide transition-all ${
                loading ? "bg-purple-700/50 cursor-not-allowed" : "bg-gradient-to-br from-purple-700 to-indigo-600 cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(124,58,237,0.4)]"
              }`}
            >
              {loading ? (
                <>
                  <span className="spinner inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/75 backdrop-blur-lg z-[1000] flex items-center justify-center p-5"
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .modal-inner { animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
      <div className="modal-inner bg-[#0d0d1a] border border-purple-700/30 rounded-3xl w-full max-w-md p-11 relative">
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 bg-white/[0.06] border-none rounded-full w-8.5 h-8.5 text-slate-400 cursor-pointer text-base flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          ×
        </button>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-extrabold mb-2.5">You&apos;re on the list!</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We'll notify you at{" "}
              <strong className="text-purple-400">{email}</strong> the moment a new role opens up.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-700 text-white border-none rounded-full px-7 py-3 text-sm font-semibold cursor-pointer hover:bg-purple-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-extrabold mb-2">Get Notified</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-7">
              Drop your email and we'll ping you the moment a new role opens at WorkHolo.
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="your@email.com"
              className="w-full bg-white/[0.04] border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm outline-none mb-3.5 font-[inherit] placeholder:text-slate-500 focus:border-purple-600 transition-colors"
            />
            <button
              onClick={submit}
              className="w-full bg-gradient-to-br from-purple-700 to-indigo-600 text-white border-none rounded-full py-3.5 text-sm font-semibold cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all"
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
    <div className="bg-[#07070f] text-white font-sans min-h-screen overflow-x-hidden relative">
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
      <div className="drift-1 absolute top-[5%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
      <div className="drift-2 absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
      <div className="drift-3 absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)" }} />

      {/* ── Hero ──
          pt-28 md:pt-36 gives room below a typical fixed header (~64px tall).
          Adjust pt values to match your actual header height. */}
      <section
  className="relative pt-44 md:pt-52 pb-16 sm:pb-20 px-5 sm:px-10 lg:px-16 text-center"
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
          <div className="inline-flex items-center gap-2 bg-purple-700/15 border border-purple-600/40 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-8">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
            CAREERS AT WORKHOLO
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[1.03] mb-7 tracking-[-3px]">
            Build the{" "}
            <span className="shimmer-text">Future.</span>
            <br />
            With Us.
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-11 leading-relaxed">
            We're on a mission to transform how businesses operate with technology. Come shape the future alongside some of the sharpest minds in tech.
          </p>

          <div className="flex gap-3.5 justify-center flex-wrap">
            <button
              onClick={() => setShowResume(true)}
              className="bg-purple-700 text-white border-none rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] inline-flex items-center gap-2"
            >
              Send Your Resume ↗
            </button>
            <button className="bg-transparent text-white border border-white/15 rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-purple-400/8">
              Our Culture
            </button>
          </div>
        </div>

        {/* Floating emoji decorations */}
      </section>

      {/* ── Stats ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 pb-20 flex justify-center flex-wrap">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center flex-1 basis-36 px-6 sm:px-8 py-7 transition-transform hover:-translate-y-1"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <div className="stat-number text-4xl sm:text-5xl font-black leading-none">{stat.number}</div>
              <div className="text-slate-600 text-xs mt-2 tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </section>
      </RevealSection>

      <div className="mx-5 sm:mx-10 lg:mx-16 h-px bg-gradient-to-r from-transparent via-purple-700/30 to-transparent" />

      {/* ── Open Positions ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div
            className="rounded-3xl border border-purple-700/20 p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #120820 0%, #0a1628 100%)" }}
          >
            {/* Inner orbs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />

            <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-7">
              [ OPEN POSITIONS ]
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
              No Open Roles Right Now
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed">
              We don't have any active positions at the moment, but we're always growing. Drop us your resume and we'll reach out when something perfect comes up.
            </p>

            <div className="flex justify-center mb-12">
              <div className="w-28 h-28 rounded-3xl bg-purple-700/8 border-2 border-dashed border-purple-700/25 flex items-center justify-center text-5xl float-icon">
                📋
              </div>
            </div>

            <div className="flex gap-3.5 justify-center flex-wrap">
              <button
                onClick={() => setShowResume(true)}
                className="bg-purple-700 text-white border-none rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] inline-flex items-center gap-2"
              >
                Send Your Resume ↗
              </button>
              <button
                onClick={() => setShowNotify(true)}
                className="bg-transparent text-purple-400 border border-purple-400/40 rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-purple-400/8"
              >
                Notify Me of Openings 🔔
              </button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── Testimonials ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-5">
              [ TEAM STORIES ]
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Hear From Our Team.
            </h2>
          </div>
          <TestimonialCarousel />
        </section>
      </RevealSection>

      <div className="mx-5 sm:mx-10 lg:mx-16 h-px bg-gradient-to-r from-transparent via-purple-700/30 to-transparent" />

      {/* ── Company Values ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-5">
              [ OUR VALUES ]
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-xs leading-tight">
              What Drives Us Every Day.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companyValues.map((value, i) => (
              <RevealSection key={i} delay={i * 80}>
                <div
                  onMouseEnter={() => setHoveredValue(i)}
                  onMouseLeave={() => setHoveredValue(null)}
                  className="rounded-2xl p-8 sm:p-9 cursor-default transition-all duration-300 h-full border"
                  style={{
                    backgroundColor: hoveredValue === i ? "rgba(124,58,237,0.1)" : "#0d0d1a",
                    borderColor: hoveredValue === i ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.06)",
                    transform: hoveredValue === i ? "translateY(-6px)" : "translateY(0)",
                  }}
                >
                  <div
                    className="w-12 h-12 bg-purple-700/15 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300"
                    style={{ transform: hoveredValue === i ? "scale(1.1)" : "scale(1)" }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold mb-3 tracking-tight">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">{value.description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── Perks ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 pb-20">
          <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-5">
            [ PERKS &amp; BENEFITS ]
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-12">
            Why You&apos;ll Love Working Here.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {perks.map((perk, i) => (
              <RevealSection key={i} delay={i * 60}>
                <div className="bg-[#0d0d1a] border border-white/[0.06] rounded-2xl px-5 sm:px-6 py-6 flex items-center gap-3.5 transition-all hover:bg-purple-700/10 hover:border-purple-700/35 cursor-default">
                  <span className="text-2xl">{perk.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{perk.label}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── Hiring Process ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 pb-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-700/12 border border-purple-600/30 rounded-full px-4 py-1.5 text-[11px] tracking-[2.5px] text-purple-400 mb-5">
              [ HIRING PROCESS ]
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Simple, Transparent Hiring.
            </h2>
          </div>

          {/* Desktop: horizontal flow */}
          <div className="hidden md:flex items-start relative max-w-4xl mx-auto">
            {hiringSteps.map((s, i) => (
              <div key={s.step} className="flex-1 relative text-center px-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 relative z-10 border border-purple-600/40"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))" }}>
                  {s.icon}
                </div>
                {i < hiringSteps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px border-t border-dashed border-purple-700/35" />
                )}
                <div className="text-[11px] tracking-[2px] text-purple-400 mb-2">{s.step}</div>
                <div className="text-sm font-bold mb-2.5">{s.title}</div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden flex flex-col gap-6 max-w-sm mx-auto">
            {hiringSteps.map((s) => (
              <div key={s.step} className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl border border-purple-600/40"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))" }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-[10px] tracking-[2px] text-purple-400 mb-1">{s.step}</div>
                  <div className="text-sm font-bold mb-1">{s.title}</div>
                  <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── CTA Banner ── */}
      <RevealSection>
        <section className="px-5 sm:px-10 lg:px-16 pb-24">
          <div
            className="rounded-3xl px-8 sm:px-14 py-14 sm:py-16 flex flex-col sm:flex-row justify-between items-center gap-9 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #5b21b6 0%, #4338ca 50%, #1d4ed8 100%)" }}
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 tracking-tight leading-tight">
                Don&apos;t See Your Role?
                <br />
                Reach Out Anyway.
              </h2>
              <p className="text-white/70 text-base">
                We build teams around exceptional people, not just open headcount.
              </p>
            </div>
            <button
              onClick={() => setShowResume(true)}
              className="shrink-0 bg-white text-purple-800 border-none rounded-full px-9 py-4 text-sm sm:text-base font-extrabold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
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