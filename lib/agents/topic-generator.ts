import type { Response } from "@/lib/types";

export async function topicGeneratorAI(): Promise<Response<string>> {
  const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
  const OPEN_ROUTER_URL = process.env.OPEN_ROUTER_URL;
  const TOPIC_GENERATOR_MODEL = process.env.TOPIC_GENERATOR_MODEL;

  if (!OPEN_ROUTER_API_KEY) {
    return {
      success: false,
      error: "OpenRouter API key is not defined in environment variables",
    };
  }

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
        Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
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
            Generate ONE highly specific technical blog topic.

            Requirements:
              - Exactly 2-6 words
              - No punctuation
              - Focus on a single technical concept, tool, or framework
              - Avoid generic words such as programming, coding, software
              - Avoid repeating concepts or synonyms from previous topics
              - Topics must be novel, actionable, and relevant to modern software development or engineering
              - Think like a technical blogger brainstorming engaging content

            Audience:
              - Professional developers
              - Technical decision-makers
              - Readers interested in advanced or emerging technology trends

            Format:
              - Return ONLY the topic text
              - No lists, no explanations

            Examples of high-quality topics:
              - GraphQL Performance Optimization
              - Microservices Observability Practices
              - TypeScript Generics Deep Dive
              - AI Assisted Testing Workflows
              - CI/CD Pipeline Automation

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

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "Invalid response structure from API",
      };
    }

    return {
      success: true,
      data: content.trim(),
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
