import FadeIn from '@/components/ui/FadeIn';

interface PageHeroProps {
  title: string;
  highlight?: string;
  description: string;
}

export default function PageHero({ title, highlight, description }: PageHeroProps) {
  return (
    <section className="px-4 pt-6 pb-2 sm:px-6 sm:pt-10">
      <div className="relative mx-auto flex max-w-7xl min-h-[30vh] items-center justify-center overflow-hidden rounded-3xl bg-azul-acropolis px-6 py-16 text-white shadow-xl sm:min-h-[32vh]">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#hero-pattern)" />
          <defs>
            <linearGradient id="hero-pattern" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c7a7b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a202c" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <FadeIn>
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {title} {highlight && <span className="text-amarillo">{highlight}</span>}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80 sm:text-xl">
            {description}
          </p>
        </FadeIn>
      </div>
      </div>
    </section>
  );
}
