import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const communityImage =
  "https://hhzzwclcilysoncpspft.supabase.co/storage/v1/object/public/home-assets/images/rbh-learning-community.png";
const exploreImage =
  "https://hhzzwclcilysoncpspft.supabase.co/storage/v1/object/public/home-assets/images/explore-ai-learning.png";

const values = [
  {
    icon: Compass,
    title: "Technology with a human purpose",
    description: "We turn powerful AI into useful, welcoming experiences that help people learn, create, and move forward.",
    color: "text-[#e76f51]",
  },
  {
    icon: HeartHandshake,
    title: "Learning for every stage",
    description: "Our projects can meet children, adults, educators, and teams wherever their next challenge begins.",
    color: "text-[#168f86]",
  },
  {
    icon: ShieldCheck,
    title: "Designed for the real world",
    description: "We pair intelligent systems with thoughtful design, clear progress, and the context people need to thrive.",
    color: "text-[#d39b27]",
  },
];

export default function Home() {
  return (
    <div className="bg-rbh-paper text-rbh-ink">
      <section className="border-b border-rbh-ink/10 bg-rbh-header text-rbh-header-text">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-rbh-gold">Really Brave Hearts</p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Brave minds find their way forward.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-rbh-header-text/75">RBH combines AI technology and education to create thoughtful experiences that help people around the world learn, create, and grow with confidence.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/project/adventure-academy" className="inline-flex h-12 items-center gap-2 rounded-md bg-rbh-coral px-6 font-semibold text-white transition-colors hover:brightness-95">Explore Adventure Academy <ArrowRight className="h-4 w-4" /></Link>
              <Link href="#why-rbh" className="inline-flex h-12 items-center rounded-md border border-rbh-header-text/30 px-6 font-semibold text-rbh-header-text transition-colors hover:bg-rbh-header-text/10">Our approach</Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-rbh-header-text/15 bg-rbh-panel">
            <Image src={communityImage} alt="Children and a teacher collaborating on a hands-on learning project" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute bottom-4 left-4 max-w-xs rounded-md bg-rbh-paper px-4 py-3 text-sm font-medium text-rbh-ink shadow-lg">Learning is a team sport.</div>
          </div>
        </div>
      </section>

      <section id="why-rbh" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-teal">Why RBH</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A bigger kind of English learning.</h2>
          <p className="mt-4 text-lg leading-8 text-rbh-ink/70">We bring together stories, creativity, and practical challenges so children build language skills while becoming more capable, curious people.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description, color }) => (
            <article key={title} className="border-t-2 border-rbh-ink/15 pt-5">
              <Icon className={`h-7 w-7 ${color}`} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-rbh-ink/65">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-rbh-ink/10 bg-rbh-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-rbh-panel"><Image src={exploreImage} alt="Learners collaborating around an AI education project" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div>
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-coral">Our next frontier</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Explore AI</h2>
            <p className="mt-5 text-lg leading-8 text-rbh-ink/70">A practical space for discovering how AI can make learning more personal, creative, and useful for people at every age.</p>
            <Link href="/project/explore-ai" className="mt-7 inline-flex items-center gap-2 font-semibold text-rbh-ink underline decoration-rbh-coral decoration-2 underline-offset-4 hover:text-rbh-coral">Discover More <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex gap-4"><BookOpen className="mt-1 h-6 w-6 shrink-0 text-rbh-coral" /><div><h3 className="font-semibold">Learning that adapts</h3><p className="mt-2 text-sm leading-6 text-rbh-ink/65">AI can respond to goals, context, and pace without losing the human direction behind the work.</p></div></div>
          <div className="flex gap-4"><Sparkles className="mt-1 h-6 w-6 shrink-0 text-rbh-gold" /><div><h3 className="font-semibold">Ideas into action</h3><p className="mt-2 text-sm leading-6 text-rbh-ink/65">We turn emerging technology into projects people can understand, use, and build on.</p></div></div>
          <div className="flex gap-4"><Users className="mt-1 h-6 w-6 shrink-0 text-rbh-teal" /><div><h3 className="font-semibold">Global by design</h3><p className="mt-2 text-sm leading-6 text-rbh-ink/65">Our platform thinking leaves room for different ages, cultures, disciplines, and ambitions.</p></div></div>
        </div>
      </section>

      <section className="bg-[#0f6861] text-[#f7f3ea] dark:bg-[#78aa9f] dark:text-[#102a43]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Keep exploring with RBH.</h2><p className="mt-3 max-w-xl text-[#c7ddd8] dark:text-[#153c46]">Read about the ideas, experiments, and learning experiences shaping our next brave moves.</p></div>
          <Link href="/blog" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-rbh-gold px-6 font-semibold text-rbh-header transition-[filter] hover:brightness-90 dark:bg-rbh-header dark:text-rbh-header-text dark:hover:brightness-125">Visit Blog <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
