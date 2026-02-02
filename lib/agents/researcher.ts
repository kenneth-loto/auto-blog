import type { Response } from "@/lib/types";

interface ResearchOutput {
  blogTitle: string;
  summary: string[];
  keywords: string[];
  sources: string[];
}

export async function researcher(
  topic: string,
): Promise<Response<ResearchOutput>> {
  const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
  const OPEN_ROUTER_URL = process.env.OPEN_ROUTER_URL;
  const RESEARCHER_MODEL = process.env.RESEARCHER_MODEL;

  if (!OPEN_ROUTER_URL) {
    return {
      success: false,
      error: "OpenRouter URL is not defined in environment variables",
    };
  }

  if (!RESEARCHER_MODEL) {
    return {
      success: false,
      error: "Researcher Model is not defined in environment variables",
    };
  }

  try {
    const res = await fetch(OPEN_ROUTER_URL, {
      method: "POST",

      signal: AbortSignal.timeout(30000),

      headers: {
        Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: RESEARCHER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a technical researcher AI. Gather factual, concise information about a technical topic. Provide clear summaries, keywords, sources, and a blog-ready title in a structured JSON format.",
          },
          {
            role: "user",
            content: `
            Research this topic: "${topic}"

            YOU MUST respond with ONLY valid JSON, no markdown, no explanations.

            Format:
                {
                "blogTitle": "5-12 word catchy title",
                "summary": ["sentence 1", "sentence 2", "sentence 3", "sentence 4", "sentence 5"],
                "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
                "sources": ["source1", "source2", "source3"]
                }

            Requirements:
                - Blog title: clear, technical, 5-12 words
                - Summary: exactly 5-8 sentences explaining the topic
                - Keywords: exactly 5 relevant technical terms
                - Sources: 1-3 authoritative URLs or references

            Return ONLY the JSON object, nothing else.
            `,
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `OpenRouter API error: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "Invalid response structure from API",
      };
    }

    let parsed: ResearchOutput;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return {
        success: false,
        error: `Failed to parse AI response as JSON: ${(err as Error).message}`,
      };
    }

    return {
      success: true,
      data: {
        blogTitle: parsed.blogTitle || topic,
        summary: parsed.summary || ["No summary generated."],
        keywords: parsed.keywords || [],
        sources: (parsed.sources || []).filter((url) => {
          try {
            new URL(url);

            return true;
          } catch {
            return false;
          }
        }),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out after 30 seconds",
        };
      }
      return {
        success: false,
        error: `Failed to research topic: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
