import { ArrowUpRight, Moon, Sun } from "lucide-react";
import * as React from "react";

import pkg from "../../../package.json";

import { GitHubIcon, NpmIcon } from "./BrandIcons";

export const GITHUB_URL = "https://github.com/justoverclockl/react-fast-scheduler";
export const DOCS_URL = `${GITHUB_URL}#readme`;
export const NPM_URL = "https://www.npmjs.com/package/@marco.colia/react-fast-scheduler";
export const VERSION = pkg.version;

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>;
}

type SectionProps = {
  id: string;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
};

/** One feature: heading, a short explanation, then the live demo and its code. */
export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section
      id={id}
      className="pt-20 sm:pt-24"
    >
      <h3 className="text-2xl font-semibold tracking-tight text-balance">{title}</h3>
      <div className="mt-2 max-w-[68ch] text-[15px] leading-[1.65] text-muted-foreground text-pretty">
        {description}
      </div>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </section>
  );
}

/** A chapter of the page (Views, Features): larger heading, no label above it. */
export function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className="border-t border-border pt-20 sm:pt-24"
    >
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {children}
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"));

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("rfs-demo-theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode): the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

const NAV = [
  { href: "#views", label: "Views" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-14 items-center gap-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
        >
          <img
            src="/favicon.svg"
            alt=""
            className="size-5"
          />
          react-fast-scheduler
          <span className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] font-normal text-muted-foreground sm:inline">
            v{VERSION}
          </span>
        </a>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-5 text-sm text-muted-foreground md:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a
            href={NPM_URL}
            aria-label="Package on npm"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            <NpmIcon />
          </a>
          <a
            href={GITHUB_URL}
            aria-label="Source on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-border">
      <Container className="flex flex-col gap-3 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          MIT licensed · Built by Marco Colia · Every person, place and appointment on this page is
          fictional.
        </p>
        <div className="flex gap-5">
          <a
            href={DOCS_URL}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            Documentation <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href={NPM_URL}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            npm <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
