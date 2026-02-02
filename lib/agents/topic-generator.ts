import type { Response } from "@/lib/types";

export async function generateTechTopic(): Promise<Response<string>> {
  const OPEN_ROUTER_URL = process.env.OPEN_ROUTER_URL;
  const TOPIC_GENERATOR_MODEL = process.env.TOPIC_GENERATOR_MODEL;

  if (!OPEN_ROUTER_URL) {
    return {
      success: false,
      error: "OpenRouter URL is not defined in environment variables",
    };
  }

  if (!TOPIC_GENERATOR_MODEL) {
    return {
      success: false,
      error: "Topic Generator Model is not defined in environment variables",
    };
  }

  try {
    const res = await fetch(OPEN_ROUTER_URL, {
      method: "POST",

      signal: AbortSignal.timeout(30000),

      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: TOPIC_GENERATOR_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a technical topic generator. ONLY output short 2-6 word topics. Never use generic words. Avoid repeating previous concepts. Count words carefully.",
          },
          {
            role: "user",
            content: `
            Generate ONE technical blog topic.

            Rules:
            - Exactly 2-6 words
            - No punctuation
            - Focus on a single technical concept, tool, or framework
            - Avoid words: programming, coding
            - Avoid repeating concepts or synonyms from previous topics

            Examples:
            - API Design Patterns
            - GraphQL Performance
            - Cloud DevOps
            - Event Driven Architecture
            - Type Safety in Codebases
            - AI Assisted Testing
            - Microservices Observability
            - CI/CD Pipelines

            Return ONLY the topic text.
            Topic:
            `,
          },
        ],
        temperature: 0.7,
        max_tokens: 30,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `OpenRouter API error: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();

    if (!data?.choices?.[0]?.message?.content) {
      return {
        success: false,
        error: "Invalid response structure from API",
      };
    }

    return {
      success: true,
      data: data.choices[0].message.content.trim(),
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
        error: `Failed to generate topic: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
