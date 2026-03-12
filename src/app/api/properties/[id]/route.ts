import { NextResponse } from "next/server";
import { properties } from "@/data/mock";
import { UI_TEXT } from "@/constants";

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const property = properties.find((p) => p.id === params.id);
  if (!property) {
    return NextResponse.json({ error: UI_TEXT.API_PROPERTY_NOT_FOUND }, { status: 404 });
  }
  return NextResponse.json(property, {
    headers: CACHE_HEADERS,
  });
}
