import { NextResponse } from "next/server";
import { properties } from "@/data/mock";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const property = properties.find((p) => p.id === params.id);
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(property);
}
