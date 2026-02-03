import { NextResponse } from "next/server";
import { researcherAI } from "@/lib/agents/researcher";
import { topicGeneratorAI } from "@/lib/agents/topic-generator";

export async function GET() {
  const topic = await topicGeneratorAI();

  if (!topic.success) {
    return NextResponse.json(
      {
        agent: "Topic Generator",
        error: topic.error,
      },
      { status: 500 },
    );
  }

  const research = await researcherAI(topic.data);

  if (research.success) {
    return NextResponse.json(
      {
        agent: "Researcher",
        data: research.data,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      agent: "Researcher",
      error: research.error,
    },
    { status: 500 },
  );
}
