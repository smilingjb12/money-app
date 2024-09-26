import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

export async function GET() {
  await fetchMutation(api.thumbnails.createThumbnail, {
    title: "Nice",
  });
  return NextResponse.json({ message: "Hello World" });
}
