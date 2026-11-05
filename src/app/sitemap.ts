import type { MetadataRoute } from 'next';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/catalog';

const BASE_URL = 'https://mikcameras.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/catalog`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/catalog?cat=${cat.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
