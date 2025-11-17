import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing credentials. Please pass an 'apiKey', or set the 'OPENAI_API_KEY' environment variable.");
    }
    client = new OpenAI({
      apiKey,
    });
  }
  return client;
}

type BaseInput = {
  businessName: string;
  city: string;
  service: string;
  tone: string;
};

export async function generateBlog(input: BaseInput) {
  const system =
    "You are an expert local SEO writer. Produce helpful, unique, locally relevant content in clean Markdown with H2/H3 headings, bullets where useful, and a short CTA at the end. No keyword stuffing.";
  const user = `Business: ${input.businessName}
City: ${input.city}
Service: ${input.service}
Tone: ${input.tone}

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

export async function generateGBPPost(input: BaseInput) {
  const system =
    "You are a GBP content specialist. Write concise, engaging posts for Google Business Profile that feel local and useful. Output Markdown only, no hashtags.";
  const user = `Business: ${input.businessName}
City: ${input.city}
Service: ${input.service}
Tone: ${input.tone}

Write a 120–200 word GBP post announcing value for local customers (offer, tip, event, update). Include a clear CTA ("Call us", "Book now"). Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

export async function generateFAQs(input: BaseInput) {
  const system =
    "You craft concise, helpful FAQs for local service businesses. Output Markdown with H3 for each question and a short paragraph answer. Avoid generic filler.";
  const user = `Business: ${input.businessName}
City: ${input.city}
Service: ${input.service}
Tone: ${input.tone}

Write 6–10 FAQs customers in ${input.city} often ask about ${input.service}. Make them locally relevant. Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

export async function generateReviewReply(input: {
  businessName: string;
  city: string;
  rating: number;
  text: string;
}) {
  const system = `You write respectful, personalized Google review replies. Keep it human, concise (<120 words), and specific. 
For 1–3 stars: apologize, invite private resolution with a concrete next step.
For 4–5 stars: thank them, refer to something specific, and invite them back. Avoid canned clichés. Output plain text only.`;
  const user = `Business: ${input.businessName}
City: ${input.city}
Review rating: ${input.rating}
Review text: ${input.text}

Write one reply (<120 words). Output plain text only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

export type ProfileAuditInput = {
  mode: "connected" | "quick";
  businessName?: string | null;
  city?: string | null;
  category?: string | null;
  urlOrName?: string | null;
  gbpData?: any | null; // raw row from gbp_locations when available
};

export async function generateProfileAudit(input: ProfileAuditInput): Promise<string> {
  const system =
    "You are an expert local SEO and Google Business Profile consultant. You analyze local businesses and give very practical, actionable recommendations.";

  const contextJson = JSON.stringify(input, null, 2);

  let userMessage = `Context:\n${contextJson}\n\n`;

  if (input.mode === "connected") {
    userMessage += `Mode: connected\n`;
    if (input.gbpData) {
      userMessage += `The gbpData object contains columns from gbp_locations table (name, address, categories, rating, etc.). Use this data to provide specific, data-driven recommendations.\n\n`;
    }
  } else {
    userMessage += `Mode: quick\n`;
    userMessage += `We only know the URL or name, city, and category. Infer and generalize recommendations based on best practices for this type of business.\n\n`;
  }

  userMessage += `Analyze this business profile and return markdown only with the following sections:\n\n`;
  userMessage += `## Overview\n`;
  userMessage += `2–3 sentences summarizing the current state.\n\n`;
  userMessage += `## Quick score (0–100)\n`;
  userMessage += `A single line like: Score: 78/100\n\n`;
  userMessage += `## Priority fixes (next 7 days)\n`;
  userMessage += `Bullet list of the most critical issues to address.\n\n`;
  userMessage += `## Suggested GBP name\n`;
  userMessage += `1–2 SEO-friendly variants of the business name.\n\n`;
  userMessage += `## Suggested description\n`;
  userMessage += `Around 600–800 characters of an optimized business description.\n\n`;
  userMessage += `## Post ideas\n`;
  userMessage += `5–8 post ideas with titles and one-line angles.\n\n`;
  userMessage += `## Image recommendations\n`;
  userMessage += `4–6 concrete image ideas that would improve the profile.\n\n`;
  userMessage += `Output Markdown only.`;

  const res = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: userMessage },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

