import { IconSend, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Full Name *
          </Label>
          <Input
            className="rounded-xl px-4 py-6"
            placeholder="John Doe"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Email *
          </Label>
          <Input
            className="rounded-xl px-4 py-6"
            placeholder="john@company.com"
            type="email"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Company
          </Label>
          <Input
            className="rounded-xl px-4 py-6"
            placeholder="Your Company"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Phone *
          </Label>
          <div className="flex gap-2">
            <Select defaultValue="IN +91">
              <SelectTrigger className="h-12 w-[100px] rounded-xl">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN +91">IN +91</SelectItem>
                <SelectItem value="US +1">US +1</SelectItem>
                <SelectItem value="UK +44">UK +44</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="h-12 flex-1 rounded-xl px-4"
              placeholder="9876543210"
              type="tel"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Subject
          </Label>
          <Input
            className="rounded-xl px-4 py-6"
            placeholder="How can we help?"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Service
          </Label>
          <Select>
            <SelectTrigger className="h-12 w-full rounded-xl">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mobile App Development">
                Mobile App Development
              </SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Cloud Services">Cloud Services</SelectItem>
              <SelectItem value="AI & Data Analytics">
                AI & Data Analytics
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
          Message *
        </Label>
        <Textarea
          className="w-full resize-none rounded-xl px-4 py-3"
          placeholder="Tell us about your project..."
          rows={4}
        />
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          className="h-5 w-5 rounded border-muted-foreground"
          id="privacy"
        />
        <Label
          className="font-normal text-muted-foreground text-sm"
          htmlFor="privacy"
        >
          I agree to the{" "}
          <a className="font-semibold text-primary underline" href="/">
            Privacy Policy
          </a>{" "}
          and consent to being contacted.
        </Label>
      </div>

      <Button
        className="w-full rounded-xl py-6 font-bold text-lg shadow-lg"
        type="button"
      >
        Send Message <IconSend className="ml-2" size={20} />
      </Button>

      <div className="flex items-center justify-center gap-2 font-medium text-muted-foreground text-xs">
        <IconShieldCheck className="text-emerald-500" size={14} />
        100% Secure. Your information is encrypted and never shared with third
        parties.
      </div>
    </form>
  );
}
