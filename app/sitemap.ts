import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { paginas, journal } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.colegioacropolis.net';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch dynamic pages
  const dynamicPages = await db.select().from(paginas).where(eq(paginas.activo, true));
  const pageRoutes: MetadataRoute.Sitemap = dynamicPages.map((page) => ({
    url: `${baseUrl}${page.slug}`,
    lastModified: page.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Fetch journal posts
  const posts = await db.select().from(journal).where(eq(journal.publicado, true));
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...routes, ...pageRoutes, ...postRoutes];
}
