import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Links | Edmond A Porter',
};

const links = [
  {
    label: <>Pre-order <i>Turbulent Waters</i></>,
    href: 'https://www.amazon.com/Turbulent-Waters-Edmond-Porter-ebook/dp/B0GRLFBQJX',
    external: true,
    accent: true,
  },
  {
    label: 'Official Website',
    href: '/',
    external: false,
    accent: false,
  },
  {
    label: 'Amazon Author Page',
    href: 'https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y',
    external: true,
    accent: false,
  },
  {
    label: 'Goodreads Author Page',
    href: 'https://www.goodreads.com/author/show/60996287.Edmond_A_Porter',
    external: true,
    accent: false,
  },
  {
    label: 'Read Recent Articles on Medium',
    href: 'https://medium.com/@eporter609',
    external: true,
    accent: false,
  },
  {
    label: "The Writer's Cache",
    href: 'http://www.writerscache.org/',
    external: true,
    accent: false,
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="relative w-[200px] h-[200px] mb-8">
          <Image
            src="/images/Edmond_Headshot.webp"
            alt="Edmond A Porter"
            width={200}
            height={200}
            className="rounded-full border-4 border-slate-700 object-cover w-full h-full object-[center_30%]"
            priority
          />
        </div>

        <h1 className="font-headline text-2xl font-bold text-white mb-2">
          Edmond A Porter
        </h1>

        <p className="font-body text-slate-400 text-sm mb-8">
          Historical Fiction & Memoir Author
        </p>

        <div className="w-full space-y-4">
          {links.map((link) => {
            const className = [
              'block w-full text-center py-4 px-6 rounded-xl font-body font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
              link.accent ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-slate-800 text-white hover:bg-slate-700',
            ].join(' ');

            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
