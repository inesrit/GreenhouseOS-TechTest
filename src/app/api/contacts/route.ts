import { NextResponse } from "next/server";
import { contacts } from "@/data/mock";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  //TODO: Implement actual filtering logic based on propertyId
  if (propertyId) {
    return NextResponse.json([]);
  }

  return NextResponse.json(contacts);
}
