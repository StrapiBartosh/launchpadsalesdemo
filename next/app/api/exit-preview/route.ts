import { draftMode } from "next/headers";

export async function GET(request: Request) {
  draftMode().disable();

  return new Response("Draft mode disabled", { status: 200 });
}
