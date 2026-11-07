import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "./components/BrandIcons";
import { CodeBlock } from "./components/CodeBlock";
import { CopyButton } from "./components/CopyButton";
import { Chapter, Container, DOCS_URL, GITHUB_URL, SiteFooter, SiteHeader } from "./components/Layout";
import { AdapterDemo, ColorsDemo, CustomRenderDemo, ReadOnlyDemo } from "./demos/FeatureDemos";
import { HeroDemo } from "./demos/HeroDemo";
import { AgendaViewDemo, DayViewDemo, WeekViewDemo } from "./demos/ViewDemos";
import { WorkingDaysDemo } from "./demos/WorkingDaysDemo";

const INSTALL = "npm install @marco.colia/react-fast-scheduler";

function Hero() {
  return (
    <div className="pt-14 pb-10 sm:pt-20 sm:pb-12">
      <h1 className="max-w-[16ch] text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
        Schedule people, rooms and equipment in React.
      </h1>
      <p className="mt-5 max-w-[60ch] text-lg leading-[1.6] text-muted-foreground text-pretty">
        A lightweight, controlled scheduler component: day, week and agenda views, drag and resize,
        and an adapter that reads your appointment objects as they are. Your app keeps the state.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex h-10 max-w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-card pr-1 pl-3.5">
          <span
            aria-hidden="true"
            className="font-mono text-sm text-muted-foreground"
          >
            $
          </span>
          <code className="min-w-0 overflow-x-auto font-mono text-sm whitespace-nowrap">{INSTALL}</code>
          <CopyButton
            text={INSTALL}
            label="Copy install command"
          />
        </div>
        <a
          href={GITHUB_URL}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90"
        >
          <GitHubIcon />
          View on GitHub
        </a>
        <a
          href={DOCS_URL}
          className="inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          Documentation <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

function Install() {
  return (
    <Chapter
      id="install"
      title="Get started"
    >
      <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-muted-foreground">
        Works with React 18 and 19. The stylesheet is scoped to the scheduler, so it does not touch
        the rest of your app.
      </p>
      <ol className="mt-10 grid gap-8 lg:grid-cols-3">
        <li className="flex flex-col gap-3">
          <h3 className="font-semibold">Install the package</h3>
          <CodeBlock
            title="Terminal"
            code={INSTALL}
          />
        </li>
        <li className="flex flex-col gap-3">
          <h3 className="font-semibold">Import the styles once</h3>
          <CodeBlock
            title="main.tsx"
            code={`import "@marco.colia/react-fast-scheduler/styles.css";`}
          />
        </li>
        <li className="flex flex-col gap-3">
          <h3 className="font-semibold">Render it with your data</h3>
          <CodeBlock
            title="Schedule.tsx"
            code={`
<Scheduler
  resources={resources}
  appointments={appointments}
  selectedDate={date}
  onSelectedDateChange={setDate}
/>
`}
          />
        </li>
      </ol>
      <a
        href={DOCS_URL}
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent-ink underline"
      >
        Read the full documentation <ArrowUpRight className="size-4" />
      </a>
    </Chapter>
  );
}

export function App() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Container>
          <Hero />
          <HeroDemo />

          <div className="mt-28">
            <Chapter
              id="views"
              title="Three views, one component"
            >
              <DayViewDemo />
              <WeekViewDemo />
              <AgendaViewDemo />
            </Chapter>
          </div>

          <div className="mt-28">
            <Chapter
              id="features"
              title="Built to fit your app"
            >
              <WorkingDaysDemo />
              <AdapterDemo />
              <ColorsDemo />
              <CustomRenderDemo />
              <ReadOnlyDemo />
            </Chapter>
          </div>

          <div className="mt-28">
            <Install />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
