import { Link } from "react-router-dom";
import logo from "@/assets/whitelogo.png";
import redTexture from "@/assets/red3.png";
import sparkleSweep from "@/assets/shoval.png";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const primaryLinks: FooterLink[] = [
  { label: "דף הבית", href: "/" },
  { label: "אודות", href: "/about" },
  { label: "תזמורות", href: "/orchestras" },
  { label: "הופעות", href: "/performances" },
  { label: "תלמידות", href: "/students" },
  { label: "יצירת קשר", href: "/contact" },
];

const contentLinks: FooterLink[] = [
  { label: "בלוג", href: "/blog" },
  { label: "יצירה", href: "/creativity" },
  { label: "צמיחה", href: "/growth" },
  { label: "נסיעות", href: "/travel" },
  { label: "וולנס", href: "/wellness" },
  { label: "מחברים", href: "/authors" },
];

const legalLinks: FooterLink[] = [
  { label: "פרטיות", href: "/privacy" },
  { label: "תנאים", href: "/terms" },
];

const footerSections: FooterSection[] = [
  { title: "ניווט מהיר", links: primaryLinks },
  { title: "עוד באתר", links: contentLinks },
];

const newsletterLink: FooterLink = {
  label: "להצטרפות לרשימת התפוצה",
  href: "/contact",
};

function FooterNavLink({
  link,
  className = "",
}: {
  link: FooterLink;
  className?: string;
}) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      dir="rtl"
      className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#140708] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url(${redTexture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,190,110,0.12),transparent_34%),linear-gradient(to_bottom,rgba(20,7,8,0.92),rgba(10,3,4,0.98))]"
      />

      <img
        src={sparkleSweep}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-full opacity-40 mix-blend-screen"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="flex flex-wrap gap-10">
          <div className="min-w-[260px] flex-[1.4] text-right">
            <img
              src={logo}
              alt="Toby Music"
              className="mb-5 h-20 w-auto object-contain md:h-24"
            />

            <p className="text-xl font-semibold tracking-tight text-white md:text-2xl">
              אומנות ואמינות. זו יצירה.
            </p>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              מוזיקה, יצירה ושירות מקצועי בשפה נקייה, מדויקת ומכובדת.
            </p>

            <div className="mt-6">
              <FooterNavLink
                link={newsletterLink}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#f0b35a]/35 bg-white/5 px-5 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(240,179,90,0.08)] backdrop-blur-sm transition hover:border-[#f0b35a]/60 hover:bg-white/10"
              />
            </div>
          </div>

          {footerSections.map((section) => (
            <div
              key={section.title}
              className="min-w-[170px] flex-1 text-right"
            >
              <h3 className="mb-4 text-base font-semibold text-white">
                {section.title}
              </h3>

              <nav className="flex flex-col gap-3 text-sm text-white/75">
                {section.links.map((link) => (
                  <FooterNavLink
                    key={`${section.title}-${link.href}`}
                    link={link}
                    className="transition hover:text-white"
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/55 md:justify-start">
              {legalLinks.map((link, index) => (
                <div key={link.href} className="flex items-center gap-4">
                  <FooterNavLink
                    link={link}
                    className="transition hover:text-white"
                  />
                  {index < legalLinks.length - 1 ? (
                    <span className="text-white/20">•</span>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="text-xs text-white/50">
              © {year} Toby Music. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
