import { NextResponse } from "next/server";
import { topicGeneratorAI } from "@/lib/agents/topic-generator";

export async function GET() {
  const topic = await topicGeneratorAI();

  if (topic.success) {
    return NextResponse.json(
      {
        agent: "Topic Generator",
        output: topic.data,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      agent: "Topic Generator",
      error: topic.error,
    },
    { status: 500 },
  );
}
