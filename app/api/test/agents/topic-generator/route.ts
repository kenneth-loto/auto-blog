import { NextResponse } from "next/server";
import { generateTechTopic } from "@/lib/agents/topic-generator";

export async function GET() {
  const result = await generateTechTopic();

  if (result.success) {
    return NextResponse.json(
      {
        agent: "Topic Generator",
        output: result.data,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      agent: "Topic Generator",
      error: result.error,
    },
    { status: 500 },
  );
}
