import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  source?: string;
  onSuccess?: () => void;
};

const WORKER_URL =
  "https://toby-mailing-list.w0504124161.workers.dev/subscribe_request";

const NewsletterSignupForm = ({ source = "blog-sidebar", onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedEmail) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          name: normalizedName,
          source,
          newsletterOptIn: true,
        }),
      });

      let data: { ok?: boolean; error?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data?.ok) {
        // Log technical detail for debugging, but never surface it to the user
        if (data?.error) {
          console.warn("Newsletter signup failed:", data.error);
        }
        throw new Error("signup_failed");
      }

      toast({
        title: "נרשמת בהצלחה",
        description:
          "ההרשמה התקבלה ונשלחה לאישור. ברגע שתאושר, תוכלי לקבל גישה להמשך המסלול.",
      });

      setEmail("");
      setName("");

      onSuccess?.();
    } catch (error) {
      if (error instanceof Error && error.message !== "signup_failed") {
        console.warn("Newsletter signup error:", error);
      }
      toast({
        title: "משהו השתבש",
        description: "לא הצלחנו לשלוח את ההרשמה כרגע. נסי שוב בעוד רגע.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם (לא חובה)"
        className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
        dir="rtl"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="כתובת מייל…"
        required
        className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
        dir="rtl"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "שולחת..." : "הצטרפות"}
      </button>
    </form>
  );
};

export default NewsletterSignupForm;
