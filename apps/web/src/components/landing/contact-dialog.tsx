import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface ContactDialogProps {
  children: ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {/* Brand accent bar */}
        <div className="-mx-6 -mt-6 mb-6 h-1.5 rounded-t-lg bg-[#7C5CFF]" />

        <DialogHeader className="mb-1">
          <DialogTitle className="font-bold text-foreground text-xl">
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in your details and our team will get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                className="font-medium text-foreground text-sm"
                htmlFor="contact-firstName"
              >
                First Name
              </Label>
              <Input id="contact-firstName" placeholder="John" required />
            </div>
            <div className="space-y-1.5">
              <Label
                className="font-medium text-foreground text-sm"
                htmlFor="contact-lastName"
              >
                Last Name
              </Label>
              <Input id="contact-lastName" placeholder="Doe" required />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                className="font-medium text-foreground text-sm"
                htmlFor="contact-email"
              >
                Email
              </Label>
              <Input
                id="contact-email"
                placeholder="john@company.com"
                required
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="font-medium text-foreground text-sm"
                htmlFor="contact-phone"
              >
                Phone
              </Label>
              <Input
                id="contact-phone"
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label
              className="font-medium text-foreground text-sm"
              htmlFor="contact-address"
            >
              Address
            </Label>
            <Input
              id="contact-address"
              placeholder="123 Main St, City, State"
            />
          </div>

          {/* Reason for Contact */}
          <div className="space-y-1.5">
            <Label className="font-medium text-foreground text-sm">
              Reason for Contact
            </Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="w-full">
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
      </DialogContent>
    </Dialog>
  );
}
