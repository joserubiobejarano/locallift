import { getClient } from "@/lib/openai";

type LocalSEOInput = {
  businessName: string;
  city: string;
  category?: string;
  topics?: string[];
  tone?: string;
};

export async function generateLocalContent({
  businessName,
  city,
  category,
  topics = [],
  tone = "friendly and helpful",
}: LocalSEOInput): Promise<string> {
  const system = `You are an expert local SEO content writer specializing in hyper-local, neighborhood-specific content for small businesses. 
You have deep knowledge of:
- City neighborhoods, landmarks, and local culture
- Seasonal events and local happenings
- Community-specific language and references
- Local business best practices
- SEO-aware writing that feels natural, not keyword-stuffed

Your writing is:
- Friendly, helpful, and authentic
- Specific to the business's location and community
- SEO-optimized without being obvious
- Practical and actionable
- Engaging and conversational`;

  const topicsText = topics.length > 0 ? `\nTopics/angles: ${topics.join(", ")}` : "";
  const categoryText = category ? `\nCategory: ${category}` : "";

  const user = `Business: ${businessName}
City: ${city}${categoryText}${topicsText}
Tone: ${tone}

Write content that:
1. References specific neighborhoods, landmarks, or local areas in ${city}
2. Mentions local events, seasons, or community happenings when relevant
3. Uses natural local language and references
4. Feels authentic to the business and location
5. Includes practical, actionable information
6. Is SEO-friendly but reads naturally

Output clean Markdown with H2/H3 headings, bullets where useful, and a short CTA at the end.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

export async function generateLocalBlogPost(input: LocalSEOInput): Promise<string> {
  const system = `You are an expert local SEO writer. Produce helpful, unique, locally relevant blog posts in clean Markdown with H2/H3 headings, bullets where useful, and a short CTA at the end. No keyword stuffing.`;

  const topicsText = input.topics && input.topics.length > 0 ? `\nTopics/angles: ${input.topics.join(", ")}` : "";
  const categoryText = input.category ? `\nCategory: ${input.category}` : "";

  const user = `Business: ${input.businessName}
City: ${input.city}${categoryText}${topicsText}
Tone: ${input.tone || "Friendly and helpful"}

Write an 800–1200 word blog post targeting local search intent with 3–5 specific local references (neighborhoods, landmarks, seasonal events). Include practical tips and avoid fluff. Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

export async function generateLocalGBPPost(input: LocalSEOInput): Promise<string> {
  const system = `You are a GBP content specialist. Write concise, engaging posts for Google Business Profile that feel local and useful. Output Markdown only, no hashtags.`;

  const topicsText = input.topics && input.topics.length > 0 ? `\nTopics/angles: ${input.topics.join(", ")}` : "";
  const categoryText = input.category ? `\nCategory: ${input.category}` : "";

  const user = `Business: ${input.businessName}
City: ${input.city}${categoryText}${topicsText}
Tone: ${input.tone || "Friendly and helpful"}

Write a 120–200 word GBP post announcing value for local customers (offer, tip, event, update). Include a clear CTA ("Call us", "Book now"). Make it feel local to ${input.city}. Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

export async function generateLocalFAQs(input: LocalSEOInput): Promise<string> {
  const system = `You craft concise, helpful FAQs for local service businesses. Output Markdown with H3 for each question and a short paragraph answer. Avoid generic filler.`;

  const categoryText = input.category ? `\nCategory: ${input.category}` : "";

  const user = `Business: ${input.businessName}
City: ${input.city}${categoryText}
Tone: ${input.tone || "Friendly and helpful"}

Write 6–10 FAQs customers in ${input.city} often ask about ${input.category || "this business"}. Make them locally relevant. Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

