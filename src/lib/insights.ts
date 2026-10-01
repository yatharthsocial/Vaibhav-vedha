// Placeholder editorial content for the Insights listing page — real
// photography assets we already have (reused from src/lib/verticals.ts),
// but the posts themselves are filler copy written to show the layout
// working, meant to be swapped for real articles later.

export type InsightCategory = "Real Estate" | "Infrastructure" | "Legal" | "Design" | "Media";

export type Insight = {
  slug: string;
  category: InsightCategory;
  title: string;
  excerpt: string;
  image: string;
  color: string;
};

export const categories: InsightCategory[] = [
  "Real Estate",
  "Infrastructure",
  "Legal",
  "Design",
  "Media",
];

export const insights: Insight[] = [
  {
    slug: "sustainable-design-no-longer-optional",
    category: "Real Estate",
    title: "Why sustainable design is no longer optional",
    excerpt:
      "Buyers are asking about energy ratings before they ask about floor plans. Here's what that's changing about how we plan a project before the first brick is laid.",
    image: "/verticals/build.jpg",
    color: "#e0be4a",
  },
  {
    slug: "infrastructure-projects-go-green",
    category: "Infrastructure",
    title: "What changes when infrastructure projects go green",
    excerpt:
      "Green infrastructure isn't just solar panels bolted onto an old plan. It changes the sequencing, the vendors, and sometimes the whole site layout.",
    image: "/verticals/green.jpg",
    color: "#39ff14",
  },
  {
    slug: "compliance-reviews-fine-print",
    category: "Legal",
    title: "The fine print most companies miss in compliance reviews",
    excerpt:
      "It's rarely the headline clause that causes problems later. It's the definitions section nobody reads twice.",
    image: "/verticals/advise.jpg",
    color: "#c19bff",
  },
  {
    slug: "designing-offices-people-want",
    category: "Design",
    title: "Designing offices people actually want to work in",
    excerpt:
      "A good office isn't the one with the most amenities. It's the one that gets out of the way of the work.",
    image: "/verticals/learn.jpg",
    color: "#6fb8ff",
  },
  {
    slug: "brand-that-outlasts-a-campaign",
    category: "Media",
    title: "Building a brand that outlasts a single campaign",
    excerpt:
      "A campaign ends. The brand underneath it has to keep standing on its own, long after the media spend stops.",
    image: "/verticals/digital.jpg",
    color: "#4ee2e8",
  },
  {
    slug: "farm-plots-vs-apartments-2026",
    category: "Real Estate",
    title: "Farm plots vs apartments: what buyers are choosing in 2026",
    excerpt:
      "The math used to be simple. It isn't anymore, and the shift says a lot about what people actually want from a second property.",
    image: "/verticals/build.jpg",
    color: "#e0be4a",
  },
  {
    slug: "regulatory-foresight-vs-reactive-spend",
    category: "Legal",
    title: "Why regulatory foresight beats reactive legal spend",
    excerpt:
      "Paying for a compliance review before you need one is cheaper than paying for a fix after a regulator asks why you don't have one.",
    image: "/verticals/advise.jpg",
    color: "#c19bff",
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}
