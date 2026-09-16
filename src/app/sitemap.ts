import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site-config";
import { createClient } from "@/lib/supabase/server";

const staticRoutes = [
  "",
  "/machinery",
  "/production-lines",
  "/products",
  "/solutions",
  "/about",
  "/fine-foods",
  "/amir-engineering",
  "/projects",
  "/contact",
  "/quote/request",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: machinery }, { data: categories }, { data: lines }] = await Promise.all([
    supabase.from("machinery").select("slug, updated_at").eq("is_active", true),
    supabase.from("machinery_categories").select("slug").eq("is_active", true),
    supabase.from("production_lines").select("slug, updated_at").eq("is_active", true),
  ]);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  for (const item of machinery ?? []) {
    entries.push({ url: `${siteConfig.url}/machinery/${item.slug}`, lastModified: new Date(item.updated_at) });
  }

  for (const category of categories ?? []) {
    entries.push({ url: `${siteConfig.url}/machinery/category/${category.slug}` });
  }

  for (const line of lines ?? []) {
    entries.push({ url: `${siteConfig.url}/production-lines/${line.slug}`, lastModified: new Date(line.updated_at) });
  }

  return entries;
}
