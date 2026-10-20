import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quranacademyapp.vercel.app";
  const now = new Date();

  const publicRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/trial", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/programmes", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/packages", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/teach-with-us", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/payments", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/downloads", priority: 0.65, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/delivery-refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
