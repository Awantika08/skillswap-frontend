import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Browse Skills", href: "/skills" },
      { label: "How It Works", href: "/" },
      { label: "For Mentors", href: "/" },
    ],
    Company: [
      { label: "About", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Contact", href: "/" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
              <span className="font-bold text-lg text-foreground">
                Skill-Swap
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with mentors and learners. Share your skills, learn new
              ones.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4 text-sm">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={`${category}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Skill-Swap. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
