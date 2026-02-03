import type { ResearchOutput, Response, ScriptwriterOutput } from "@/lib/types";

export async function scriptwriterAI(
  research: ResearchOutput,
): Promise<Response<ScriptwriterOutput>> {
  const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
  const OPEN_ROUTER_URL = process.env.OPEN_ROUTER_URL;
  const SCRIPTWRITER_MODEL = process.env.SCRIPTWRITER_MODEL;

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

  if (!SCRIPTWRITER_MODEL) {
    return {
      success: false,
      error: "Scriptwriter Model is not defined in environment variables",
    };
  }

  try {
    const res = await fetch(OPEN_ROUTER_URL, {
      method: "POST",

      signal: AbortSignal.timeout(120000),

      headers: {
        Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: SCRIPTWRITER_MODEL,
        messages: [
          {
            role: "system",
            content: `
            You are an expert technical blog writer.

            You MUST:
            - Write in valid Markdown
            - Follow all formatting rules exactly
            - Never include a title or H1 heading
            - Start immediately with an introduction paragraph (no headings before it)
            - Use clear, professional technical writing
            `,
          },
          {
            role: "user",
            content: `
            Topic:
            "${research.blogTitle}"

            Research notes:
            ${research.summary.join("\n")}

            Target keywords:
            ${research.keywords.join(", ")}

            Structure requirements (MANDATORY):
                - Start immediately with 2-3 introduction paragraphs (NO title, NO headings before text)
                - Add exactly 3-4 main content sections using ## headings (EXCLUDING Conclusion and Sources)
                - Each section must contain:
                    - 2-3 paragraphs
                    - At least one fenced code block with a real-world example
                - End with a ## Conclusion section
                - End with a ## Sources section formatted as a Markdown list

            Tone:
                - Clear
                - Confident
                - Practical
                - No fluff
                - No marketing language

            Code examples:
                - Prefer TypeScript or JavaScript unless another language is clearly more appropriate

            Sources to include:
            ${research.sources.map((s) => `- ${s}`).join("\n")}

            Length:
            - 800-1200 words total

            Markdown rules:
            - Use **bold** for emphasis
            - Use \`inline code\`
            - Use fenced code blocks with language identifiers when possible

            Write the blog post now.
            `,
          },
        ],
        temperature: 0.5,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `OpenRouter API error: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();

    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content || content.length < 100) {
      return {
        success: false,
        error: "Invalid or too short response from API",
      };
    }

    function extractSections(content: string): string[] {
      const sections = content
        .split("\n")
        .filter((line) => line.trim().startsWith("## "))
        .map((line) => line.replace(/^##\s*/, "").trim());

      return sections.length > 0 ? sections : [""];
    }

    const sections = extractSections(content);

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return {
      success: true,
      data: {
        title: research.blogTitle,
        content: content,
        sections,
        wordCount,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out after 120 seconds",
        };
      }
      return {
        success: false,
        error: `Failed to generate blog content: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
