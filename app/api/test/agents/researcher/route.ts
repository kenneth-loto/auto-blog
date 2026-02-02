import { NextResponse } from "next/server";
import { researcher } from "@/lib/agents/researcher";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return NextResponse.json(
      { agent: "Researcher", error: "Missing topic parameter" },
      { status: 400 },
    );
  }

  const result = await researcher(topic);

  if (result.success) {
    return NextResponse.json(
      {
        agent: "Researcher",
        data: result.data,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      agent: "Researcher",
      error: result.error,
    },
    { status: 500 },
  );
}
